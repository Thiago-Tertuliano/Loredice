import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../lib/theme';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { UserAvatar } from './UserAvatar';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showAccount?: boolean;
  rightAction?: {
    icon?: keyof typeof MaterialIcons.glyphMap;
    label?: string;
    onPress: () => void;
  };
  transparent?: boolean;
  onBackPress?: () => void;
}

export function AppHeader({
  title = 'LoreDice',
  showBack = false,
  showMenu = false,
  showAccount = false,
  rightAction,
  transparent = false,
  onBackPress,
}: AppHeaderProps) {
  const { tokens } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/scoreboards');
    }
  };

  const isHome = title === 'LoreDice';

  const content = (
    <View style={[styles.content, { paddingHorizontal: tokens.spacing.gutter }]}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        {showMenu && !showBack && (
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <MaterialIcons name="menu" size={24} color={tokens.color.onSurface} />
          </TouchableOpacity>
        )}

        {showBack && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
            <View style={styles.backIconWrapper}>
              <MaterialIcons name="arrow-back-ios" size={18} color={tokens.color.primary} />
            </View>
            <Text
              style={[
                tokens.typography.labelMd,
                { color: tokens.color.primary, marginLeft: tokens.spacing.xs },
              ]}
            >
              Voltar
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center Section */}
      <View style={styles.centerSection}>
        {isHome ? (
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              Lore
              <Text style={styles.logoDice}>Dice</Text>
            </Text>
          </View>
        ) : (
          <Text
            style={[tokens.typography.headlineMd, { color: tokens.color.onSurface }]}
            numberOfLines={1}
          >
            {title}
          </Text>
        )}
      </View>

      {/* Right Section */}
      <View style={styles.rightSection}>
        {showAccount && !rightAction && <UserAvatar size={38} />}

        {rightAction && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={rightAction.onPress}
            activeOpacity={0.7}
          >
            {rightAction.icon && (
              <View style={styles.actionIconWrapper}>
                <MaterialIcons name={rightAction.icon} size={18} color={tokens.color.primary} />
              </View>
            )}
            {rightAction.label && (
              <Text
                style={[
                  tokens.typography.labelMd,
                  { color: tokens.color.primary, marginLeft: rightAction.icon ? 6 : 0 },
                ]}
              >
                {rightAction.label}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (transparent) {
    return <View style={[styles.container, { paddingTop: insets.top, height: 64 + insets.top }]}>{content}</View>;
  }

  return (
    <BlurView
      intensity={85}
      tint="dark"
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          height: 64 + insets.top,
          borderBottomColor: tokens.color.primary + '22',
          borderBottomWidth: 1,
        },
      ]}
    >
      {/* Subtle gradient line at top */}
      <LinearGradient
        colors={[tokens.color.primary + '18', 'transparent']}
        style={styles.topAccent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
      {content}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    width: '100%',
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 8,
  },
  backIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(200, 155, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 22,
    color: '#ede8ff',
    textShadowColor: '#8b3fcc',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  logoDice: {
    color: '#c89bff',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(200, 155, 255, 0.10)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(200, 155, 255, 0.20)',
  },
  actionIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
