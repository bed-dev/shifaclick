import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

import { CustomButton } from '@/components/common/CustomButton';
import { UploadBox } from '@/components/pharmacy/UploadBox';
import { pharmacyService } from '@/services/pharmacyService';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { DoctorNoteScanResult } from '@/types/pharmacy';

export default function ScanDoctorNoteScreen() {
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [result, setResult] = useState<DoctorNoteScanResult | null>(null);
  const [loading, setLoading] = useState(false);

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow camera access to scan a doctor note.');
      return;
    }

    const scan = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!scan.canceled) {
      setImageUri(scan.assets[0]?.uri);
      setResult(null);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow gallery access to upload a doctor note.');
      return;
    }

    const scan = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!scan.canceled) {
      setImageUri(scan.assets[0]?.uri);
      setResult(null);
    }
  };

  const handleScan = async () => {
    try {
      setLoading(true);
      const parsed = await pharmacyService.scanDoctorNote(imageUri);
      setResult(parsed);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Scan failed.';
      Alert.alert('Scan failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Scan Doctor Note</Text>
      <Text style={styles.subtitle}>Capture a prescription page and auto-extract medicines for faster request creation.</Text>

      <UploadBox uri={imageUri} onCameraPress={pickFromCamera} onGalleryPress={pickFromGallery} />

      <CustomButton label="Scan Note" loading={loading} disabled={!imageUri} onPress={handleScan} />

      {result ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Detected Prescription</Text>
          <Text style={styles.cardMeta}>Doctor: {result.physicianName}</Text>
          <Text style={styles.cardMeta}>Issued: {result.issuedAt} • Confidence {Math.round(result.confidence * 100)}%</Text>

          {result.medications.map((medication) => (
            <View key={medication.id} style={styles.medicationRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.medicationName}>{medication.name}</Text>
                <Text style={styles.medicationMeta}>{medication.dosage} • {medication.frequency}</Text>
              </View>
              <Text style={styles.duration}>{medication.durationDays}d</Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
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
  cardTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 17,
    fontWeight: '800',
  },
  cardMeta: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
  },
  medicationRow: {
    minHeight: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#D8E6F0',
    backgroundColor: '#F8FCFF',
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  medicationName: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
  },
  medicationMeta: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    marginTop: 1,
  },
  duration: {
    color: colors.brand.aqua,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '800',
  },
});
