// components/ProgressBar.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ percentage }: { percentage: number }) => {
  return (
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, { width: `${percentage}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    height: 10,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#ff4081',
    borderRadius: 10,
  },
});

export default ProgressBar;
