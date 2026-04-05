import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useStories } from '../context/StoriesContext';
import StoryCard from '../components/StoryCard';
import { t } from '../locales/i18n';

const SearchScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark, lang } = useTheme();
  const { stories } = useStories();
  const [query, setQuery] = useState('');

  const filtered = query.trim() ? (stories || []).filter(s => 
    (s.title || '').toLowerCase().includes(query.toLowerCase()) || 
    (t(s.cat_display || s.cat || '', lang) || '').toLowerCase().includes(query.toLowerCase()) ||
    (t(s.parent_cat || '', lang) || '').toLowerCase().includes(query.toLowerCase())
  ).slice(0, 20) : [];

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
      color: '#594238', 
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
    }
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
          autoFocus={true}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>{t('resultsLabel', lang)}</Text>
        <Text style={styles.resultInfo}>{filtered.length} {t('foundStories', lang)}</Text>
        
        <View style={{ paddingHorizontal: layout.padding.horizontal }}>
          {filtered.map(story => (
            <StoryCard 
              key={story.id} 
              story={story} 
              onPress={() => navigation.navigate('StoryDetail', { story })} 
            />
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
