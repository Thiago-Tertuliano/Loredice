import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../lib/theme';

interface Props {
  name: string;
  score: number;
  isWinner: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  accessibilityLabelPrefix?: string;
}

export function PlayerScoreCard({
  name,
  score,
  isWinner,
  onIncrement,
  onDecrement,
  accessibilityLabelPrefix = '',
}: Props) {
  const { tokens } = useTheme();

  return (
    <View
      accessibilityRole="header"
      accessibilityLabel={`Jogador ${name}, ${score} pontos`}
      style={{
        backgroundColor: isWinner ? tokens.color.gold : tokens.color.surface,
        borderRadius: tokens.borderRadius.lg,
        padding: tokens.spacing.lg,
        alignItems: 'center',
        minWidth: 140,
      }}
    >
      <Text
        style={{
          color: isWinner ? tokens.color.background : tokens.color.text,
          fontWeight: 'bold',
          fontSize: tokens.fontSize.lg,
        }}
      >
        {name}
      </Text>
      <Text
        accessibilityLiveRegion="polite"
        style={{
          color: isWinner ? tokens.color.background : tokens.color.accent,
          fontSize: tokens.fontSize.display,
          fontWeight: 'bold',
        }}
      >
        {score}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabelPrefix}Incrementar ponto de ${name}`}
        onPress={onIncrement}
        style={{
          backgroundColor: tokens.color.accent,
          borderRadius: tokens.borderRadius.md,
          paddingHorizontal: tokens.spacing.xl,
          paddingVertical: tokens.spacing.sm,
          marginTop: tokens.spacing.sm,
        }}
      >
        <Text style={{ color: tokens.color.text, fontWeight: 'bold' }}>+1</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabelPrefix}Decrementar ponto de ${name}`}
        onPress={onDecrement}
        style={{ marginTop: tokens.spacing.xs }}
      >
        <Text style={{ color: tokens.color.textMuted }}>-1</Text>
      </Pressable>
    </View>
  );
}
