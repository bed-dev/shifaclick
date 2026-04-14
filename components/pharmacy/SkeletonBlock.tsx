import { StyleSheet, View } from 'react-native';

import { radius } from '@/theme/tokens';

export function SkeletonBlock({ height = 16, width = '100%' }: { height?: number; width?: number | `${number}%` }) {
  return <View style={[styles.base, { height, width }]} />;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    backgroundColor: '#E7EEF3',
    overflow: 'hidden',
  },
});
