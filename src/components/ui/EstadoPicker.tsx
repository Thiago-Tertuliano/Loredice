import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme';
import type { EstadoConservacao } from '../../services/collection';

const opcoes: { value: EstadoConservacao; label: string; emoji: string }[] = [
  { value: 'novo', label: 'Novo', emoji: '✨' },
  { value: 'como_novo', label: 'Como Novo', emoji: '🟢' },
  { value: 'desgastado', label: 'Desgastado', emoji: '🟡' },
  { value: 'faltando_pecas', label: 'Faltando Peças', emoji: '🔴' },
];

interface Props {
  value: EstadoConservacao | null;
  onChange: (value: EstadoConservacao) => void;
}

export function EstadoPicker({ value, onChange }: Props) {
  const { tokens } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text
        style={[
          tokens.typography.labelMd,
          { color: tokens.color.onSurfaceVariant, marginBottom: 12 },
        ]}
      >
        ESTADO DE CONSERVAÇÃO
      </Text>
      <View style={styles.optionsGrid}>
        {opcoes.map((opcao) => {
          const selected = value === opcao.value;
          return (
            <TouchableOpacity
              key={opcao.value}
              accessibilityRole="button"
              accessibilityLabel={`Estado: ${opcao.label}`}
              accessibilityState={{ selected }}
              onPress={() => onChange(opcao.value)}
              activeOpacity={0.75}
              style={[
                styles.option,
                selected
                  ? {
                      backgroundColor: 'rgba(139, 63, 204, 0.2)',
                      borderColor: tokens.color.primary,
                    }
                  : {
                      backgroundColor: 'rgba(26, 24, 41, 0.6)',
                      borderColor: 'rgba(200, 155, 255, 0.12)',
                    },
              ]}
            >
              <Text style={styles.emoji}>{opcao.emoji}</Text>
              <Text
                style={[
                  tokens.typography.labelMd,
                  {
                    color: selected ? tokens.color.primary : tokens.color.onSurfaceVariant,
                    fontSize: 12,
                    textAlign: 'center',
                  },
                ]}
              >
                {opcao.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 84,
    gap: 4,
  },
  emoji: {
    fontSize: 16,
  },
});
