import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../lib/theme';
import { GlassCard } from '../ui/GlassCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

interface Props {
  name: string;
  score: number;
  isWinner: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove?: () => void;
  _accessibilityLabelPrefix?: string;
  subLabel?: string;
  variant?: 'truco' | 'universal';
}

export function PlayerScoreCard({
  name,
  score,
  isWinner,
  onIncrement,
  onDecrement,
  onRemove,
  _accessibilityLabelPrefix = '',
  subLabel = '',
  variant = 'universal',
}: Props) {
  const { tokens } = useTheme();
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isWinner) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -10, duration: 500, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]),
      ).start();
    } else {
      bounceAnim.setValue(0);
    }
  }, [isWinner, bounceAnim]);

  if (variant === 'truco') {
    return (
      <View
        style={[
          styles.trucoContainer,
          isWinner ? styles.winnerBg : styles.normalBg,
          isWinner && tokens.shadow.winnerGlow,
        ]}
      >
        {isWinner && (
          <Animated.View style={[styles.trophyBadge, { transform: [{ translateY: bounceAnim }] }]}>
            <View style={styles.trophyCircle}>
              <MaterialIcons name="emoji-events" size={24} color={tokens.color.onSecondary} />
            </View>
          </Animated.View>
        )}

        <Text
          style={[
            tokens.typography.headlineMd,
            {
              color: isWinner ? tokens.color.onSecondary : tokens.color.onSurface,
              marginBottom: 16,
            },
          ]}
        >
          {name}
        </Text>

        <View style={styles.trucoScoreRow}>
          <TouchableOpacity style={styles.trucoMinusButton} onPress={onDecrement}>
            <MaterialIcons
              name="remove"
              size={24}
              color={isWinner ? tokens.color.onSecondary + '80' : tokens.color.outlineVariant}
            />
          </TouchableOpacity>

          <View style={styles.trucoScoreCenter}>
            <Text
              style={[
                tokens.typography.displayLg,
                { color: isWinner ? tokens.color.onSecondary : tokens.color.onSurface },
              ]}
            >
              {score}
            </Text>
            <Text
              style={[
                tokens.typography.labelMd,
                {
                  color: isWinner
                    ? tokens.color.onSecondaryContainer
                    : tokens.color.onSurfaceVariant,
                  marginTop: -8,
                },
              ]}
            >
              PONTOS
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.trucoPlusButton,
              isWinner
                ? { backgroundColor: tokens.color.onSecondary }
                : {
                    backgroundColor: tokens.color.primaryContainer,
                    ...tokens.shadow.neonGlowPurple,
                  },
            ]}
            onPress={onIncrement}
          >
            <MaterialIcons
              name="add"
              size={32}
              color={isWinner ? tokens.color.secondary : tokens.color.onPrimaryContainer}
            />
          </TouchableOpacity>
        </View>

        {isWinner && (
          <View style={styles.winnerPill}>
            <MaterialIcons
              name="emoji-events"
              size={16}
              color={tokens.color.onSecondary}
              style={{ marginRight: 4 }}
            />
            <Text style={[tokens.typography.labelMd, { color: tokens.color.onSecondary }]}>
              {name} venceu!
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Universal Variant
  return (
    <GlassCard
      variant="panel"
      neonGlow={isWinner}
      glowColor="purple"
      style={[styles.universalContainer, isWinner ? tokens.shadow.winnerGlow : {}]}
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              tokens.typography.headlineMd,
              { color: isWinner ? tokens.color.primary : tokens.color.primary },
            ]}
          >
            {name}
          </Text>
          {subLabel ? (
            <Text style={[tokens.typography.bodyMd, { color: tokens.color.onSurfaceVariant }]}>
              {subLabel}
            </Text>
          ) : null}
        </View>
        {onRemove && !isWinner && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onRemove}
            accessibilityLabel={`Remover ${name}`}
            accessibilityRole="button"
          >
            <MaterialIcons name="delete" size={20} color={tokens.color.error} />
          </TouchableOpacity>
        )}
        {isWinner && (
          <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
            <MaterialIcons name="emoji-events" size={28} color={tokens.color.secondary} />
          </Animated.View>
        )}
      </View>

      <View style={styles.universalScoreCenter}>
        <Text
          style={[
            tokens.typography.displayLg,
            {
              color: isWinner ? tokens.color.secondary : tokens.color.secondary,
              textShadowColor: tokens.color.secondaryContainer,
              textShadowRadius: 10,
              fontSize: 64,
              lineHeight: 72,
            },
          ]}
        >
          {score}
        </Text>
      </View>

      <View style={styles.universalActionRow}>
        <TouchableOpacity style={styles.universalMinusBtn} onPress={onDecrement}>
          <MaterialIcons name="remove" size={24} color={tokens.color.onSurfaceVariant} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.universalPlusBtn, tokens.shadow.neonGlowPurple]}
          onPress={onIncrement}
        >
          <MaterialIcons name="add" size={32} color={tokens.color.onPrimaryContainer} />
        </TouchableOpacity>
      </View>

      {isWinner && (
        <View style={styles.winnerPillUniversal}>
          <Text style={[tokens.typography.labelMd, { color: tokens.color.secondary }]}>
            🏆 {name} venceu!
          </Text>
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  // Truco
  trucoContainer: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 16,
    position: 'relative',
    alignItems: 'center',
  },
  winnerBg: {
    backgroundColor: '#e8a500',
  },
  normalBg: {
    backgroundColor: '#1A1829',
    borderWidth: 1,
    borderColor: '#3d345333',
  },
  trophyBadge: {
    position: 'absolute',
    top: -16,
    right: -16,
  },
  trophyCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  trucoScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  trucoMinusButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  trucoScoreCenter: {
    alignItems: 'center',
  },
  trucoPlusButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    marginTop: 24,
  },

  // Universal
  universalContainer: {
    padding: 24,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  deleteButton: {
    padding: 6,
    backgroundColor: 'rgba(255, 133, 133, 0.08)',
    borderRadius: 8,
  },
  universalScoreCenter: {
    alignItems: 'center',
    marginVertical: 20,
  },
  universalActionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  universalMinusBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#3d3450',
    alignItems: 'center',
    justifyContent: 'center',
  },
  universalPlusBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#8b3fcc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerPillUniversal: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(232, 165, 0, 0.12)',
    borderRadius: 20,
  },
});
