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
import { useAuth } from '@/context/AuthContext';
import { MOCK_LOGIN_CREDENTIALS } from '@/services/authService';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import type { UserRole } from '@/types/models';

const roles: { key: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'client', label: 'Client', icon: 'person-outline' },
  { key: 'pharmacist', label: 'Pharmacist', icon: 'medkit-outline' },
  { key: 'distributor', label: 'Distributor', icon: 'car-outline' },
];

const defaultRole: UserRole = 'client';

function normalizeRole(role: UserRole | string | undefined | null): UserRole {
  if (role === 'client' || role === 'pharmacist' || role === 'distributor') {
    return role;
  }

  return defaultRole;
}

function getMockCredentials(role: UserRole | string | undefined | null) {
  return MOCK_LOGIN_CREDENTIALS[normalizeRole(role)];
}

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const defaultCredentials = getMockCredentials(defaultRole);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState(defaultCredentials.email);
  const [password, setPassword] = useState(defaultCredentials.password);
  const [error, setError] = useState<string | null>(null);
  const safeRole = normalizeRole(role);
  const mockCredentials = getMockCredentials(role);

  const handleRoleSelection = (nextRole: UserRole) => {
    const nextCredentials = getMockCredentials(nextRole);
    setRole(nextRole);
    setEmail(nextCredentials.email);
    setPassword(nextCredentials.password);
    setError(null);
  };

  const applyMockCredentials = () => {
    setEmail(mockCredentials.email);
    setPassword(mockCredentials.password);
    setError(null);
  };

  const handleLogin = async () => {
    try {
      setError(null);
      await login(email, password, safeRole);
      router.replace('/');
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : 'Unable to sign in.';
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
          <View style={styles.backgroundCircleLarge} />
          <View style={styles.backgroundCircleSmall} />

          <View style={styles.card}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Welcome back</Text>
              </View>
            </View>

            <Text style={styles.title}>Sign in to Pharma Click</Text>
            <Text style={styles.subtitle}>Access your client, pharmacist, or distributor dashboard.</Text>

            <View style={styles.roleRow}>
              {roles.map((option) => {
                const active = option.key === role;

                return (
                  <Pressable
                    key={option.key}
                    onPress={() => handleRoleSelection(option.key)}
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

            <View style={styles.formSection}>
              <TextField
                label="Email address"
                value={email}
                keyboardType="email-address"
                placeholder="you@example.com"
                onChangeText={setEmail}
              />
              <TextField
                label="Password"
                value={password}
                secureTextEntry
                placeholder="••••••••"
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.mockBox}>
              <View style={styles.mockHeader}>
                <Ionicons name="flask-outline" size={16} color={colors.brand.aqua} />
                <Text style={styles.mockTitle}>Mock login enabled</Text>
              </View>
              <Text style={styles.mockText}>
                {mockCredentials.email} / {mockCredentials.password}
              </Text>
              <Pressable onPress={applyMockCredentials} style={styles.mockAction}>
                <Text style={styles.mockActionText}>Fill mock credentials</Text>
              </Pressable>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <CustomButton
              label="Sign In"
              loading={isLoading}
              onPress={handleLogin}
              icon={<Ionicons name="log-in-outline" size={16} color="#fff" />}
            />

            <View style={styles.roleGrid}>
              <RoleHint icon="person-outline" label="Client" />
              <RoleHint icon="medkit-outline" label="Pharmacist" />
              <RoleHint icon="car-outline" label="Distributor" />
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>No account yet?</Text>
              <Link href="/(auth)/register" asChild>
                <Pressable style={styles.inlineAction}>
                  <Text style={styles.inlineActionText}>Create one</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

function RoleHint({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.roleItem}>
      <Ionicons name={icon} size={18} color={colors.brand.aqua} />
      <Text style={styles.roleLabel}>{label}</Text>
    </View>
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
  backgroundCircleLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#3CA4AC1A',
    top: 30,
    right: -45,
  },
  backgroundCircleSmall: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#2D3E5014',
    bottom: -20,
    left: -30,
  },
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surface.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  badgeRow: {
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: '#EBF8F9',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#A7D9DD',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  badgeText: {
    color: colors.brand.aqua,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  title: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    lineHeight: 20,
  },
  formSection: {
    gap: spacing.sm,
  },
  mockBox: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#A7D9DD',
    backgroundColor: '#F4FBFC',
    padding: spacing.sm,
    gap: 6,
  },
  mockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mockTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  mockText: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    lineHeight: 18,
  },
  mockAction: {
    alignSelf: 'flex-start',
    minHeight: 32,
    justifyContent: 'center',
  },
  mockActionText: {
    color: colors.brand.darkBlue,
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: '800',
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  roleButton: {
    flex: 1,
    minHeight: 46,
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
  roleGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  roleItem: {
    flex: 1,
    minHeight: 50,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#FBFDFF',
  },
  roleLabel: {
    color: colors.text.secondary,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
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
