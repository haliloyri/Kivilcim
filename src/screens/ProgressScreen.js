import React from 'react';
import CareerPathExperience from '../components/career/CareerPathExperience';

// The İlerleme tab is Kıvılcım Yolu. The legacy badge/heatmap screen was
// retired; its badges live on as the "Miras" collection inside the path.
const ProgressScreen = ({ navigation, route }) => <CareerPathExperience navigation={navigation} route={route} />;

export default ProgressScreen;
