/**
 * ShareCardCanvas
 *
 * The social-share card itself (1080×1080 post, 1080×1920 story/reel), shared
 * by StoryDetail's inline "Create card" sheet and ShareCardModal so both
 * render — and capture — exactly the same image.
 *
 * Layout: compact brand row / content zone / footer strip.
 *
 * The card has a fixed pixel size, so long content used to spill out of the
 * centred content zone in both directions — over the logo at the top and over
 * the "Discover Albor" footer at the bottom. Font sizes are now picked by
 * fitShareCardText() so the content fits the space that is actually left, and
 * the content zone clips as a last resort so it can never draw over the footer.
 *
 * Exports:
 *   ShareCardCanvas   the 1080-wide card (use for capture targets)
 *   ShareCardPreview  the same card scaled down to `previewWidth`
 *   fitShareCardText  the pure sizing function (exported for tests)
 */
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { t } from '../locales/i18n';

// App icon (navy rounded square, cropped to its edges) — reads as the Albor
// logo on every card theme. The old transparent mark had ~25% empty padding
// around the artwork, so it floated away from its underline and wasted space.
const BRAND_ICON = require('../../assets/share_card_icon.png');

export const SHARE_CARD_WIDTH = 1080;
export const getShareCardHeight = (format) => (format === 'post' ? 1080 : 1920);

const PAD_H = 80;
const INNER_W = SHARE_CARD_WIDTH - PAD_H * 2; // 920
const QUOTE_BAR_W = 8;
const QUOTE_PAD_L = 28;
const QUOTE_W = INNER_W - QUOTE_BAR_W - QUOTE_PAD_L;

// Vertical frame per format. Story/reel keep extra room at the top and bottom
// because Instagram draws its own UI (progress bar, reply box) there.
const FRAME = {
  post: { padTop: 64, padBottom: 60 },
  story: { padTop: 150, padBottom: 180 },
};

const HEADER_ICON = 84;
const HEADER_H = HEADER_ICON;
const HEADER_GAP = 40; // header → content
const FOOTER_H = 112;  // divider + two text rows
const FOOTER_GAP = 36; // content → footer
const BLOCK_GAP = 56;  // between content blocks

// Playfair Display, averaged over mixed-case Turkish/English prose, is roughly
// 0.5em per glyph. 0.52 plus a wrap allowance keeps the estimate on the safe
// side so a fitted card never overflows.
const CHAR_EM = 0.52;
const WRAP_SLACK = 1.05;

const estimateLines = (text, fontSize, boxWidth) => {
  const len = String(text || '').length;
  if (!len) return 0;
  const charsPerLine = Math.max(1, Math.floor(boxWidth / (fontSize * CHAR_EM)));
  return Math.max(1, Math.ceil((len * WRAP_SLACK) / charsPerLine));
};

/**
 * Picks font sizes so every block fits in the content zone.
 *
 * @param {{ type: string, label: string, text: string }[]} blocks
 * @param {'post'|'story'|'reel'} format
 * @returns {{ titleSize, quoteSize, hookSize, titleLines, fits }}
 */
export const fitShareCardText = (blocks, format) => {
  const isPost = format === 'post';
  const frame = isPost ? FRAME.post : FRAME.story;
  const available = getShareCardHeight(format)
    - frame.padTop - frame.padBottom
    - HEADER_H - HEADER_GAP - FOOTER_H - FOOTER_GAP;

  const multi = blocks.length > 1;
  const baseTitle = multi ? 50 : 60;
  const baseQuote = multi ? 42 : 50;
  const baseHook = multi ? 50 : 60;
  const MIN_SCALE = 0.5;

  const measure = (scale) => {
    const titleSize = Math.round(baseTitle * scale);
    const quoteSize = Math.round(baseQuote * scale);
    const hookSize = Math.round(baseHook * scale);
    let total = 0;
    blocks.forEach((b, i) => {
      if (i > 0) total += BLOCK_GAP;
      if (b.type === 'hook') {
        total += estimateLines(b.text, hookSize, INNER_W) * hookSize * 1.4 + 36 + 4;
        return;
      }
      if (b.label) {
        const tl = Math.min(3, estimateLines(b.label, titleSize, INNER_W));
        total += tl * titleSize * 1.25 + 24;
      }
      total += estimateLines(b.text, quoteSize, QUOTE_W) * quoteSize * 1.5;
    });
    return { titleSize, quoteSize, hookSize, total };
  };

  let scale = 1;
  let m = measure(scale);
  while (m.total > available && scale > MIN_SCALE) {
    scale = Math.max(MIN_SCALE, +(scale - 0.04).toFixed(2));
    m = measure(scale);
  }
  return {
    titleSize: m.titleSize,
    quoteSize: m.quoteSize,
    hookSize: m.hookSize,
    fits: m.total <= available,
    available,
  };
};

/**
 * @param {object}   props
 * @param {object}   props.theme        { bg: [a,b], text, accent, sub }
 * @param {string}   props.format       'post' | 'story' | 'reel'
 * @param {string[]} props.contentTypes e.g. ['quote'] or ['hook','lesson']
 * @param {function} props.getText      (type) => card text for that type
 * @param {string}   props.title        story title (label for quote blocks)
 * @param {string}   props.sourceBook
 * @param {string}   props.lang         content language
 * @param {string}   props.shareLabel   e.g. "albor.app/tr"
 */
