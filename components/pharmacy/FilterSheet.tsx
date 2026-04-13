import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { CustomButton } from '@/components/common/CustomButton';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { SearchFilters } from '@/src/types/pharmacy';

interface FilterSheetProps {
  visible: boolean;
  value: SearchFilters;
  onApply: (next: SearchFilters) => void;
  onClose: () => void;
}

export function FilterSheet({ visible, value, onApply, onClose }: FilterSheetProps) {
  const [draft, setDraft] = useState<SearchFilters>(value);
  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      setDraft(value);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
      return;
    }

    translateY.setValue(300);
  }, [translateY, value, visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <Pressable>
            <View style={styles.dragger} />
            <Text style={styles.title}>Filter Results</Text>

            <View style={styles.settingRow}>
              <Text style={styles.label}>Open pharmacies only</Text>
              <Switch
                value={draft.onlyOpenNow}
                onValueChange={(onlyOpenNow) => setDraft((prev) => ({ ...prev, onlyOpenNow }))}
              />
            </View>

            <View style={styles.settingRow}>
              <Text style={styles.label}>Hide out-of-stock</Text>
              <Switch
                value={draft.inStockOnly}
                onValueChange={(inStockOnly) => setDraft((prev) => ({ ...prev, inStockOnly }))}
              />
            </View>

            <Text style={styles.label}>Max distance</Text>
            <View style={styles.distanceRow}>
              {[2, 5, 10].map((km) => {
                const active = km === draft.maxDistanceKm;

                return (
                  <Pressable
                    key={km}
                    style={[styles.distancePill, active && styles.distancePillActive]}
                    onPress={() => setDraft((prev) => ({ ...prev, maxDistanceKm: km }))}
                  >
                    <Text style={[styles.distanceText, active && styles.distanceTextActive]}>{km} km</Text>
                  </Pressable>
                );
              })}
            </View>

            <CustomButton label="Apply Filters" onPress={() => onApply(draft)} />
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#0F172A66',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 280,
  },
  dragger: {
    width: 46,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  settingRow: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FCFEFF',
  },
  label: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
  },
  distanceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  distancePill: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#CBE0EE',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4FBFF',
  },
  distancePillActive: {
    borderColor: colors.brand.aqua,
    backgroundColor: '#DDF4F7',
  },
  distanceText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
  distanceTextActive: {
    color: colors.brand.aqua,
  },
});
