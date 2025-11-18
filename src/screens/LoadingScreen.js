import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '../styles/theme';

export default function LoadingScreen() {
  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text style={styles.title}>FOCUS BUBBLE</Text>
      <ActivityIndicator size="large" color={colors.white} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 36,
    fontWeight: '200',
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});

