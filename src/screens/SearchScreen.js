import React, { useEffect, useMemo, useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { useStories } from '../context/StoriesContext';
import StoryCard from '../components/StoryCard';
import CategoryPill from '../components/CategoryPill';
import { t } from '../locales/i18n';
import { searchStoriesForLang } from '../db/db';

const RECENT_SEARCHES_KEY = '@kivilcim_recent_searches';
const MAX_RECENT_SEARCHES = 8;
const DEFAULT_SUGGESTIONS = ['alışkanlık', 'felsefe', 'liderlik', 'motivasyon'];

const SearchScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const { parentCategories } = useStories();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const popularCategories = useMemo(() => {
    return (parentCategories || [])
      .slice()
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, 6)
      .filter((item) => item?.name);
  }, [parentCategories]);

  useEffect(() => {
    const loadRecentSearches = async () => {
      try {
        const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        setRecentSearches(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        setRecentSearches([]);
      }
    };

    loadRecentSearches();
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let active = true;
    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const rows = await searchStoriesForLang(trimmed, lang, 30);
        if (active) setResults(rows);
      } catch (error) {
        if (active) setResults([]);
      } finally {
        if (active) setIsSearching(false);
      }
    }, 180);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [query, lang]);

  const persistRecentSearch = async (term) => {
    const normalized = String(term || '').trim();
    if (!normalized) return;

    const next = [normalized, ...recentSearches.filter((item) => item.toLowerCase() !== normalized.toLowerCase())]
      .slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(next);
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
    } catch (error) {
      // no-op
    }
  };

  const applySearchTerm = (term) => {
    setQuery(term);
    persistRecentSearch(term);
  };

  const openStory = (story) => {
    persistRecentSearch(query);
    navigation.navigate('StoryDetail', { story });
  };

  const showIdleState = !query.trim();
  const showNoResults = query.trim().length > 0 && !isSearching && results.length === 0;

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background
    },
    header: { 
      paddingHorizontal: layout.padding.horizontal, 
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    backBtn: {
      fontSize: 20,
      color: colors.text,
    },
    searchBar: {
      flex: 1,
      height: 44,
      backgroundColor: colors.backgroundDark,
      borderRadius: 22,
      paddingHorizontal: 16,
      fontFamily: 'Inter_400Regular',
      fontSize: 16,
      color: colors.text,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
    },
    sectionLabel: { 
      fontFamily: 'Inter_500Medium', 
      fontSize: 11,
      color: colors.textSecondary, 
      letterSpacing: 1, 
      textTransform: 'uppercase',
      marginHorizontal: layout.padding.horizontal,
      marginTop: 20,
      marginBottom: 12,
    },
    resultInfo: {
      fontFamily: 'Inter_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      marginHorizontal: layout.padding.horizontal,
      marginBottom: 16,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      paddingHorizontal: layout.padding.horizontal,
      marginBottom: 8,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 18,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
      backgroundColor: colors.backgroundDark,
    },
    chipText: {
      fontFamily: 'Inter_500Medium',
      fontSize: 12,
      color: colors.text,
    },
    emptyTitle: {
      fontFamily: 'Inter_500Medium',
      fontSize: 14,
      color: colors.text,
      marginHorizontal: layout.padding.horizontal,
      marginTop: 14,
      marginBottom: 8,
    },
    emptySub: {
      fontFamily: 'Inter_400Regular',
      fontSize: 13,
      color: colors.textSecondary,
      marginHorizontal: layout.padding.horizontal,
      marginBottom: 10,
    },
  });

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <TextInput 
          style={styles.searchBar}
          placeholder={t('searchPlaceholder', lang)}
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => persistRecentSearch(query)}
          autoFocus={true}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {showIdleState ? (
          <>
            {recentSearches.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>{t('searchRecentTitle', lang)}</Text>
                <View style={styles.chipRow}>
                  {recentSearches.map((term, idx) => (
                    <TouchableOpacity key={`${term}-${idx}`} style={styles.chip} onPress={() => applySearchTerm(term)}>
                      <Text style={styles.chipText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Text style={styles.sectionLabel}>{t('searchPopularTitle', lang)}</Text>
            <View style={styles.chipRow}>
              {popularCategories.length > 0 ? popularCategories.map((item, idx) => (
                <CategoryPill
                  key={`${item.name}-${idx}`}
                  label={item.name}
                  categoryName={item.raw_name || item.name}
                  isDark={isDark}
                  compact
                  onPress={() => applySearchTerm(item.name)}
                />
              )) : DEFAULT_SUGGESTIONS.map((item, idx) => (
                <TouchableOpacity key={`${item}-${idx}`} style={styles.chip} onPress={() => applySearchTerm(item)}>
                  <Text style={styles.chipText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionLabel}>{t('resultsLabel', lang)}</Text>
            <Text style={styles.resultInfo}>
              {isSearching ? t('searchSearching', lang) : `${results.length} ${t('foundStories', lang)}`}
            </Text>

            {showNoResults && (
              <>
                <Text style={styles.emptyTitle}>{t('searchNoResultsTitle', lang)}</Text>
                <Text style={styles.emptySub}>{t('searchNoResultsSub', lang)}</Text>
                <Text style={styles.sectionLabel}>{t('searchTrySuggestions', lang)}</Text>
                <View style={styles.chipRow}>
                  {popularCategories.length > 0 ? popularCategories.map((item, idx) => (
                    <CategoryPill
                      key={`${item.name}-${idx}`}
                      label={item.name}
                      categoryName={item.raw_name || item.name}
                      isDark={isDark}
                      compact
                      onPress={() => applySearchTerm(item.name)}
                    />
                  )) : DEFAULT_SUGGESTIONS.map((item, idx) => (
                    <TouchableOpacity key={`${item}-${idx}`} style={styles.chip} onPress={() => applySearchTerm(item)}>
                      <Text style={styles.chipText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={{ paddingHorizontal: layout.padding.horizontal }}>
              {results.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  type="ready"
                  onPress={() => openStory(story)}
                  onUseInConversation={() => navigation.navigate('UseInConversation', { story })}
                />
              ))}
            </View>
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
