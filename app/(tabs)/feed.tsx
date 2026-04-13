import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { FilterSheet } from '@/components/pharmacy/FilterSheet';
import { MapPreview } from '@/components/pharmacy/MapPreview';
import { PharmacyCard } from '@/components/pharmacy/PharmacyCard';
import { SkeletonBlock } from '@/components/pharmacy/SkeletonBlock';
import { StockBadge } from '@/components/pharmacy/StockBadge';
import { useDrugSearch } from '@/src/hooks/usePharmacy';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { PharmacyMatch, SearchFilters } from '@/src/types/pharmacy';

const DEFAULT_FILTERS: SearchFilters = {
  maxDistanceKm: 5,
  onlyOpenNow: false,
  inStockOnly: false,
};

export default function PatientHomeScreen() {
  const [search, setSearch] = useState('Doliprane');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [activePharmacy, setActivePharmacy] = useState<PharmacyMatch | null>(null);

  const { data, isLoading, error } = useDrugSearch(search, filters);

  const firstDrug = data?.[0] ?? null;

  const mapPoints = useMemo(() => {
    if (!data?.length) {
      return [];
    }

    return data.flatMap((drug) => drug.matches);
  }, [data]);

  return (
    <ScreenWrapper>
      <View style={styles.headerWrap}>
        <Text style={styles.title}>Find medicines nearby</Text>
        <Text style={styles.subtitle}>Fast stock visibility for patients with pharmacy-level status.</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.text.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search drug or brand"
            placeholderTextColor={colors.text.muted}
            style={styles.searchInput}
            accessibilityLabel="Search medicine"
          />
          <Pressable onPress={() => setSheetVisible(true)} style={styles.filterButton}>
            <Ionicons name="options-outline" size={16} color={colors.brand.aqua} />
          </Pressable>
        </View>

        <View style={styles.modeToggle}>
          <Segment active={viewMode === 'map'} label="Map View" onPress={() => setViewMode('map')} />
          <Segment active={viewMode === 'list'} label="List View" onPress={() => setViewMode('list')} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <SkeletonBlock height={250} />
          <SkeletonBlock height={102} />
          <SkeletonBlock height={102} />
        </View>
      ) : null}

      {!isLoading && error ? (
        <View style={styles.centerCard}>
          <Text style={styles.errorTitle}>Unable to load search results</Text>
          <Text style={styles.errorBody}>{error}</Text>
        </View>
      ) : null}

      {!isLoading && !error ? (
        <>
          <View style={styles.drugHeader}>
            <Text style={styles.drugName}>
              {firstDrug ? `${firstDrug.name} ${firstDrug.dosage}` : 'No matching medicines'}
            </Text>
            {firstDrug ? <StockBadge status={firstDrug.stockStatus} /> : null}
          </View>

          {viewMode === 'map' ? (
            <View style={styles.mapWrap}>
              {mapPoints.length ? (
                <MapPreview points={mapPoints} onSelect={setActivePharmacy} />
              ) : (
                <View style={styles.centerCard}>
                  <Text style={styles.emptyTitle}>No pharmacy matches</Text>
                  <Text style={styles.emptyBody}>Try broadening your filters or search term.</Text>
                </View>
              )}

              {activePharmacy ? (
                <PharmacyCard
                  pharmacy={activePharmacy}
                  onPress={() => firstDrug && router.push(`/item/${firstDrug.id}`)}
                />
              ) : null}
            </View>
          ) : (
            <FlatList
              data={firstDrug?.matches ?? []}
              keyExtractor={(item) => item.pharmacyId}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <PharmacyCard pharmacy={item} onPress={() => firstDrug && router.push(`/item/${firstDrug.id}`)} />
              )}
              ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
            />
          )}
        </>
      ) : null}

      <FilterSheet
        visible={sheetVisible}
        value={filters}
        onClose={() => setSheetVisible(false)}
        onApply={(next) => {
          setFilters(next);
          setSheetVisible(false);
        }}
      />
    </ScreenWrapper>
  );
}

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.segment, active && styles.segmentActive]}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    lineHeight: 20,
  },
  searchBar: {
    minHeight: 50,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#C9DCE9',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontFamily: typography.fontFamily,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  filterButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF7FA',
  },
  modeToggle: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  segment: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#C8DEEA',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6FBFF',
  },
  segmentActive: {
    borderColor: colors.brand.aqua,
    backgroundColor: '#DBF2F5',
  },
  segmentText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: colors.brand.aqua,
  },
  loadingWrap: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  drugHeader: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  drugName: {
    flex: 1,
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
  },
  mapWrap: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  centerCard: {
    marginTop: spacing.md,
    minHeight: 120,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: spacing.md,
  },
  errorTitle: {
    color: colors.status.danger,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
  },
  errorBody: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    textAlign: 'center',
  },
  emptyTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
  },
  emptyBody: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    textAlign: 'center',
  },
});
