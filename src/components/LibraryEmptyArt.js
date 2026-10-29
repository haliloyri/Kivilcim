import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

// Brand-language illustrations for Library empty states: cream line art + dawn-gold light.
// kind: 'read' | 'favorites' | 'recordings'. Decorative only.
const LibraryEmptyArt = ({ kind, ink = '#F5F1E8', accent, size = 56 }) => {
  const stroke = { stroke: ink, strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  const gold = { stroke: accent, strokeWidth: 2.4, strokeLinecap: 'round', fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" pointerEvents="none">
      {kind === 'favorites' && (
        <>
          <Path d="M32 52 C14 40 10 28 15 21 C20 14 29 16 32 23 C35 16 44 14 49 21 C54 28 50 40 32 52 Z" {...stroke} />
          <Circle cx={32} cy={33} r={5} fill={accent} />
          <Line x1={32} y1={6} x2={32} y2={11} {...gold} />
          <Line x1={50} y1={10} x2={47} y2={14} {...gold} />
          <Line x1={14} y1={10} x2={17} y2={14} {...gold} />
        </>
      )}
      {kind === 'recordings' && (
        <>
          <Rect x={24} y={8} width={16} height={28} rx={8} {...stroke} />
          <Path d="M17 29 C17 40 23 45 32 45 C41 45 47 40 47 29" {...stroke} />
          <Line x1={32} y1={45} x2={32} y2={55} {...stroke} />
          <Line x1={24} y1={55} x2={40} y2={55} {...stroke} />
          <Path d="M10 20 C7 25 7 31 10 36" {...gold} />
          <Path d="M54 20 C57 25 57 31 54 36" {...gold} />
        </>
      )}
      {kind !== 'favorites' && kind !== 'recordings' && (
        <>
          <Path d="M32 22 C26 17 16 16 8 18 L8 50 C16 48 26 49 32 54 C38 49 48 48 56 50 L56 18 C48 16 38 17 32 22 Z" {...stroke} />
          <Line x1={32} y1={22} x2={32} y2={54} {...stroke} />
          <Path d="M24 11 A8 8 0 0 1 40 11" {...gold} />
          <Line x1={32} y1={1} x2={32} y2={4} {...gold} />
          <Line x1={19} y1={4} x2={21} y2={6} {...gold} />
          <Line x1={45} y1={4} x2={43} y2={6} {...gold} />
        </>
      )}
    </Svg>
  );
};

export default LibraryEmptyArt;
