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
import { useDrugSearch } from '@/hooks/usePharmacy';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { PharmacyMatch, SearchFilters } from '@/types/pharmacy';

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
        <Text style={styles.title}>Good morning, find your meds fast</Text>

        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color={colors.text.muted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Drug, dosage, or brand"
            placeholderTextColor={colors.text.muted}
            style={styles.searchInput}
            accessibilityLabel="Search medicine"
          />
          <Pressable onPress={() => setSheetVisible(true)} style={styles.filterButton}>
            <Ionicons name="options-outline" size={16} color={colors.brand.aqua} />
          </Pressable>
        </View>

        <View style={styles.quickActionsRow}>
          <QuickAction
            icon="scan-outline"
            label="Scan Doctor Note"
            onPress={() => router.push('/tools/scan-note' as any)}
          />
          <QuickAction
            icon="add-circle-outline"
            label="Add Medication"
            onPress={() => router.push('/meds/add' as any)}
          />
        </View>

        <View style={styles.modeToggle}>
          <Segment active={viewMode === 'map'} label="Map" onPress={() => setViewMode('map')} />
          <Segment active={viewMode === 'list'} label="List" onPress={() => setViewMode('list')} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <SkeletonBlock height={220} />
          <SkeletonBlock height={96} />
        </View>
      ) : null}

      {!isLoading && error ? (
        <View style={styles.centerCard}>
          <Text style={styles.errorTitle}>Unable to load results</Text>
          <Text style={styles.errorBody}>{error}</Text>
        </View>
      ) : null}

      {!isLoading && !error ? (
        <>
          <View style={styles.drugHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.drugName}>{firstDrug ? `${firstDrug.name} ${firstDrug.dosage}` : 'No medicines found'}</Text>
              {firstDrug ? <Text style={styles.drugMeta}>{firstDrug.brand}</Text> : null}
            </View>
            {firstDrug ? <StockBadge status={firstDrug.stockStatus} /> : null}
          </View>

          {viewMode === 'map' ? (
            <View style={styles.mapWrap}>
              {mapPoints.length ? <MapPreview points={mapPoints} onSelect={setActivePharmacy} /> : null}
              {activePharmacy ? (
                <PharmacyCard
                  pharmacy={activePharmacy}
                  onPress={() => firstDrug && router.push(`/item/${firstDrug.id}` as any)}
                />
              ) : (
                <Text style={styles.helperText}>Tap a map pin to preview a pharmacy.</Text>
              )}
            </View>
          ) : (
            <FlatList
              data={firstDrug?.matches ?? []}
              keyExtractor={(item) => item.pharmacyId}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => (
                <PharmacyCard pharmacy={item} onPress={() => firstDrug && router.push(`/item/${firstDrug.id}` as any)} />
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

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.quickAction} onPress={onPress}>
      <Ionicons name={icon} size={16} color={colors.brand.aqua} />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
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
    fontSize: 22,
    fontWeight: '800',
  },
  searchBar: {
    minHeight: 46,
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
    fontSize: 15,
    fontWeight: '600',
  },
  filterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAF7FA',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  quickAction: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#C8DEEA',
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  quickActionLabel: {
    color: colors.brand.aqua,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '800',
  },
  modeToggle: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  segment: {
    flex: 1,
    minHeight: 36,
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
    fontSize: 12,
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
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  drugName: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 17,
    fontWeight: '800',
  },
  drugMeta: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    marginTop: 2,
  },
  mapWrap: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  helperText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  centerCard: {
    marginTop: spacing.md,
    minHeight: 110,
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
});
