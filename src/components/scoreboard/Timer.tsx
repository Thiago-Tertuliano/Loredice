import { useEffect, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useScoreboardStore } from '../../stores/useScoreboardStore';
import { useTheme } from '../../lib/theme';
import { formatarTempo } from '../../services/scoreboard';

export function Timer() {
  const { tokens } = useTheme();
  const { isRunning, elapsedSeconds, startTimer, stopTimer, resetTimer, tick } =
    useScoreboardStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  return (
    <View
      accessibilityLabel={`Tempo: ${formatarTempo(elapsedSeconds)}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}
    >
      <Text
        style={{
          color: tokens.color.textMuted,
          fontSize: tokens.fontSize.lg,
          fontVariant: ['tabular-nums'],
        }}
      >
        {formatarTempo(elapsedSeconds)}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isRunning ? 'Pausar cronômetro' : 'Iniciar cronômetro'}
        onPress={isRunning ? stopTimer : startTimer}
      >
        <Text style={{ color: tokens.color.accent }}>{isRunning ? '⏸' : '▶️'}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Resetar cronômetro"
        onPress={resetTimer}
      >
        <Text style={{ color: tokens.color.textMuted }}>↺</Text>
      </Pressable>
    </View>
  );
}
