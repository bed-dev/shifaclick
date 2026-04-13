import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { CustomButton } from '@/components/common/CustomButton';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { TextField } from '@/components/common/TextField';
import { useAuth } from '@/src/context/AuthContext';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';
import type { UserRole } from '@/src/types/models';

const roles: { key: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'client', label: 'Client', icon: 'person-outline' },
  { key: 'pharmacist', label: 'Pharmacist', icon: 'medkit-outline' },
  { key: 'distributor', label: 'Distributor', icon: 'car-outline' },
];

export default function RegisterScreen() {
  const { register, isLoading } = useAuth();

  const [firstName, setFirstName] = useState('Yacine');
  const [lastName, setLastName] = useState('Benali');
  const [email, setEmail] = useState('yacine@example.com');
  const [phone, setPhone] = useState('+213 6 12 34 56 78');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<UserRole>('client');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    try {
      setError(null);
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      });
      router.replace('/(tabs)/feed');
    } catch (registerError) {
      const message = registerError instanceof Error ? registerError.message : 'Unable to create account.';
      setError(message);
    }
  };

  return (
    <ScreenWrapper padded={false}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Choose your role and continue with mocked onboarding.</Text>

            <View style={styles.roleRow}>
              {roles.map((option) => {
                const active = option.key === role;

                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setRole(option.key)}
                    style={[styles.roleButton, active && styles.roleButtonActive]}
                  >
                    <Ionicons
                      name={option.icon}
                      size={18}
                      color={active ? colors.text.inverted : colors.text.secondary}
                    />
                    <Text style={[styles.roleButtonLabel, active && styles.roleButtonLabelActive]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.rowFields}>
              <View style={styles.fieldHalf}>
                <TextField label="First name" value={firstName} onChangeText={setFirstName} />
              </View>
              <View style={styles.fieldHalf}>
                <TextField label="Last name" value={lastName} onChangeText={setLastName} />
              </View>
            </View>

            <TextField
              label="Email"
              value={email}
              keyboardType="email-address"
              placeholder="you@example.com"
              onChangeText={setEmail}
            />
            <TextField
              label="Phone"
              value={phone}
              keyboardType="phone-pad"
              placeholder="+213 6xx xxx xxx"
              onChangeText={setPhone}
            />
            <TextField
              label="Password"
              value={password}
              secureTextEntry
              placeholder="Min. 8 characters"
              onChangeText={setPassword}
            />

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <CustomButton
              label="Create Account"
              loading={isLoading}
              onPress={handleRegister}
              icon={<Ionicons name="person-add-outline" size={16} color="#fff" />}
            />

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Link href="/(auth)/login" asChild>
                <Pressable style={styles.inlineAction}>
                  <Text style={styles.inlineActionText}>Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface.page,
  },
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surface.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  roleButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface.page,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  roleButtonActive: {
    backgroundColor: colors.brand.darkBlue,
    borderColor: colors.brand.darkBlue,
  },
  roleButtonLabel: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
  },
  roleButtonLabelActive: {
    color: colors.text.inverted,
  },
  rowFields: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  fieldHalf: {
    flex: 1,
  },
  errorBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    padding: spacing.sm,
  },
  errorText: {
    color: colors.status.danger,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  footerText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
  },
  inlineAction: {
    minHeight: 44,
    justifyContent: 'center',
  },
  inlineActionText: {
    color: colors.brand.aqua,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '800',
  },
});
