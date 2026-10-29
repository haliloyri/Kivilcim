// Voice recording for a story ("tell it aloud"): the hook holds recorder and
// playback state, the sheet is the UI. Lives on the conversation screen, next
// to the other ways of practising how to tell the story.
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Alert, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  AudioModule,
  setAudioModeAsync,
  createAudioPlayer,
} from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { useUserData } from '../../context/UserDataContext';
import { t } from '../../locales/i18n';
import { intlLocaleFor } from '../../utils/locale';

export const MAX_RECORDINGS = 3;
// Recording stops by itself after 90 seconds.
export const MAX_DURATION_MS = 90 * 1000;

export const formatDuration = (ms) => {
  const totalSec = Math.floor((ms || 0) / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/** Up to 3 recordings per story: [{uri, durationMs, date}], kept in AsyncStorage. */
export const useStoryVoiceRecorder = (story, lang) => {
  const { recordCareerInsight } = useUserData();
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const stopTimeoutRef = useRef(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordings, setRecordings] = useState([]);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [soundObj, setSoundObj] = useState(null);
  const storyId = story?.story_id;
  const listKey = `story_audio_list_${storyId}`;

  React.useEffect(() => () => {
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
  }, []);

  React.useEffect(() => (soundObj ? () => { soundObj.remove(); } : undefined), [soundObj]);

  React.useEffect(() => {
    (async () => {
      try {
        if (!storyId) return;
        const raw = await AsyncStorage.getItem(listKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setRecordings(parsed);
        }
      } catch (e) {
        console.warn('Failed to load saved audio list', e);
      }
    })();
  }, [storyId, listKey]);

  const startRecording = async () => {
    if (recordings.length >= MAX_RECORDINGS) return;
    try {
      if (soundObj) {
        soundObj.remove();
        setSoundObj(null);
        setPlayingIndex(null);
      }
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (permission.granted) {
        await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
        isRecordingRef.current = true;
        setIsRecording(true);
        setRecordingDuration(0);
        if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = setTimeout(() => stopRecording(MAX_DURATION_MS), MAX_DURATION_MS);
      } else {
        Alert.alert(t('alert_error', lang) || 'Error', 'Mikrofon izni gereklidir.');
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async (finalDuration = recordingDuration) => {
    if (!isRecordingRef.current) return;
    try {
      isRecordingRef.current = false;
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
      setIsRecording(false);
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      const updated = [...recordings, { uri, durationMs: finalDuration, date: new Date().toISOString() }].slice(0, MAX_RECORDINGS);
      setRecordings(updated);
      if (storyId) await AsyncStorage.setItem(listKey, JSON.stringify(updated));

      if (uri && finalDuration >= 3000 && storyId) {
        await recordCareerInsight({
          storyId,
          categoryId: story?.parent_cat_id ?? null,
          eventSubtype: 'voice_recording',
          metadata: { source: 'voice_recording' },
        });
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  // expo-audio reports recording progress via recorderState. Mirror it into
  // recordingDuration and auto-stop when the max length is reached.
  React.useEffect(() => {
    if (!isRecording) return;
    const ms = recorderState.durationMillis || 0;
    setRecordingDuration(ms);
    if (ms >= MAX_DURATION_MS) stopRecording(MAX_DURATION_MS);
  }, [recorderState.durationMillis, isRecording]);

  const toggleRecording = () => (isRecording ? stopRecording() : startRecording());

  const playRecording = async (index) => {
    try {
      if (soundObj) {
        soundObj.remove();
        setSoundObj(null);
      }
      // Tap same index while playing → stop
      if (playingIndex === index) {
        setPlayingIndex(null);
        return;
      }
      const rec = recordings[index];
      if (!rec?.uri) return;

      // allowsRecording:false routes playback to the loud speaker after a
      // recording session (otherwise iOS keeps it quiet on the earpiece).
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      const newSound = createAudioPlayer({ uri: rec.uri });
      setSoundObj(newSound);
      setPlayingIndex(index);
      newSound.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          setPlayingIndex(null);
          newSound.seekTo(0);
        }
      });
      newSound.play();
    } catch (error) {
      console.error('Failed to play audio', error);
    }
  };

  const deleteRecording = async (index) => {
    try {
      if (playingIndex === index && soundObj) {
        soundObj.remove();
        setSoundObj(null);
        setPlayingIndex(null);
      }
      const updated = recordings.filter((_, i) => i !== index);
      setRecordings(updated);
      await AsyncStorage.setItem(listKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to delete recording', error);
    }
  };

  return { isRecording, recordingDuration, recordings, playingIndex, toggleRecording, playRecording, deleteRecording };
};

export default function VoiceRecorderSheet({ visible, onClose, recorder, categoryTheme, lang }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = makeStyles(colors);
  const { isRecording, recordingDuration, recordings, playingIndex, toggleRecording, playRecording, deleteRecording } = recorder;
  const full = !isRecording && recordings.length >= MAX_RECORDINGS;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!isRecording) onClose(); }}>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => { if (!isRecording) onClose(); }}
          accessibilityRole="button"
          accessibilityLabel={t('career.close', lang)}
        />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.headRow}>
            <Text style={styles.title}>{t('voiceRecordingPanelTitle', lang)}</Text>
            <View style={styles.headRight}>
              <Text style={styles.count}>
                {t('voiceRecordingCountLabel', lang, { count: recordings.length, max: MAX_RECORDINGS })}
              </Text>
              <TouchableOpacity onPress={() => { if (!isRecording) onClose(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityRole="button" accessibilityLabel={t('career.close', lang)}>
                <Ionicons name="chevron-down" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={toggleRecording}
            disabled={full}
            activeOpacity={0.85}
            style={[
              styles.recordBtn,
              {
                borderColor: isRecording ? categoryTheme.accent : categoryTheme.borderColor,
                backgroundColor: isRecording ? categoryTheme.strongBackgroundColor : categoryTheme.backgroundColor,
                opacity: full ? 0.4 : 1,
              },
            ]}
          >
            <View style={[styles.mic, { backgroundColor: categoryTheme.accent }]}>
              <Ionicons name={isRecording ? 'stop' : 'mic'} size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.recordTitle, { color: categoryTheme.textAccent }]}>
                {isRecording ? t('voiceRecordingStop', lang) : t('voiceRecordingNew', lang)}
              </Text>
              <Text style={[styles.recordSub, { color: isRecording ? categoryTheme.accent : colors.textSecondary }]}>
                {isRecording
                  ? `● ${formatDuration(recordingDuration)} / ${formatDuration(MAX_DURATION_MS)}`
                  : full
                    ? t('voiceRecordingMaxReached', lang, { max: MAX_RECORDINGS })
                    : t('voiceRecordingHint', lang, { duration: formatDuration(MAX_DURATION_MS) })}
              </Text>
            </View>
          </TouchableOpacity>

          <ScrollView style={{ maxHeight: 240 }}>
            {recordings.map((rec, index) => (
              <View
                key={`rec-${index}`}
                style={[
                  styles.recRow,
                  playingIndex === index && { backgroundColor: `${categoryTheme.accent}18`, borderWidth: 1, borderColor: `${categoryTheme.accent}40` },
                ]}
              >
                <TouchableOpacity onPress={() => playRecording(index)} style={{ marginRight: 12 }} accessibilityRole="button">
                  <Ionicons name={playingIndex === index ? 'pause-circle' : 'play-circle'} size={36} color={categoryTheme.accent} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recTitle}>
                    {t('voiceRecordingTakeLabel', lang, { n: index + 1 })}
                    {' · '}
                    <Text style={styles.recDuration}>{formatDuration(rec.durationMs)}</Text>
                  </Text>
                  <Text style={styles.recDate}>
                    {new Date(rec.date).toLocaleDateString(intlLocaleFor(lang), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => deleteRecording(index)} style={{ padding: 6 }} accessibilityRole="button">
                  <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
            {recordings.length === 0 && !isRecording ? (
              <Text style={styles.empty}>{t('voiceRecordingEmpty', lang)}</Text>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  headRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 20, color: colors.text },
  count: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary },
  recordBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 14 },
  mic: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  recordTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  recordSub: { fontFamily: 'Inter_400Regular', fontSize: 12, marginTop: 2 },
  recRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, marginBottom: 8 },
  recTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.text },
  recDuration: { fontFamily: 'Inter_400Regular', color: colors.textSecondary },
  recDate: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors.textSecondary, marginTop: 1 },
  empty: { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 6 },
});
