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
    <View accessibilityLabel={`Tempo: ${formatarTempo(elapsedSeconds)}`} style={styles.container}>
      <View style={styles.timeWrapper}>
        <MaterialIcons
          name="timer"
          size={16}
          color={tokens.color.onSurfaceVariant}
          style={{ marginRight: 8 }}
        />
        <Text
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
            size={20}
            color={isRunning ? tokens.color.error : tokens.color.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Resetar cronômetro"
          onPress={resetTimer}
          style={[styles.controlBtn, { backgroundColor: tokens.color.surfaceContainerHigh }]}
        >
          <MaterialIcons name="replay" size={18} color={tokens.color.onSurfaceVariant} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 28,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
