import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../../lib/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string | null;
}

export function FormField({ label, error, style, ...rest }: Props) {
  const { tokens } = useTheme();

  return (
    <View style={{ marginTop: tokens.spacing.md }}>
      <Text style={{ color: tokens.color.textMuted, marginBottom: tokens.spacing.xs }}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={tokens.color.textMuted}
        style={[
          {
            backgroundColor: tokens.color.surface,
            color: tokens.color.text,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.md,
            borderWidth: 1,
            borderColor: error ? tokens.color.error : tokens.color.border,
          },
          style,
        ]}
        {...rest}
      />
      {error && (
        <Text
          style={{
            color: tokens.color.error,
            fontSize: tokens.fontSize.sm,
            marginTop: tokens.spacing.xs,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
