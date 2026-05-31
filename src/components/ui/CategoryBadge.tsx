import { View, Text } from 'react-native';
import { useTheme } from '../../lib/theme';

interface Props {
  nome: string;
  cor?: string | null;
}

export function CategoryBadge({ nome, cor }: Props) {
  const { tokens } = useTheme();
  const bgColor = cor ?? '#6366F1';

  return (
    <View
      accessibilityLabel={`Categoria: ${nome}`}
      style={{
        backgroundColor: bgColor + '25',
        borderRadius: tokens.borderRadius.sm,
        paddingHorizontal: tokens.spacing.sm,
        paddingVertical: tokens.spacing.xs,
        borderWidth: 1,
        borderColor: bgColor + '40',
      }}
    >
      <Text style={{ color: bgColor, fontSize: tokens.fontSize.sm, fontWeight: 'bold' }}>
        {nome}
      </Text>
    </View>
  );
}
