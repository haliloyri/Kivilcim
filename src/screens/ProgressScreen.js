import React, { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import CareerPathExperience from '../components/career/CareerPathExperience';
import { useCareerPath } from '../context/CareerPathContext';

// The İlerleme tab is Kıvılcım Yolu. The legacy badge/heatmap screen was
// retired; its badges live on as the "Miras" collection inside the path.
const ProgressScreen = ({ navigation, route }) => {
  const isFocused = useIsFocused();
  const { markPathTabSeen } = useCareerPath();

  // Opening Yolum clears the tab dot. markPathTabSeen changes identity when a
  // new rank is earned, so a rank earned while the tab is open is cleared too.
  useEffect(() => {
    if (isFocused) markPathTabSeen();
  }, [isFocused, markPathTabSeen]);

  return <CareerPathExperience navigation={navigation} route={route} />;
};

export default ProgressScreen;
