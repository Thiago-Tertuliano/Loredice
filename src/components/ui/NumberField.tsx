import { View, Text, TextInput, Pressable } from 'react-native';
import { useTheme } from '../../lib/theme';

interface Props {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string | null;
}

export function NumberField({ label, value, onChange, min, max, step = 1, error }: Props) {
  const { tokens } = useTheme();

  function increment() {
    const next = (value ?? 0) + step;
    if (max !== undefined && next > max) return;
    onChange(next);
  }

  function decrement() {
    const next = (value ?? 0) - step;
    if (min !== undefined && next < min) return;
    onChange(next);
  }

  return (
    <View style={{ marginTop: tokens.spacing.md }}>
      <Text style={{ color: tokens.color.textMuted, marginBottom: tokens.spacing.xs }}>
        {label}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Diminuir ${label}`}
          onPress={decrement}
          style={{
            backgroundColor: tokens.color.surfaceLight,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.sm,
            width: 44,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: tokens.color.text, fontSize: tokens.fontSize.lg }}>-</Text>
        </Pressable>
        <TextInput
          accessibilityLabel={label}
          keyboardType="number-pad"
          value={value != null ? String(value) : ''}
          onChangeText={(v) => {
            const parsed = parseInt(v, 10);
            if (isNaN(parsed)) onChange(null);
            else if (max !== undefined && parsed > max) onChange(max);
            else if (min !== undefined && parsed < min) onChange(min);
            else onChange(parsed);
          }}
          style={{
            flex: 1,
            backgroundColor: tokens.color.surface,
            color: tokens.color.text,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.md,
            textAlign: 'center',
            borderWidth: 1,
            borderColor: error ? tokens.color.error : tokens.color.border,
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Aumentar ${label}`}
          onPress={increment}
          style={{
            backgroundColor: tokens.color.surfaceLight,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.sm,
            width: 44,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: tokens.color.text, fontSize: tokens.fontSize.lg }}>+</Text>
        </Pressable>
      </View>
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