export const ShareCardCanvas = ({
  theme: th,
  format,
  contentTypes,
  getText,
  title,
  sourceBook,
  lang,
  shareLabel,
}) => {
  const isPost = format === 'post';
  const frame = isPost ? FRAME.post : FRAME.story;
  const cardH = getShareCardHeight(format);

  const blocks = contentTypes
    .map((type) => ({
      type,
      label: type === 'lesson' ? t('share_key_takeaway', lang)
        : type === 'reflection' ? t('share_reflect', lang)
          : type === 'hook' ? ''
            : title,
      text: getText(type) || '',
    }))
    .filter((b) => b.text);

  const fit = fitShareCardText(blocks, format);

  return (
    <View style={{ width: SHARE_CARD_WIDTH, height: cardH, overflow: 'hidden', backgroundColor: th.bg[0] }}>
      <LinearGradient colors={th.bg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />

      <View style={{ flex: 1, paddingHorizontal: PAD_H, paddingTop: frame.padTop, paddingBottom: frame.padBottom }}>
        {/* Brand row — icon + wordmark, one compact line */}
        <View style={{ height: HEADER_H, flexDirection: 'row', alignItems: 'center', marginBottom: HEADER_GAP }}>
          <Image source={BRAND_ICON} style={{ width: HEADER_ICON, height: HEADER_ICON, borderRadius: 20 }} resizeMode="contain" />
          <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: 46, color: th.text, marginLeft: 22, letterSpacing: 0.5 }}>
            Albor
          </Text>
          <View style={{ flex: 1, height: 3, backgroundColor: th.accent, opacity: 0.5, marginLeft: 28, borderRadius: 2 }} />
        </View>

        {/* Content — fitted to the space left; clips instead of overlapping */}
        <View style={{ flex: 1, minHeight: 0, justifyContent: 'center', overflow: 'hidden' }}>
          {blocks.map((b, index) => {
            const gap = index === blocks.length - 1 ? 0 : BLOCK_GAP;
            if (b.type === 'hook') {
              return (
                <View key={b.type} style={{ marginBottom: gap }}>
                  <Text style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: fit.hookSize, lineHeight: Math.round(fit.hookSize * 1.4), color: th.text, textAlign: 'center' }}>
                    {b.text}
                  </Text>
                  <View style={{ width: 120, height: 4, backgroundColor: th.accent, alignSelf: 'center', marginTop: 36, borderRadius: 2 }} />
                </View>
              );
            }
            return (
              <View key={b.type} style={{ marginBottom: gap }}>
                {b.label ? (
                  <Text
                    numberOfLines={3}
                    style={{ fontFamily: 'PlayfairDisplay_700Bold', fontSize: fit.titleSize, lineHeight: Math.round(fit.titleSize * 1.25), color: th.text, marginBottom: 24 }}
                  >
                    {b.label}
                  </Text>
                ) : null}
                <View style={{ borderLeftWidth: QUOTE_BAR_W, borderLeftColor: th.accent, paddingLeft: QUOTE_PAD_L }}>
                  <Text style={{ fontFamily: 'PlayfairDisplay_600SemiBold', fontSize: fit.quoteSize, lineHeight: Math.round(fit.quoteSize * 1.5), color: th.sub }}>
                    “{b.text}”
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Footer — source on the left, CTA + link on the right */}
        <View style={{ height: FOOTER_H, marginTop: FOOTER_GAP, justifyContent: 'flex-end' }}>
          <View style={{ height: 3, backgroundColor: th.accent, opacity: 0.45, borderRadius: 2, marginBottom: 24 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 28 }}>
              {sourceBook ? (
                <>
                  <Ionicons name="book-outline" size={30} color={th.sub} />
                  <Text
                    numberOfLines={2}
                    style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 24, lineHeight: 30, color: th.sub, textTransform: 'uppercase', letterSpacing: 1.5, marginLeft: 12 }}
                  >
                    {t('share_source', lang)}{sourceBook}
                  </Text>
                </>
              ) : null}
            </View>
            <View style={{ alignItems: 'flex-end', flexShrink: 0, maxWidth: 420 }}>
              <Text numberOfLines={1} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 30, color: th.accent, letterSpacing: 0.5 }}>
                {t('card_cta_short', lang)} ✦
              </Text>
              <Text numberOfLines={1} style={{ fontFamily: 'Inter_500Medium', fontSize: 24, color: th.sub, letterSpacing: 0.5, marginTop: 6 }}>
                {shareLabel}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * The card scaled to `previewWidth`. The 1080-wide card is pinned to the
 * top-left corner and scaled from there, instead of being centred inside a
 * narrower box and scaled around its middle — that relied on how each
 * platform positions an oversized child and is what made the preview shift.
 */
export const ShareCardPreview = ({ previewWidth, style, ...cardProps }) => {
  const cardH = getShareCardHeight(cardProps.format);
  const scale = previewWidth / SHARE_CARD_WIDTH;
  return (
    <View style={[{ width: previewWidth, height: Math.round(cardH * scale), overflow: 'hidden' }, style]}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SHARE_CARD_WIDTH,
          height: cardH,
          transform: [
            { translateX: -(SHARE_CARD_WIDTH * (1 - scale)) / 2 },
            { translateY: -(cardH * (1 - scale)) / 2 },
            { scale },
          ],
        }}
      >
        <ShareCardCanvas {...cardProps} />
      </View>
    </View>
  );
};

export default ShareCardCanvas;
