// StoryBody — renders P1 ("podcast" format) story segments.
// Parsing lives in utils/storyMarkup.js; this component only maps segments
// to views. Legacy stories keep their original renderer in StoryDetailScreen.
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../locales/i18n';
import { parseInline } from '../../utils/storyMarkup';

const SECTION_TITLE_KEYS = {
  story: 'storySectionStory',
  lessons: 'storySectionLessons',
  reflect: 'storySectionReflect',
  use: 'storySectionUse',
  pocket: 'storySectionPocket',
};

// iOS does not synthesize italics for custom fonts, so italic runs switch to
// the real italic faces loaded in App.js.
const ITALIC = { fontFamily: 'Inter_400Regular_Italic' };
const BOLD_ITALIC = { fontFamily: 'Inter_700Bold_Italic' };

/** Text with **bold** and *italic* runs. */
const RichText = ({ text, style, boldStyle, ...rest }) => (
  <Text style={style} {...rest}>
    {parseInline(text).map((run, i) => {
      let runStyle = null;
      if (run.bold && run.italic) runStyle = [boldStyle, BOLD_ITALIC];
      else if (run.bold) runStyle = boldStyle;
      else if (run.italic) runStyle = ITALIC;
      return <Text key={i} style={runStyle}>{run.text}</Text>;
    })}
  </Text>
);

const UseCaseCard = ({ seg, styles, accent, textAccent, border, fontSize, lineSpacing, lang, onTry }) => (
  <View style={[styles.useCard, { borderColor: border }]}>
    {seg.label ? (
      <Text style={[styles.useLabel, { color: textAccent }]}>{seg.label}</Text>
    ) : null}
    <Text style={[styles.useLine, { fontSize, lineHeight: Math.round(fontSize * lineSpacing) }]}>
      “{seg.line}”
    </Text>
    <TouchableOpacity
      onPress={() => onTry?.(seg)}
      disabled={!onTry}
      accessibilityRole="button"
      accessibilityLabel={t('useCaseTry', lang)}
      style={styles.useCopy}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={[styles.useCopyText, { color: textAccent }]}>{t('useCaseTry', lang)}</Text>
      <Ionicons name="arrow-forward" size={13} color={accent} />
    </TouchableOpacity>
  </View>
);

/**
 * @param {object} props
 * @param {object[]} props.segments        from parseStoryMarkup(...).segments (format 'p1')
 * @param {number}   props.fontSize        reader font size
 * @param {{accent:string,borderColor:string,backgroundColor:string}} props.categoryTheme
 * @param {string}   props.lang
 * @param {() => void} [props.onReflectionPress]
 * @param {(seg:object) => React.ReactNode} [props.renderLessonFooter]
 * @param {(text:string) => void} [props.onSharePocket]
 * @param {(seg:object) => void} [props.onTryUseCase]
 */
