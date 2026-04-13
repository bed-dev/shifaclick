import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { CustomButton } from '@/components/common/CustomButton';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { pharmacyService } from '@/src/services/pharmacyService';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { DrugStockStatus } from '@/src/types/pharmacy';

const statusOptions: DrugStockStatus[] = ['in', 'low', 'out'];

export default function ScannerScreen() {
  const [barcode, setBarcode] = useState('');
  const [unitsLeft, setUnitsLeft] = useState('10');
  const [stockStatus, setStockStatus] = useState<DrugStockStatus>('in');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      await pharmacyService.updateStockFromScanner({
        barcode,
        stockStatus,
        unitsLeft: Number(unitsLeft) || 0,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Stock updated', 'Inventory has been synced to the mobile queue.');
      setBarcode('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update stock.';
      Alert.alert('Update failed', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenWrapper>
      <Text style={styles.title}>Barcode Scanner</Text>
      <Text style={styles.subtitle}>Quickly update stock without switching to desktop operations.</Text>

      <View style={styles.fakeScanner}>
        <Text style={styles.fakeScannerText}>Scanner Preview</Text>
        <Text style={styles.fakeScannerHint}>Camera integration hook point for production scanner SDK.</Text>
      </View>

      <Text style={styles.label}>Barcode</Text>
      <TextInput
        value={barcode}
        onChangeText={setBarcode}
        placeholder="e.g. 6130081840021"
        placeholderTextColor={colors.text.muted}
        style={styles.input}
      />

      <Text style={styles.label}>Units left</Text>
      <TextInput
        value={unitsLeft}
        onChangeText={setUnitsLeft}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor={colors.text.muted}
        style={styles.input}
      />

      <Text style={styles.label}>Stock status</Text>
      <View style={styles.statusRow}>
        {statusOptions.map((option) => {
          const active = option === stockStatus;

          return (
            <Pressable
              key={option}
              style={[styles.statusChip, active && styles.statusChipActive]}
              onPress={() => setStockStatus(option)}
            >
              <Text style={[styles.statusText, active && styles.statusTextActive]}>{option.toUpperCase()}</Text>
            </Pressable>
          );
        })}
      </View>

      <CustomButton label="Update Stock" onPress={handleSubmit} loading={saving} />
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
  fakeScanner: {
    minHeight: 170,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: '#BFD7E8',
    backgroundColor: '#E8F3FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  fakeScannerText: {
    color: colors.brand.darkBlue,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
  },
  fakeScannerHint: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  label: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#C8DCE8',
    backgroundColor: '#fff',
    paddingHorizontal: spacing.md,
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 15,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  statusChip: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#C9DCE9',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6FBFF',
  },
  statusChipActive: {
    borderColor: colors.brand.aqua,
    backgroundColor: '#DCF3F6',
  },
  statusText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '800',
  },
  statusTextActive: {
    color: colors.brand.aqua,
  },
});
