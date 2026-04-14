import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { CustomButton } from '@/components/common/CustomButton';
import { pharmacyService } from '@/services/pharmacyService';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { DrugForm } from '@/types/pharmacy';

const forms: DrugForm[] = ['pill', 'gel', 'syrup', 'injection'];

export default function AddMedicationScreen() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [form, setForm] = useState<DrugForm>('pill');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await pharmacyService.addMedication({
        name,
        dosage,
        form,
        quantity: Number(quantity) || 0,
        notes,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Medication added', 'Your medication has been saved to your quick request list.');
      setName('');
      setDosage('');
      setQuantity('1');
      setNotes('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to add medication.';
      Alert.alert('Save failed', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Add Medication</Text>
      <Text style={styles.subtitle}>Save commonly used meds so next requests take only a few taps.</Text>

      <View style={styles.card}>
        <Field label="Medicine Name" value={name} onChangeText={setName} placeholder="e.g. Amoxicillin" />
        <Field label="Dosage" value={dosage} onChangeText={setDosage} placeholder="e.g. 500mg" />

        <Text style={styles.label}>Form</Text>
        <View style={styles.formRow}>
          {forms.map((option) => {
            const active = option === form;

            return (
              <Pressable
                key={option}
                style={[styles.formPill, active && styles.formPillActive]}
                onPress={() => setForm(option)}
              >
                <Text style={[styles.formText, active && styles.formTextActive]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        <Field label="Preferred Quantity" value={quantity} onChangeText={setQuantity} keyboardType="number-pad" />
        <Field label="Notes (optional)" value={notes} onChangeText={setNotes} placeholder="After meals, avoid morning, etc." />
      </View>

      <CustomButton label="Save Medication" loading={saving} onPress={handleSave} />
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (next: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad';
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        keyboardType={keyboardType ?? 'default'}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.surface.page,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 24,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    lineHeight: 19,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#CDE0EC',
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    gap: spacing.sm,
  },
  fieldWrap: {
    gap: 6,
  },
  label: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#C9DCE9',
    backgroundColor: '#F9FDFF',
    paddingHorizontal: spacing.sm,
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
  },
  formRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  formPill: {
    minHeight: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#C9DCE9',
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6FBFF',
  },
  formPillActive: {
    borderColor: colors.brand.aqua,
    backgroundColor: '#DBF2F5',
  },
  formText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  formTextActive: {
    color: colors.brand.aqua,
  },
});
