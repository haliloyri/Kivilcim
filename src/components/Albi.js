import React from 'react';
import { Image, View } from 'react-native';

// Albi, the Albor mascot. One pose per moment; files live in assets/albi/
// (512 px, transparent, trimmed to the figure). Decorative only.
const POSES = {
  selamlama: require('../../assets/albi/selamlama.png'),
  okuma: require('../../assets/albi/okuma.png'),
  dinleme: require('../../assets/albi/dinleme.png'),
  hedef_tamam: require('../../assets/albi/hedef_tamam.png'),
  bos_kutuphane: require('../../assets/albi/bos_kutuphane.png'),
  kota_doldu: require('../../assets/albi/kota_doldu.png'),
  dark_mode: require('../../assets/albi/dark_mode.png'),
};

const PAPER = '#F5F1E8';

// `disc` sets Albi on a paper circle. His body is petrol, so without it he
// disappears on petrol hero cards and on dark-theme surfaces.
const Albi = ({ pose, size = 64, disc = false, style }) => {
  const side = disc ? size * 0.8 : size;
  const image = (
    <Image
      source={POSES[pose]}
      style={[{ width: side, height: side }, !disc && style]}
      resizeMode="contain"
      accessible={false}
    />
  );
  if (!disc) return image;
  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2, backgroundColor: PAPER, alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      {image}
    </View>
  );
};

export default Albi;
