import { View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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
      style={{ flexDirection: 'row', gap: 4 }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          accessibilityRole="button"
          accessibilityLabel={`${star} estrela${star > 1 ? 's' : ''}`}
          onPress={() => onChange?.(star)}
          disabled={readonly}
          activeOpacity={readonly ? 1 : 0.7}
        >
          <MaterialIcons
            name={star <= value ? 'star' : 'star-border'}
            size={36}
            color={star <= value ? tokens.color.secondary : tokens.color.onSurfaceVariant}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
