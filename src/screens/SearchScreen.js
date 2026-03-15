import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, StyleSheet, 
  StatusBar, Platform, TextInput 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { stories } from '../../data/stories';
import StoryCard from '../components/StoryCard';

const SearchScreen = ({ navigation }) => {
  const { colors, typography, layout, isDark } = useTheme();
  const [query, setQuery] = useState('');

  const filtered = stories.filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase()) || 
    s.cat.toLowerCase().includes(query.toLowerCase())
  );

  const styles = StyleSheet.create({
    safe: { 
      flex: 1, 
      backgroundColor: colors.background, 
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
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
      fontFamily: 'DMSans_400Regular',
      fontSize: 16,
      color: colors.text,
      borderWidth: layout.borderWidth,
      borderColor: colors.border,
    },
    sectionLabel: { 
      fontFamily: 'DMSans_500Medium', 
      fontSize: typography.sizes.badge, 
      color: colors.textSecondary, 
      letterSpacing: 1, 
      textTransform: 'uppercase',
      marginHorizontal: layout.padding.horizontal,
      marginTop: 20,
      marginBottom: 12,
    },
    resultInfo: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      marginHorizontal: layout.padding.horizontal,
      marginBottom: 16,
    }
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <TextInput 
          style={styles.searchBar}
          placeholder="Hikaye veya kategori ara..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          autoFocus={true}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Sonuçlar</Text>
        <Text style={styles.resultInfo}>{filtered.length} hikaye bulundu</Text>
        
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
