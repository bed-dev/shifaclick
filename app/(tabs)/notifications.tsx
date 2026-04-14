import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { useNotificationCenter } from '@/hooks/usePharmacy';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { AppNotification } from '@/types/pharmacy';

const iconByType: Record<AppNotification['type'], keyof typeof Ionicons.glyphMap> = {
  stock_alert: 'warning-outline',
  request_approved: 'checkmark-done-outline',
  restock_ping: 'notifications-outline',
};

export default function NotificationsScreen() {
  const { data, isLoading, error } = useNotificationCenter();

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Notification Center</Text>
      <Text style={styles.subtitle}>Stock alerts, request approvals, and restock pings.</Text>

      {isLoading ? <Text style={styles.stateText}>Loading notifications...</Text> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <FlatList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.card, item.unread && styles.unreadCard]}>
            <View style={styles.iconCircle}>
              <Ionicons name={iconByType[item.type]} size={16} color={colors.brand.aqua} />
            </View>
            <View style={styles.metaWrap}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{item.body}</Text>
              <Text style={styles.timestamp}>{item.createdAt}</Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 28,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  stateText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
  },
  errorText: {
    color: colors.status.danger,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: colors.surface.card,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  unreadCard: {
    borderColor: '#B9DDE2',
    backgroundColor: '#F5FCFD',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF7FA',
    marginTop: 2,
  },
  metaWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '800',
  },
  cardBody: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    lineHeight: 18,
  },
  timestamp: {
    color: colors.text.muted,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    marginTop: 2,
  },
});
