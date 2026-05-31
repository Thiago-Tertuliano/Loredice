import { View, Text } from 'react-native';
import { useTheme } from '../../lib/theme';

type Estado = 'novo' | 'como_novo' | 'desgastado' | 'faltando_pecas';

const labels: Record<Estado, string> = {
  novo: 'Novo',
  como_novo: 'Como Novo',
  desgastado: 'Desgastado',
  faltando_pecas: 'Faltando Peças',
};

const colors: Record<Estado, string> = {
  novo: '#46A758',
  como_novo: '#86E8A5',
  desgastado: '#FFB703',
  faltando_pecas: '#E5484D',
};

interface Props {
  estado: Estado;
}

export function ConservationBadge({ estado }: Props) {
  const { tokens } = useTheme();

  return (
    <View
      accessibilityLabel={`Estado: ${labels[estado]}`}
      style={{
        backgroundColor: colors[estado] + '20',
        borderRadius: tokens.borderRadius.sm,
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.xs,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: colors[estado], fontSize: tokens.fontSize.sm, fontWeight: 'bold' }}>
        {labels[estado]}
      </Text>
    </View>
  );
}
