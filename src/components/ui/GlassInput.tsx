import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle, KeyboardType } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';

interface GlassInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText?: (value: string) => void;
  onSubmitEditing?: () => void;
  icon?: keyof typeof MaterialIcons.glyphMap;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  keyboardType?: KeyboardType;
  style?: ViewStyle;
}

/**
 * Input com efeito glass para o design system LoreDice.
 * Suporte a ícone à esquerda, label acima, e estado de erro.
 */
export function GlassInput({
  label,
  placeholder,
  value,
  onChangeText,
  onSubmitEditing,
  icon,
  multiline = false,
  numberOfLines = 1,
  error,
  keyboardType,
  style,
}: GlassInputProps) {
  const { tokens } = useTheme();

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text
          style={[
            tokens.typography.labelMd,
            styles.label,
            { color: tokens.color.onSurfaceVariant },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? tokens.color.error + '80' : 'rgba(200, 155, 255, 0.2)',
          },
        ]}
      >
        {icon && (
          <MaterialIcons
            name={icon}
            size={18}
            color={tokens.color.onSurfaceVariant}
            style={styles.icon}
          />
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={tokens.color.outlineVariant}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          keyboardType={keyboardType}
          style={[
            styles.input,
            {
              fontFamily: 'Poppins_400Regular',
              color: tokens.color.onSurface,
              minHeight: multiline ? numberOfLines * 22 + 24 : undefined,
              textAlignVertical: multiline ? 'top' : 'auto',
            },
          ]}
        />
      </View>
      {error && (
        <Text
          style={[
            tokens.typography.labelMd,
            { color: tokens.color.error, marginTop: 6, fontSize: 11 },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(26, 24, 41, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    margin: 0,
    padding: 0,
  },
});
