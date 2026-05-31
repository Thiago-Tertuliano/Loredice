import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  View,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../lib/theme';

interface NeonButtonProps {
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

/**
 * Botão neon com gradiente para o design system LoreDice.
 * Variantes: primary (roxo), secondary (ouro), ghost, danger.
 */
export function NeonButton({
  label,
  icon,
  variant = 'primary',
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: NeonButtonProps) {
  const { tokens } = useTheme();

  const gradientColors: [string, string] = (() => {
    if (variant === 'secondary') return ['#e8a500', '#ca8a04'];
    if (variant === 'danger') return ['#dc2626', '#991b1b'];
    if (variant === 'ghost') return ['transparent', 'transparent'];
    return ['#a855f7', '#7c3aed'];
  })();

  const textColor = (() => {
    if (variant === 'ghost') return tokens.color.primary;
    if (variant === 'secondary') return tokens.color.onSecondary;
    return '#f5e8ff';
  })();

  const borderColor = (() => {
    if (variant === 'ghost') return 'rgba(200, 155, 255, 0.3)';
    return 'transparent';
  })();

  const shadowStyle = (() => {
    if (variant === 'ghost' || disabled) return {};
    if (variant === 'secondary') return tokens.shadow.neonGlowGold;
    if (variant === 'danger') return {};
    return tokens.shadow.neonGlowPurple;
  })();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      style={[
        styles.base,
        fullWidth && styles.fullWidth,
        { borderColor, borderWidth: variant === 'ghost' ? 1 : 0, opacity: disabled ? 0.5 : 1 },
        shadowStyle,
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <>
            {icon && (
              <MaterialIcons name={icon} size={18} color={textColor} style={{ marginRight: 8 }} />
            )}
            <Text style={[styles.label, { fontFamily: 'Poppins_600SemiBold', color: textColor }]}>
              {label}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    overflow: 'hidden',
    minHeight: 52,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  label: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