const StoryBody = ({
  segments,
  fontSize,
  lineSpacing = 1.55,
  categoryTheme,
  lang,
  onReflectionPress,
  renderLessonFooter,
  onSharePocket,
  onTryUseCase,
}) => {
  const { colors, isDark } = useTheme();
  const accent = categoryTheme?.accent || colors.primary;
  const textAccent = categoryTheme?.textAccent || colors.primaryText;
  const border = categoryTheme?.borderColor || colors.border;
  const tint = categoryTheme?.backgroundColor || (isDark ? colors.backgroundDark : colors.background);
  const styles = makeStyles(colors, isDark);
  const lh = (size, k = lineSpacing) => Math.round(size * k);

  return (
    <View>
      {segments.map((seg, idx) => {
        const key = `${seg.type}-${idx}`;
        switch (seg.type) {
          case 'section': {
            const titleKey = SECTION_TITLE_KEYS[seg.section];
            if (!titleKey) return null; // [[open]] has no heading
            return (
              <View key={key} style={styles.sectionHead} accessibilityRole="header">
                <View style={[styles.sectionBar, { backgroundColor: accent }]} />
                <Text style={[styles.sectionTitle, { fontSize: fontSize + 4, lineHeight: lh(fontSize + 4, 1.3) }]}>
                  {t(titleKey, lang)}
                </Text>
              </View>
            );
          }

          case 'text':
            return (
              <RichText
                key={key}
                text={seg.content}
                style={[
                  styles.body,
                  { fontSize, lineHeight: lh(fontSize) },
                  seg.section === 'open' && [styles.openText, { borderLeftColor: accent }],
                ]}
                boldStyle={styles.bold}
              />
            );

          case 'quote':
            return (
              <View key={key} style={[styles.quoteLine, { borderLeftColor: border }]}>
                <RichText
                  text={seg.content}
                  style={[styles.quoteLineText, { fontSize, lineHeight: lh(fontSize) }]}
                  boldStyle={styles.bold}
                />
              </View>
            );

          case 'highlight':
            return (
              <View key={key} style={[styles.highlight, { borderLeftColor: border, backgroundColor: tint }]}>
                <RichText
                  text={seg.content}
                  style={[styles.highlightText, { fontSize: fontSize + 2, lineHeight: lh(fontSize + 2) }]}
                  boldStyle={styles.bold}
                />
              </View>
            );

          case 'bullet':
            return (
              <View key={key} style={styles.bulletRow}>
                <View style={[styles.bulletDot, { backgroundColor: accent, marginTop: Math.round(fontSize * 0.62) }]} />
                <RichText
                  text={seg.content}
                  style={[styles.body, styles.bulletText, { fontSize, lineHeight: lh(fontSize) }]}
                  boldStyle={styles.bold}
                />
              </View>
            );

          case 'lesson':
            return (
              <View key={key} style={[styles.lessonCard, { borderLeftColor: accent, backgroundColor: tint }]}>
                <View style={styles.lessonHead}>
                  <View style={[styles.lessonBadge, { borderColor: accent }]}>
                    <Text style={[styles.lessonBadgeText, { color: textAccent }]}>{seg.index}</Text>
                  </View>
                  {seg.title ? (
                    <Text style={[styles.lessonTitle, { fontSize: fontSize + 1, lineHeight: lh(fontSize + 1, 1.4) }]}>
                      {seg.title}
                    </Text>
                  ) : null}
                </View>
                {seg.body ? (
                  <RichText
                    text={seg.body}
                    style={[styles.lessonBody, { fontSize, lineHeight: lh(fontSize) }]}
                    boldStyle={styles.bold}
                  />
                ) : null}
                {renderLessonFooter ? renderLessonFooter(seg) : null}
              </View>
            );

          case 'reflection':
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.85}
                disabled={!onReflectionPress}
                onPress={onReflectionPress}
                style={[styles.reflectionBox, { borderColor: border }]}
              >
                <View style={styles.labelRow}>
                  <Ionicons name="chatbubble-ellipses-outline" size={15} color={accent} />
                  <Text style={[styles.smallLabel, { color: textAccent }]}>{t('reflectionLabel', lang)}</Text>
                </View>
                <RichText
                  text={seg.content}
                  style={[styles.reflectionText, { fontSize: fontSize + 1, lineHeight: lh(fontSize + 1) }]}
                  boldStyle={styles.bold}
                />
              </TouchableOpacity>
            );

          case 'usecase':
            return (
              <UseCaseCard
                key={key}
                seg={seg}
                styles={styles}
                accent={accent}
                textAccent={textAccent}
                border={border}
                fontSize={fontSize}
                lineSpacing={lineSpacing}
                lang={lang}
                onTry={onTryUseCase}
              />
            );

          case 'pocket':
            return (
              <View key={key} style={[styles.pocket, { borderLeftColor: accent, borderBottomColor: accent }]}>
                <RichText
                  text={seg.content}
                  style={[styles.pocketText, { fontSize: fontSize + 5, lineHeight: lh(fontSize + 5, 1.35) }]}
                  boldStyle={styles.bold}
                />
                {onSharePocket ? (
                  <TouchableOpacity
                    onPress={() => onSharePocket(seg.content)}
                    accessibilityRole="button"
                    accessibilityLabel={t('pocketShare', lang)}
                    style={styles.pocketShare}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="share-outline" size={15} color={accent} />
                    <Text style={[styles.useCopyText, { color: textAccent }]}>{t('pocketShare', lang)}</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            );

          case 'contrast':
            return (
              <View key={key} style={styles.contrastRow}>
                <View style={[styles.contrastCol, { backgroundColor: isDark ? colors.backgroundDark : `${colors.border}55` }]}>
                  <Text style={styles.contrastLabel}>{t('contrastBeforeLabel', lang)}</Text>
                  <Text style={[styles.contrastText, { color: colors.textSecondary }]}>{seg.before}</Text>
                </View>
                <View style={[styles.contrastCol, { backgroundColor: tint, borderColor: border, borderWidth: 1 }]}>
                  <Text style={[styles.contrastLabel, { color: textAccent }]}>{t('contrastAfterLabel', lang)}</Text>
                  <Text style={[styles.contrastText, { color: colors.text }]}>{seg.after}</Text>
                </View>
              </View>
            );

          default:
            return null;
        }
      })}
    </View>
  );
};

const makeStyles = (colors, isDark) => StyleSheet.create({
  body: {
    fontFamily: 'Inter_400Regular',
    color: colors.text,
    marginBottom: 16,
  },
  bold: {
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  openText: {
    fontFamily: 'Inter_400Regular',
    borderLeftWidth: 3,
    paddingLeft: 12,
    color: colors.textSecondary,
  },
  sectionHead: {
    marginTop: 18,
    marginBottom: 14,
  },
  sectionBar: {
    width: 28,
    height: 3,
    borderRadius: 2,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
  },
  quoteLine: {
    borderLeftWidth: 2,
    paddingLeft: 14,
    marginLeft: 4,
    marginBottom: 16,
  },
  quoteLineText: {
    fontFamily: 'Inter_500Medium_Italic',
    color: colors.text,
  },
  highlight: {
    borderLeftWidth: 4,
    padding: 16,
    paddingLeft: 20,
    marginVertical: 12,
    borderRadius: 4,
  },
  highlightText: {
    fontFamily: 'Inter_500Medium',
    color: colors.text,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bulletText: {
    flex: 1,
    marginBottom: 10,
  },
  lessonCard: {
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  lessonHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  lessonBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  lessonBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
  },
  lessonTitle: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
  },
  lessonBody: {
    fontFamily: 'Inter_400Regular',
    color: colors.text,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  smallLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  reflectionBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
    marginBottom: 18,
  },
  reflectionText: {
    fontFamily: 'Inter_500Medium_Italic',
    color: colors.text,
  },
  useCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: isDark ? colors.backgroundDark : colors.background,
  },
  useLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  useLine: {
    fontFamily: 'Inter_500Medium_Italic',
    color: colors.text,
  },
  useCopy: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 10,
  },
  useCopyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  pocket: {
    borderLeftWidth: 4,
    borderBottomWidth: 2,
    paddingLeft: 18,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 16,
    marginTop: 2,
    marginBottom: 24,
  },
  pocketText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: colors.text,
  },
  pocketShare: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
  },
  contrastRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 12,
  },
  contrastCol: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
  },
  contrastLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  contrastText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    lineHeight: 22,
  },
});

export default StoryBody;
