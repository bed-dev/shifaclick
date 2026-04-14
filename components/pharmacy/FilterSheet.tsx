import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { CustomButton } from '@/components/common/CustomButton';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { SearchFilters } from '@/types/pharmacy';

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
    backgroundColor: colors.surface.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    minHeight: 280,
  },
  dragger: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border.strong,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    ...typography.section,
    marginBottom: spacing.sm,
  },
  settingRow: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface.inputBg,
  },
  label: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
  distanceRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  distancePill: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.inputBg,
  },
  distancePillActive: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.status.infoBg,
  },
  distanceText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
  distanceTextActive: {
    color: colors.brand.primary,
  },
});
