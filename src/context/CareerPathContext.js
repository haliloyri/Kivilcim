import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { FEATURE_FLAGS } from '../config/featureFlags';
import { COMMON_PATH_ID, PATH_IDS } from '../constants/careerPath';
import { awardCareerNodes, getCareerEvents, getCareerState, getEarnedCareerNodes, getLegacyBadgeIds, markCareerNodeSeen, replaceLegacyBadgeIds, upsertCareerState } from '../db/userDb';
import { subscribeToCareerEvents } from '../services/careerEvents';
import { buildCareerViewModel } from '../utils/careerProgress';
import { mergeCareerEvents, mergeCareerNodes, mergeCareerState } from '../utils/careerSync';
import { ANALYTICS_EVENTS, trackEvent } from '../utils/analytics';
import { enqueueAndSync } from '../services/offlineQueue';
import { getCareerSnapshotFromServer } from '../services/supabase';
import { useStories } from './StoriesContext';

const CareerPathContext = createContext(null);
const USER_ID = 'default';

const emptyValue = {
  enabled: false,
  loading: false,
  refreshing: false,
  error: null,
  isOffline: false,
  career: null,
  careerViewModel: null,
  activePath: null,
  unseenPromotions: [],
  unseenPromotionCount: 0,
  activePromotion: null,
  showMigrationSummary: false,
  pathSwitchRequested: false,
  conditionsRequested: false,
  conditionsNodeId: null,
  refreshCareer: async () => null,
  selectPath: async () => null,
  switchPath: async () => null,
  markPromotionSeen: async () => null,
  markPromotionsSeen: async () => null,
  closePromotion: async () => null,
  markMigrationSummarySeen: async () => null,
  requestPathSwitch: () => null,
  consumePathSwitchRequest: () => null,
  requestConditions: () => null,
  consumeConditionsRequest: () => null,
};

const eligibleNodes = (viewModel) => {
  if (!viewModel) return [];
  const nodes = viewModel.activePath
    ? [...viewModel.commonNodes, ...viewModel.paths[viewModel.activePath]]
    : viewModel.commonNodes;
  return nodes.filter((node) => node.status !== 'completed' && node.isEligible);
};

