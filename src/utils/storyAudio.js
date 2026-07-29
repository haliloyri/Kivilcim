// Metro can only bundle local assets that are referenced statically. Keep this
// map explicit so a database story_id resolves to its packaged narration.
const STORY_AUDIO_BY_ID = Object.freeze({
  1059: require('../../seslendirmeler/[1059].mp3'),
  1060: require('../../seslendirmeler/[1060].mp3'),
  1061: require('../../seslendirmeler/[1061].mp3'),
  1070: require('../../seslendirmeler/[1070].mp3'),
  1071: require('../../seslendirmeler/[1071].mp3'),
  1072: require('../../seslendirmeler/[1072].mp3'),
  1073: require('../../seslendirmeler/[1073].mp3'),
  1074: require('../../seslendirmeler/[1074].mp3'),
  1075: require('../../seslendirmeler/[1075].mp3'),
  1076: require('../../seslendirmeler/[1076].mp3'),
  1077: require('../../seslendirmeler/[1077].mp3'),
  1078: require('../../seslendirmeler/[1078].mp3'),
  1079: require('../../seslendirmeler/[1079].mp3'),
  1080: require('../../seslendirmeler/[1080].mp3'),
  1081: require('../../seslendirmeler/[1081].mp3'),
  1082: require('../../seslendirmeler/[1082].mp3'),
  1083: require('../../seslendirmeler/[1083].mp3'),
  1084: require('../../seslendirmeler/[1084].mp3'),
  1085: require('../../seslendirmeler/[1085].mp3'),
  1086: require('../../seslendirmeler/[1086].mp3'),
  1087: require('../../seslendirmeler/[1087].mp3'),
  1088: require('../../seslendirmeler/[1088].mp3'),
  1089: require('../../seslendirmeler/[1089].mp3'),
  1090: require('../../seslendirmeler/[1090].mp3'),
  1091: require('../../seslendirmeler/[1091].mp3'),
  1092: require('../../seslendirmeler/[1092].mp3'),
  1093: require('../../seslendirmeler/[1093].mp3'),
  1094: require('../../seslendirmeler/[1094].mp3'),
  1095: require('../../seslendirmeler/[1095].mp3'),
  1096: require('../../seslendirmeler/[1096].mp3'),
  1097: require('../../seslendirmeler/[1097].mp3'),
  1098: require('../../seslendirmeler/[1098].mp3'),
  1099: require('../../seslendirmeler/[1099].mp3'),
  1100: require('../../seslendirmeler/[1100].mp3'),
  1101: require('../../seslendirmeler/[1101].mp3'),
  1102: require('../../seslendirmeler/[1102].mp3'),
  1103: require('../../seslendirmeler/[1103].mp3'),
  1104: require('../../seslendirmeler/[1104].mp3'),
  1105: require('../../seslendirmeler/[1105].mp3'),
  1106: require('../../seslendirmeler/[1106].mp3'),
  1107: require('../../seslendirmeler/[1107].mp3'),
  1108: require('../../seslendirmeler/[1108].mp3'),
});

export const STORY_AUDIO_IDS = Object.freeze(
  Object.keys(STORY_AUDIO_BY_ID).map(Number)
);

export const getStoryAudioAsset = (storyId) => {
  const normalizedId = Number(storyId);
  return Number.isSafeInteger(normalizedId)
    ? STORY_AUDIO_BY_ID[normalizedId] || null
    : null;
};

export const hasStoryAudio = (storyId) => Boolean(getStoryAudioAsset(storyId));

