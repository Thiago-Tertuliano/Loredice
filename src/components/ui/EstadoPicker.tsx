import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../lib/theme';
import type { EstadoConservacao } from '../../services/collection';

const opcoes: { value: EstadoConservacao; label: string }[] = [
  { value: 'novo', label: 'Novo' },
  { value: 'como_novo', label: 'Como Novo' },
  { value: 'desgastado', label: 'Desgastado' },
  { value: 'faltando_pecas', label: 'Faltando Peças' },
];

interface Props {
  value: EstadoConservacao | null;
  onChange: (value: EstadoConservacao) => void;
}

export function EstadoPicker({ value, onChange }: Props) {
  const { tokens } = useTheme();

  return (
    <View style={{ marginTop: tokens.spacing.md }}>
      <Text style={{ color: tokens.color.textMuted, marginBottom: tokens.spacing.sm }}>
        Estado de Conservação
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm }}>
        {opcoes.map((opcao) => {
          const selected = value === opcao.value;
          return (
            <Pressable
              key={opcao.value}
              accessibilityRole="button"
              accessibilityLabel={`Estado: ${opcao.label}`}
              onPress={() => onChange(opcao.value)}
              style={{
                backgroundColor: selected ? tokens.color.accent : tokens.color.surface,
                borderRadius: tokens.borderRadius.md,
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.sm,
                borderWidth: 1,
                borderColor: selected ? tokens.color.accentLight : tokens.color.border,
              }}
            >
              <Text
                style={{
                  color: selected ? '#FFF' : tokens.color.text,
                  fontWeight: selected ? 'bold' : 'normal',
                }}
              >
                {opcao.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
