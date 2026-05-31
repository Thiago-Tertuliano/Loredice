import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useScoreboardStore } from '../../stores/useScoreboardStore';
import { useTheme } from '../../lib/theme';
import { formatarTempo } from '../../services/scoreboard';
import { MaterialIcons } from '@expo/vector-icons';

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

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <View style={styles.container}>
      <View style={styles.glassRectangle}>
        <View style={styles.timeWrapper}>
          <MaterialIcons
            name="timer"
            size={24}
            color={tokens.color.onSurfaceVariant}
            style={{ marginRight: 12, marginTop: 4 }}
          />
          <Text
            accessibilityLabel={`Tempo: ${formatarTempo(elapsedSeconds)}`}
            style={[
              styles.timeText,
              { fontFamily: 'Poppins_700Bold', color: tokens.color.onSurface },
            ]}
          >
            {timeDisplay}
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={isRunning ? 'Pausar cronômetro' : 'Iniciar cronômetro'}
            onPress={isRunning ? stopTimer : startTimer}
            style={[
              styles.controlBtn,
              {
                backgroundColor: isRunning
                  ? tokens.color.error + '20'
                  : tokens.color.primaryContainer + '30',
              },
            ]}
          >
            <MaterialIcons
              name={isRunning ? 'pause' : 'play-arrow'}
              size={32}
              color={isRunning ? tokens.color.error : tokens.color.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Resetar cronômetro"
            onPress={resetTimer}
            style={[styles.controlBtn, { backgroundColor: tokens.color.surfaceContainerHigh }]}
          >
            <MaterialIcons name="replay" size={24} color={tokens.color.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  glassRectangle: {
    backgroundColor: 'rgba(26, 24, 41, 0.6)',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 155, 255, 0.1)',
    minWidth: 220,
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 48,
    letterSpacing: 4,
    fontVariant: ['tabular-nums'],
    lineHeight: 56,
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
