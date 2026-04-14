import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/theme/tokens';

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
        <Pressable style={styles.action} onPress={onCameraPress} accessibilityLabel="Take photo with camera">
          <Ionicons name="camera-outline" size={16} color={colors.brand.primary} />
          <Text style={styles.actionLabel}>Camera</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={onGalleryPress} accessibilityLabel="Pick from gallery">
          <Ionicons name="images-outline" size={16} color={colors.brand.primary} />
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
    borderColor: colors.border.default,
    backgroundColor: colors.surface.card,
    padding: spacing.md,
    gap: spacing.md,
  },
  preview: {
    width: '100%',
    height: 160,
    borderRadius: radius.md,
    resizeMode: 'cover',
    backgroundColor: colors.surface.subtle,
  },
  placeholder: {
    minHeight: 160,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border.brand,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.inputBg,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  placeholderTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    ...typography.section,
    fontSize: 15,
  },
  placeholderBody: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
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
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.surface.inputBg,
  },
  actionLabel: {
    color: colors.brand.primary,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
});
