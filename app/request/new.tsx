import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

import { CustomButton } from '@/components/common/CustomButton';
import { UploadBox } from '@/components/pharmacy/UploadBox';
import { pharmacyService } from '@/services/pharmacyService';
import { colors, elevation, radius, spacing, typography } from '@/theme/tokens';
import type { DrugForm } from '@/types/pharmacy';

const forms: DrugForm[] = ['pill', 'gel', 'syrup', 'injection'];

export default function DrugRequestWizardScreen() {
  const params = useLocalSearchParams<{ drugId: string }>();

  const [step, setStep] = useState(1);
  const [dosage, setDosage] = useState('1000mg');
  const [form, setForm] = useState<DrugForm>('pill');
  const [brandPreference, setBrandPreference] = useState('Original brand');
  const [quantity, setQuantity] = useState(1);
  const [acceptPartial, setAcceptPartial] = useState(true);
  const [prescriptionUri, setPrescriptionUri] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const canContinue = useMemo(() => {
    if (step === 1) {
      return dosage.trim().length > 0 && brandPreference.trim().length > 0;
    }

    if (step === 2) {
      return quantity > 0;
    }

    return true;
  }, [brandPreference, dosage, quantity, step]);

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera access is required to capture a prescription.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setPrescriptionUri(result.assets[0]?.uri);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Gallery access is required to upload a prescription.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setPrescriptionUri(result.assets[0]?.uri);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await pharmacyService.submitDrugRequest({
        drugId: params.drugId ?? '',
        dosage,
        form,
        brandPreference,
        quantity,
        acceptPartial,
        prescriptionUri,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Request sent', 'Your request was submitted to nearby pharmacies.');
      router.replace('/(tabs)/activity');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to submit request.';
      Alert.alert('Submission failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Request Medicine</Text>
      <Text style={styles.subtitle}>Complete 3 steps to submit your request securely.</Text>

      <StepIndicator currentStep={step} />

      {step === 1 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Step 1: Drug Details</Text>

          <Field label="Dosage" value={dosage} onChange={setDosage} />

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeRow}>
            {forms.map((option) => {
              const active = option === form;

              return (
                <Pressable
                  key={option}
                  style={[styles.typePill, active && styles.typePillActive]}
                  onPress={() => setForm(option)}
                >
                  <Text style={[styles.typeText, active && styles.typeTextActive]}>{option}</Text>
                </Pressable>
              );
            })}
          </View>

          <Field label="Brand Preference" value={brandPreference} onChange={setBrandPreference} />
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Step 2: Quantity</Text>

          <View style={styles.counterCard}>
            <Text style={styles.counterLabel}>Requested quantity</Text>
            <View style={styles.counterRow}>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
                accessibilityLabel="Decrease quantity"
              >
                <Text style={styles.counterBtnText}>-</Text>
              </Pressable>
              <Text style={styles.counterValue}>{quantity}</Text>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setQuantity((prev) => prev + 1)}
                accessibilityLabel="Increase quantity"
              >
                <Text style={styles.counterBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleTitle}>Accept partial quantity</Text>
              <Text style={styles.toggleBody}>Allow pharmacy to fulfill part of your request now.</Text>
            </View>
            <Switch value={acceptPartial} onValueChange={setAcceptPartial} />
          </View>
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Step 3: Prescription Upload</Text>
          <UploadBox uri={prescriptionUri} onCameraPress={pickFromCamera} onGalleryPress={pickFromGallery} />
        </View>
      ) : null}

      <View style={styles.actionsRow}>
        {step > 1 ? <CustomButton label="Back" variant="outline" onPress={() => setStep((prev) => prev - 1)} /> : null}

        {step < 3 ? (
          <CustomButton label="Continue" disabled={!canContinue} onPress={() => setStep((prev) => prev + 1)} />
        ) : (
          <CustomButton label="Submit Request" loading={submitting} onPress={handleSubmit} />
        )}
      </View>
    </ScrollView>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (next: string) => void }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={styles.field}
        placeholderTextColor={colors.text.muted}
      />
    </View>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <View style={styles.stepRow}>
      {[1, 2, 3].map((step) => {
        const done = step < currentStep;
        const reached = step <= currentStep;

        return (
          <View key={step} style={styles.stepNodeWrap}>
            <View
              style={[
                styles.stepNode,
                reached && styles.stepNodeActive,
                done && styles.stepNodeDone,
              ]}
            >
              <Text
                style={[
                  styles.stepNodeText,
                  reached && styles.stepNodeTextActive,
                  done && styles.stepNodeTextDone,
                ]}
              >
                {step}
              </Text>
            </View>
            {step < 3 ? <View style={[styles.stepLine, reached && styles.stepLineActive]} /> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.surface.page,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    ...typography.title,
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: '500',
  },

  /* --- Step indicator --- */
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
  },
  stepNodeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNodeActive: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.status.infoBg,
  },
  stepNodeDone: {
    borderColor: colors.status.success,
    backgroundColor: colors.status.successBg,
  },
  stepNodeText: {
    color: colors.text.muted,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: '800',
  },
  stepNodeTextActive: {
    color: colors.brand.primary,
  },
  stepNodeTextDone: {
    color: colors.status.success,
  },
  stepLine: {
    width: 64,
    height: 2,
    backgroundColor: colors.border.default,
    borderRadius: 1,
  },
  stepLineActive: {
    backgroundColor: colors.border.brand,
  },

  /* --- Card wrapper --- */
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.card,
    padding: spacing.lg,
    gap: spacing.md,
    ...elevation.sm,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    ...typography.section,
    marginBottom: spacing.xs,
  },

  /* --- Form fields --- */
  fieldWrap: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
  field: {
    minHeight: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface.inputBg,
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: '500',
  },

  /* --- Type pills --- */
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typePill: {
    minHeight: 36,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.inputBg,
  },
  typePillActive: {
    borderColor: colors.brand.primary,
    backgroundColor: colors.status.infoBg,
  },
  typeText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  typeTextActive: {
    color: colors.brand.primary,
  },

  /* --- Quantity counter --- */
  counterCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.inputBg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  counterLabel: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  counterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface.card,
  },
  counterBtnText: {
    color: colors.brand.dark,
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: '700',
  },
  counterValue: {
    minWidth: 40,
    textAlign: 'center',
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 22,
    fontWeight: '800',
  },

  /* --- Partial toggle --- */
  toggleRow: {
    minHeight: 56,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.surface.inputBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toggleTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
  },
  toggleBody: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: typography.meta.fontSize,
    marginTop: 2,
  },

  /* --- Actions --- */
  actionsRow: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
});
