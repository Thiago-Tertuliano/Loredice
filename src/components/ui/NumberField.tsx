import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../lib/theme';

interface Props {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string | null;
  layout?: 'vertical' | 'horizontal';
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  error,
  layout = 'vertical',
}: Props) {
  const { tokens } = useTheme();

  function increment() {
    const next = (value ?? 0) + step;
    if (max !== undefined && next > max) return;
    onChange(next);
  }

  function decrement() {
    const next = (value ?? 0) - step;
    if (min !== undefined && next < min) return;
    onChange(Math.max(next, min ?? 0));
  }

  if (layout === 'horizontal') {
    return (
      <View style={styles.horizontalWrapper}>
        {label ? (
          <Text style={[tokens.typography.labelMd, { color: tokens.color.onSurfaceVariant }]}>
            {label}
          </Text>
        ) : null}
        <View style={styles.horizontalControls}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Diminuir ${label}`}
            onPress={decrement}
            style={styles.controlBtn}
          >
            <MaterialIcons name="remove" size={18} color={tokens.color.onSurfaceVariant} />
          </TouchableOpacity>
          <Text
            style={[
              tokens.typography.headlineMd,
              { color: tokens.color.onSurface, minWidth: 40, textAlign: 'center' },
            ]}
          >
            {value ?? '—'}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Aumentar ${label}`}
            onPress={increment}
            style={[styles.controlBtn, { backgroundColor: 'rgba(139, 63, 204, 0.2)' }]}
          >
            <MaterialIcons name="add" size={18} color={tokens.color.primary} />
          </TouchableOpacity>
        </View>
        {error && (
          <Text
            style={[
              tokens.typography.labelMd,
              { color: tokens.color.error, fontSize: 11, marginTop: 4 },
            ]}
          >
            {error}
          </Text>
        )}
      </View>
    );
  }

  // Vertical layout (default)
  return (
    <View style={styles.verticalWrapper}>
      {label ? (
        <Text
          style={[
            tokens.typography.labelMd,
            { color: tokens.color.onSurfaceVariant, marginBottom: 8 },
          ]}
        >
          {label}
        </Text>
      ) : null}
      <View style={styles.verticalRow}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Diminuir ${label}`}
          onPress={decrement}
          style={styles.btnSquare}
        >
          <MaterialIcons name="remove" size={18} color={tokens.color.onSurfaceVariant} />
        </TouchableOpacity>
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
          style={[
            styles.textInput,
            {
              fontFamily: 'Poppins_400Regular',
              color: tokens.color.onSurface,
              borderColor: error ? tokens.color.error + '80' : 'rgba(200, 155, 255, 0.2)',
            },
          ]}
        />
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Aumentar ${label}`}
          onPress={increment}
          style={[styles.btnSquare, { backgroundColor: 'rgba(139, 63, 204, 0.2)' }]}
        >
          <MaterialIcons name="add" size={18} color={tokens.color.primary} />
        </TouchableOpacity>
      </View>
      {error && (
        <Text
          style={[
            tokens.typography.labelMd,
            { color: tokens.color.error, fontSize: 11, marginTop: 4 },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  verticalWrapper: {
    marginBottom: 16,
  },
  verticalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnSquare: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(26, 24, 41, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(200, 155, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(26, 24, 41, 0.8)',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlign: 'center',
    fontSize: 16,
    height: 40,
  },
  horizontalWrapper: {
    marginBottom: 16,
  },
  horizontalControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(26, 24, 41, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(200, 155, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
