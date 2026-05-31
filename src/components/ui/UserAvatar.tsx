import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../lib/theme';
import { useUserProfileStore, getInitials } from '../../stores/useUserProfileStore';
import { useRouter } from 'expo-router';

interface UserAvatarProps {
  size?: number;
  onPress?: () => void;
}

/**
 * Avatar circular do usuário com iniciais e badge de status offline/online.
 * Offline-first — preparado para conectar com auth no futuro.
 */
export function UserAvatar({ size = 38, onPress }: UserAvatarProps) {
  const { tokens } = useTheme();
  const { profile } = useUserProfileStore();
  const router = useRouter();

  const initials = getInitials(profile.name);
  const fontSize = Math.round(size * 0.34);
  const badgeSize = Math.round(size * 0.32);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/settings');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.75}
      style={[styles.wrapper, { width: size, height: size }]}
      accessibilityLabel={`Perfil de ${profile.name}`}
      accessibilityRole="button"
    >
      <LinearGradient
        colors={['#a855f7', '#7c3aed', '#4c1d95']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            ...tokens.shadow.avatarGlow,
          },
        ]}
      >
        <Text
          style={[
            styles.initials,
            {
              fontFamily: 'Poppins_700Bold',
              fontSize,
              color: tokens.color.onPrimaryContainer,
            },
          ]}
        >
          {initials}
        </Text>
      </LinearGradient>

      {/* Badge de status — offline por padrão, verde no futuro quando online */}
      <View
        style={[
          styles.statusBadge,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            backgroundColor: profile.isOnline ? '#22c55e' : '#64748b',
            borderColor: tokens.color.surfaceContainer,
          },
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(200, 155, 255, 0.4)',
  },
  initials: {
    letterSpacing: 0.5,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});
