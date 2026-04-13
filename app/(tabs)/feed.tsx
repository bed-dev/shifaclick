import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ContentCard } from '@/components/common/ContentCard';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { useFeed } from '@/src/hooks/useFeed';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

export default function FeedScreen() {
  const [search, setSearch] = useState('');
  const { data, isLoading, error, refetch } = useFeed();

  const filteredItems = useMemo(() => {
    if (!data?.featured) {
      return [];
    }

    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return data.featured;
    }

    return data.featured.filter((item) => {
      return (
        item.medicineName.toLowerCase().includes(searchValue) ||
        item.category.toLowerCase().includes(searchValue) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchValue))
      );
    });
  }, [data, search]);

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.centerState}>
          <ActivityIndicator size="small" color={colors.brand.aqua} />
          <Text style={styles.stateText}>Loading medicine feed…</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper>
        <View style={styles.centerState}>
          <Text style={styles.errorTitle}>Could not load feed</Text>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable onPress={refetch} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper padded={false}>
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <View style={styles.heroCard}>
              <Text style={styles.heroBadge}>Algeria medicine finder</Text>
              <Text style={styles.heroTitle}>Find your medicines in a click</Text>
              <Text style={styles.heroSubtitle}>
                Mobile adaptation of the Django dashboard with mocked API responses.
              </Text>
            </View>

            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={16} color={colors.text.muted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search medicine name, category, or tag"
                placeholderTextColor={colors.text.muted}
                style={styles.searchInput}
              />
            </View>

            <Text style={styles.sectionTitle}>Nearby pharmacies</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {data?.nearbyPharmacies.map((pharmacy) => (
                <View key={pharmacy.id} style={styles.pharmacyChip}>
                  <Text style={styles.pharmacyChipName}>{pharmacy.name}</Text>
                  <Text style={styles.pharmacyChipMeta}>
                    {pharmacy.distanceKm} km · {pharmacy.status === 'open' ? 'Open' : 'Closing soon'}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Browse medicines</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ContentCard item={item} onPress={() => router.push(`/item/${item.id}`)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyTitle}>No result for your search</Text>
            <Text style={styles.emptyText}>Try another medicine name or clear filters.</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerWrap: {
    gap: spacing.md,
    marginBottom: spacing.sm,
    paddingTop: spacing.sm,
  },
  heroCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.brand.navy,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    color: colors.brand.aqua,
    borderWidth: 1,
    borderColor: '#3CA4AC66',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    fontSize: 10,
    fontFamily: typography.fontFamily,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  heroTitle: {
    color: '#fff',
    fontFamily: typography.fontFamily,
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: '#CBD5E1',
    fontFamily: typography.fontFamily,
    fontSize: 13,
    lineHeight: 19,
  },
  searchWrap: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.surface.border,
    backgroundColor: colors.surface.card,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 18,
    fontWeight: '800',
  },
  chipRow: {
    gap: spacing.sm,
  },
  pharmacyChip: {
    minHeight: 58,
    borderRadius: radius.md,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.surface.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    justifyContent: 'center',
    minWidth: 164,
  },
  pharmacyChipName: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
  pharmacyChipMeta: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    marginTop: 2,
  },
  separator: {
    height: spacing.sm,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  stateText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
  },
  errorTitle: {
    color: colors.status.danger,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
  },
  retryButton: {
    minHeight: 44,
    minWidth: 96,
    borderRadius: radius.md,
    backgroundColor: colors.brand.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  retryText: {
    color: '#fff',
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyWrap: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    padding: spacing.lg,
    gap: 4,
  },
  emptyTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
  },
  emptyText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
  },
});
