import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { CustomButton } from '@/components/common/CustomButton';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { TextField } from '@/components/common/TextField';
import { useAuth } from '@/src/context/AuthContext';
import { useProfile } from '@/src/hooks/useProfile';
import { colors, radius, spacing, typography } from '@/src/theme/tokens';

const secondaryLinks = [
  { key: 'help', title: 'Help Center', icon: 'help-circle-outline' as const },
  { key: 'privacy', title: 'Privacy Policy', icon: 'shield-checkmark-outline' as const },
  { key: 'terms', title: 'Terms of Service', icon: 'document-text-outline' as const },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { data, saveProfile, isSaving, saveError } = useProfile();

  const profile = useMemo(() => data ?? user, [data, user]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (!profile) {
      return;
    }

    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setPhone(profile.phone);
    setCity(profile.city);
  }, [profile]);

  const initials = `${profile?.firstName?.[0] ?? ''}${profile?.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <ScreenWrapper>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials || 'U'}</Text>
          </View>

          <View style={styles.headerMeta}>
            <Text style={styles.nameText}>{profile?.firstName} {profile?.lastName}</Text>
            <Text style={styles.emailText}>{profile?.email}</Text>
            <Text style={styles.roleText}>
              {profile?.role === 'pharmacist' ? 'PHARMACIST MODE' : 'PATIENT MODE'} · {profile?.verified ? 'Verified' : 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Profile management</Text>

          <View style={styles.rowFields}>
            <View style={styles.fieldHalf}>
              <TextField label="First name" value={firstName} onChangeText={setFirstName} />
            </View>
            <View style={styles.fieldHalf}>
              <TextField label="Last name" value={lastName} onChangeText={setLastName} />
            </View>
          </View>

          <TextField label="Phone" value={phone} keyboardType="phone-pad" onChangeText={setPhone} />
          <TextField label="City" value={city} onChangeText={setCity} />

          {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

          <CustomButton
            label="Save profile"
            loading={isSaving}
            onPress={() => saveProfile({ firstName, lastName, phone, city })}
            icon={<Ionicons name="save-outline" size={16} color="#fff" />}
          />
        </View>

        <View style={styles.linksCard}>
          <Text style={styles.sectionTitle}>More</Text>
          {secondaryLinks.map((link) => (
            <Pressable key={link.key} style={styles.linkRow}>
              <View style={styles.linkLeft}>
                <Ionicons name={link.icon} size={18} color={colors.brand.aqua} />
                <Text style={styles.linkText}>{link.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.text.muted} />
            </Pressable>
          ))}
        </View>

        <CustomButton
          label="Logout"
          variant="outline"
          onPress={() => {
            logout();
            router.replace('/(auth)/login');
          }}
          icon={<Ionicons name="log-out-outline" size={16} color={colors.brand.aqua} />}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  headerCard: {
    borderRadius: radius.xl,
    backgroundColor: colors.brand.darkBlue,
    padding: spacing.lg,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFFFFF22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
  },
  headerMeta: {
    flex: 1,
    gap: 2,
  },
  nameText: {
    color: '#fff',
    fontFamily: typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
  },
  emailText: {
    color: '#CBD5E1',
    fontFamily: typography.fontFamily,
    fontSize: 13,
  },
  roleText: {
    color: colors.brand.aqua,
    fontFamily: typography.fontFamily,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 3,
    letterSpacing: 0.4,
  },
  formCard: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  rowFields: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  fieldHalf: {
    flex: 1,
  },
  linksCard: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surface.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  linkRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: '#FBFDFF',
    paddingHorizontal: spacing.sm,
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  linkText: {
    color: colors.text.primary,
    fontFamily: typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: colors.status.danger,
    fontFamily: typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
  },
});