export const CareerPathProvider = ({ children }) => {
  const { parentCategories, storiesLoading } = useStories();
  const [state, setState] = useState({ ...emptyValue, enabled: FEATURE_FLAGS.careerPathV1, loading: FEATURE_FLAGS.careerPathV1 });
  const loadVersionRef = useRef(0);

  const loadCareer = useCallback(async ({ awardEligible = true, awardSource = 'live_event' } = {}) => {
    if (!FEATURE_FLAGS.careerPathV1) return null;
    const loadVersion = ++loadVersionRef.current;
    try {
      const [localEvents, localCareerState, localEarnedNodes, localLegacyBadgeIds] = await Promise.all([
        getCareerEvents(USER_ID),
        getCareerState(USER_ID),
        getEarnedCareerNodes(USER_ID),
        getLegacyBadgeIds(USER_ID),
      ]);
      const availableCategoryCount = Array.isArray(parentCategories) && parentCategories.length > 0 ? parentCategories.length : undefined;
      const makeViewModel = (events, earnedNodes, careerState) => {
        const unseenPromotions = earnedNodes.filter((node) => !(node.seenAt ?? node.seen_at));
        return {
          unseenPromotions,
          viewModel: buildCareerViewModel({
            events,
            earnedNodes,
            activePath: careerState.activePath,
            availableCategoryCount,
            unseenPromotionCount: unseenPromotions.length,
          }),
        };
      };
      const local = makeViewModel(localEvents, localEarnedNodes, localCareerState);
      const viewModel = local.viewModel;
      if (loadVersion !== loadVersionRef.current) return viewModel;
      const awards = awardEligible ? eligibleNodes(viewModel) : [];
      if (awards.length) {
        const awardPayload = awards.map((node) => ({
          nodeId: node.id,
          pathId: node.pathId,
          order: node.order,
          ruleVersion: node.ruleVersion,
          earnedAt: new Date().toISOString(),
          awardSource,
          requirementsSnapshot: node.requirementRows,
        }));
        await awardCareerNodes(USER_ID, awardPayload);
        awardPayload.forEach((node) => {
          trackEvent(ANALYTICS_EVENTS.CAREER_NODE_COMPLETED, { careerVersion: node.ruleVersion, pathId: node.pathId, nodeId: node.nodeId, source: node.awardSource, backfilled: false });
          if (node.pathId !== COMMON_PATH_ID && node.order === 3) {
            trackEvent(ANALYTICS_EVENTS.CAREER_PATH_COMPLETED, { careerVersion: node.ruleVersion, pathId: node.pathId, nodeId: node.nodeId, source: node.awardSource, backfilled: false });
          }
        });
        enqueueAndSync('award_career_nodes', { nodes: awardPayload });
        return loadCareer({ awardEligible: false, awardSource });
      }
      // Never make a cached title/rank disappear while a server request is slow.
      setState((previous) => ({ ...previous, enabled: true, loading: false, refreshing: true, error: null, career: viewModel, unseenPromotions: local.unseenPromotions, showMigrationSummary: localCareerState.migrationVersion >= 1 && !localCareerState.migrationSummarySeenAt }));

      // The remote snapshot is additive. A newer local reload invalidates this
      // background result before it can replace the current projection.
      getCareerSnapshotFromServer().then(async (remoteSnapshot) => {
        if (!remoteSnapshot || loadVersion !== loadVersionRef.current) {
          if (loadVersion === loadVersionRef.current) setState((previous) => ({ ...previous, refreshing: false }));
          return;
        }
        const events = mergeCareerEvents(localEvents, remoteSnapshot.events);
        const earnedNodes = mergeCareerNodes(localEarnedNodes, remoteSnapshot.nodes);
        const careerState = mergeCareerState(localCareerState, remoteSnapshot.state);
        const legacyBadgeIds = [...new Set([...(localLegacyBadgeIds || []), ...(remoteSnapshot.legacyBadgeIds || [])])];
        if (
          careerState.migrationVersion !== localCareerState.migrationVersion
          || careerState.migrationSummarySeenAt !== localCareerState.migrationSummarySeenAt
          || careerState.introSeenAt !== localCareerState.introSeenAt
        ) await upsertCareerState(USER_ID, careerState);
        if (legacyBadgeIds.length !== localLegacyBadgeIds.length) await replaceLegacyBadgeIds(USER_ID, legacyBadgeIds);
        if (loadVersion !== loadVersionRef.current) return;
        const merged = makeViewModel(events, earnedNodes, careerState);
        setState((previous) => ({ ...previous, enabled: true, loading: false, refreshing: false, error: null, career: merged.viewModel, unseenPromotions: merged.unseenPromotions, showMigrationSummary: careerState.migrationVersion >= 1 && !careerState.migrationSummarySeenAt }));
      }).catch((error) => {
        // Server sync is best-effort; the local projection remains usable.
        console.warn('[CareerPathContext] remote refresh failed:', error?.message);
        if (loadVersion === loadVersionRef.current) setState((previous) => ({ ...previous, refreshing: false }));
      });
      return viewModel;
    } catch (error) {
      console.warn('[CareerPathContext] load failed:', error?.message);
      setState((previous) => ({ ...previous, enabled: true, loading: false, refreshing: false, error, career: previous.career || null }));
      return null;
    }
  }, [parentCategories]);

  useEffect(() => {
    if (!FEATURE_FLAGS.careerPathV1) return undefined;
    setState((previous) => ({ ...previous, enabled: true, loading: true }));
    loadCareer();
    return subscribeToCareerEvents(() => loadCareer());
  }, [loadCareer]);

  useEffect(() => {
    if (!FEATURE_FLAGS.careerPathV1 || storiesLoading) return;
    loadCareer();
  }, [storiesLoading, parentCategories, loadCareer]);

  useEffect(() => NetInfo.addEventListener((network) => {
    const offline = !network.isConnected || network.isInternetReachable === false;
    setState((previous) => previous.isOffline === offline ? previous : { ...previous, isOffline: offline });
    if (!offline) loadCareer({ awardEligible: false });
  }), [loadCareer]);

  const selectPath = useCallback(async (pathId, selectionSource = 'user') => {
    if (!Object.values(PATH_IDS).includes(pathId)) throw new Error(`[CareerPathContext] Invalid path: ${pathId}.`);
    const selectedAt = new Date().toISOString();
    await upsertCareerState(USER_ID, { activePath: pathId, selectedAt, selectionSource });
    enqueueAndSync('upsert_career_state', { patch: { activePath: pathId, ruleVersion: 1, selectedAt, selectionSource } });
    trackEvent(ANALYTICS_EVENTS.CAREER_PATH_SELECTED, { careerVersion: 1, pathId, selectionSource });
    if (selectionSource === 'user_switch') trackEvent(ANALYTICS_EVENTS.CAREER_PATH_FOCUS_CHANGED, { careerVersion: 1, pathId, source: selectionSource });
    return loadCareer({ awardSource: 'path_switch_backfill' });
  }, [loadCareer]);

  const switchPath = useCallback((pathId) => selectPath(pathId, 'user_switch'), [selectPath]);

  const markPromotionSeen = useCallback(async (nodeId) => {
    await markCareerNodeSeen(USER_ID, nodeId);
    enqueueAndSync('mark_career_node_seen', { nodeId });
    return loadCareer({ awardEligible: false });
  }, [loadCareer]);

  const markPromotionsSeen = useCallback(async (nodeIds = []) => {
    await Promise.all(nodeIds.filter(Boolean).map((nodeId) => markCareerNodeSeen(USER_ID, nodeId)));
    nodeIds.filter(Boolean).forEach((nodeId) => enqueueAndSync('mark_career_node_seen', { nodeId }));
    return loadCareer({ awardEligible: false });
  }, [loadCareer]);

  const markMigrationSummarySeen = useCallback(async () => {
    const migrationSummarySeenAt = new Date().toISOString();
    await upsertCareerState(USER_ID, { migrationSummarySeenAt });
    enqueueAndSync('upsert_career_migration_state', { migrationSummarySeenAt });
    trackEvent(ANALYTICS_EVENTS.CAREER_MIGRATION_SUMMARY_SEEN, { careerVersion: 1 });
    return loadCareer({ awardEligible: false });
  }, [loadCareer]);

  const requestPathSwitch = useCallback(() => {
    setState((previous) => ({ ...previous, pathSwitchRequested: true }));
  }, []);

  const consumePathSwitchRequest = useCallback(() => {
    setState((previous) => ({ ...previous, pathSwitchRequested: false }));
  }, []);

  // Navigation to Yolum is sometimes an instruction (from Home), not just a
  // destination. Keep that instruction in the provider so it survives the tab
  // transition, then let the screen consume it exactly once.
  const requestConditions = useCallback((nodeId = null) => {
    setState((previous) => ({ ...previous, conditionsRequested: true, conditionsNodeId: nodeId }));
  }, []);

  const consumeConditionsRequest = useCallback(() => {
    setState((previous) => ({ ...previous, conditionsRequested: false, conditionsNodeId: null }));
  }, []);

  const activePromotion = state.unseenPromotions[state.unseenPromotions.length - 1] || null;
  const closePromotion = useCallback(async () => {
    if (!activePromotion?.nodeId) return null;
    return markPromotionSeen(activePromotion.nodeId);
  }, [activePromotion?.nodeId, markPromotionSeen]);

  const value = useMemo(() => ({
    ...state,
    careerViewModel: state.career,
    activePath: state.career?.activePath || null,
    activePromotion,
    unseenPromotionCount: state.unseenPromotions.length,
    refreshCareer: loadCareer,
    selectPath,
    switchPath,
    markPromotionSeen,
    markPromotionsSeen,
    closePromotion,
    markMigrationSummarySeen,
    requestPathSwitch,
    consumePathSwitchRequest,
    requestConditions,
    consumeConditionsRequest,
  }), [state, activePromotion, loadCareer, selectPath, switchPath, markPromotionSeen, markPromotionsSeen, closePromotion, markMigrationSummarySeen, requestPathSwitch, consumePathSwitchRequest, requestConditions, consumeConditionsRequest]);

  return <CareerPathContext.Provider value={value}>{children}</CareerPathContext.Provider>;
};

export const useCareerPath = () => useContext(CareerPathContext) || emptyValue;
