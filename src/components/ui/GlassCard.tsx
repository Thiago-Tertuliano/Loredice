import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'panel';
  neonGlow?: boolean;
  glowColor?: 'purple' | 'gold';
}

/**
 * Card com efeito glassmorphism para o design system LoreDice.
 * Suporta glow neon por cor.
 */
export function GlassCard({
  children,
  style,
  variant = 'default',
  neonGlow = false,
  glowColor = 'purple',
}: GlassCardProps) {
  const { tokens } = useTheme();

  const glowStyles = neonGlow
    ? glowColor === 'gold'
      ? tokens.shadow.neonGlowGold
      : tokens.shadow.neonGlowPurple
    : tokens.shadow.glassCard;

  return (
    <View
      style={[
        styles.base,
        variant === 'panel' ? styles.panel : styles.defaultCard,
        glowStyles,
        style as ViewStyle,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(200, 155, 255, 0.15)',
  },
  defaultCard: {
    backgroundColor: 'rgba(26, 24, 41, 0.65)',
    padding: 16,
  },
  panel: {
    backgroundColor: 'rgba(30, 28, 45, 0.9)',
    padding: 16,
  },
});
