import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme/tokens';

interface TextFieldProps {
  label?: string;
  value: string;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  secureTextEntry?: boolean;
  onChangeText: (value: string) => void;
  variant?: 'default' | 'search' | 'error' | 'disabled';
  leftIcon?: ReactNode;
  multiline?: boolean;
}

export function TextField({
  label,
  value,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  onChangeText,
  variant = 'default',
  leftIcon,
  multiline = false,
}: TextFieldProps) {
  const isDisabled = variant === 'disabled';
  const isError = variant === 'error';
  const isSearch = variant === 'search';

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={[styles.label, isError && styles.labelError]}>{label}</Text> : null}
      <View
        style={[
          styles.inputRow,
          isSearch && styles.inputSearch,
          isError && styles.inputError,
          isDisabled && styles.inputDisabled,
        ]}
      >
        {leftIcon ? <View style={styles.iconWrap}>{leftIcon}</View> : null}
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          editable={!isDisabled}
          multiline={multiline}
          style={[styles.input, leftIcon ? styles.inputWithIcon : null]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text.primary,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    fontFamily: typography.fontFamily,
  },
  labelError: {
    color: colors.status.danger,
  },
  inputRow: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radius.md,
    backgroundColor: colors.surface.inputBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  inputSearch: {
    backgroundColor: colors.surface.subtle,
    borderColor: colors.border.default,
  },
  inputError: {
    borderColor: colors.status.danger,
    backgroundColor: colors.status.dangerBg,
  },
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: colors.surface.subtle,
  },
  iconWrap: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
    fontFamily: typography.fontFamily,
    paddingVertical: spacing.sm,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
});
