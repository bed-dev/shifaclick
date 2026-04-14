import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '@/theme/tokens';

type Status = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  label: string;
  status: Status;
  size?: 'sm' | 'md';
}

const statusConfig: Record<Status, { bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }> = {
  success: { bg: colors.status.successBg, text: colors.status.successText, icon: 'checkmark-circle' },
  warning: { bg: colors.status.warningBg, text: colors.status.warningText, icon: 'alert-circle' },
  danger: { bg: colors.status.dangerBg, text: colors.status.dangerText, icon: 'close-circle' },
  info: { bg: colors.status.infoBg, text: colors.status.infoText, icon: 'information-circle' },
  neutral: { bg: colors.surface.subtle, text: colors.text.secondary, icon: 'ellipse' },
};

export function StatusBadge({ label, status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const isMd = size === 'md';

  return (
    <View
      style={[
        styles.badge,
        isMd && styles.badgeMd,
        { backgroundColor: config.bg },
      ]}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      <Ionicons name={config.icon} size={isMd ? 14 : 12} color={config.text} />
      <Text
        style={[
          styles.label,
          isMd && styles.labelMd,
          { color: config.text },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    minHeight: 24,
  },
  badgeMd: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    minHeight: 28,
  },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: typography.badge.fontSize,
    fontWeight: typography.badge.fontWeight,
  },
  labelMd: {
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
});
