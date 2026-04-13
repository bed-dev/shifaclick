import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/src/theme/tokens';

interface UploadBoxProps {
  uri?: string;
  onCameraPress: () => void;
  onGalleryPress: () => void;
}

export function UploadBox({ uri, onCameraPress, onGalleryPress }: UploadBoxProps) {
  return (
    <View style={styles.container}>
      {uri ? (
        <Image source={{ uri }} style={styles.preview} />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="document-attach-outline" size={24} color={colors.text.secondary} />
          <Text style={styles.placeholderTitle}>Upload Prescription</Text>
          <Text style={styles.placeholderBody}>Use camera or gallery. Images are encrypted in transit.</Text>
        </View>
      )}

      <View style={styles.actionsRow}>
        <Pressable style={styles.action} onPress={onCameraPress}>
          <Ionicons name="camera-outline" size={16} color={colors.brand.aqua} />
          <Text style={styles.actionLabel}>Camera</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={onGalleryPress}>
          <Ionicons name="images-outline" size={16} color={colors.brand.aqua} />
          <Text style={styles.actionLabel}>Gallery</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: colors.surface.card,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  preview: {
    width: '100%',
    height: 172,
    borderRadius: radius.md,
    resizeMode: 'cover',
    backgroundColor: '#F1F5F9',
  },
  placeholder: {
    minHeight: 172,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#BCD2E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FCFF',
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  placeholderTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
  },
  placeholderBody: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBE0EE',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: '#F6FBFF',
  },
  actionLabel: {
    color: colors.brand.aqua,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
});
