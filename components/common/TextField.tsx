import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/src/theme/tokens';

interface TextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  onChangeText: (value: string) => void;
}

export function TextField({
  label,
  value,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  onChangeText,
}: TextFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.text.muted}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: typography.fontFamily,
  },
  input: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: colors.surface.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface.card,
    paddingHorizontal: spacing.md,
    color: colors.text.primary,
    fontSize: 15,
    fontFamily: typography.fontFamily,
  },
});
