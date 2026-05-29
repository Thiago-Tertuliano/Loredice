import { View, Pressable, Text } from 'react-native';
import { useTheme } from '../../lib/theme';

interface Props {
  value: number; // 0-5
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export function StarRating({ value, onChange, readonly = false }: Props) {
  const { tokens } = useTheme();

  return (
    <View
      accessibilityLabel={`Avaliação: ${value} de 5 estrelas`}
      style={{ flexDirection: 'row', gap: tokens.spacing.xs }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          accessibilityRole="button"
          accessibilityLabel={`${star} estrela${star > 1 ? 's' : ''}`}
          onPress={() => onChange?.(star)}
          disabled={readonly}
          style={{ opacity: star <= value ? 1 : 0.3 }}
        >
          <Text style={{ fontSize: 28 }}>{star <= value ? '★' : '☆'}</Text>
        </Pressable>
      ))}
    </View>
  );
}
