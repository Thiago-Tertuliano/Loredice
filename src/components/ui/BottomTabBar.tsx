import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../lib/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { tokens as themeTokens } from '../../lib/theme';

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { tokens } = useTheme();

  return (
    <BlurView intensity={95} tint="dark" style={styles.container}>
      {/* Top accent line */}
      <LinearGradient
        colors={[tokens.color.primary + '40', 'transparent']}
        style={styles.topLine}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />

      <View style={styles.content}>
        {state.routes.map(
          (route: { key: string; name: string; params?: object }, index: number) => {
            const { options } = descriptors[route.key] || {
              options: {} as Record<string, unknown>,
            };
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };

            let iconName: keyof typeof MaterialIcons.glyphMap = 'circle';
            if (route.name === 'scoreboards') iconName = 'scoreboard';
            else if (route.name === 'collection') iconName = 'library-books';
            else if (route.name === 'campaigns') iconName = 'auto-awesome';
            else if (route.name === 'wishlist') iconName = 'favorite';

            return (
              <TabItem
                key={route.key}
                label={label as string}
                iconName={iconName}
                isFocused={isFocused}
                onPress={onPress}
                onLongPress={onLongPress}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                tokens={tokens}
              />
            );
          },
        )}
      </View>
    </BlurView>
  );
}

interface TabItemProps {
  label: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
  tokens: typeof themeTokens;
}

function TabItem({
  label,
  iconName,
  isFocused,
  onPress,
  onLongPress,
  accessibilityLabel,
  testID,
  tokens,
}: TabItemProps) {
  const scaleAnim = useRef(new Animated.Value(isFocused ? 1 : 0.9)).current;
  const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1 : 0.9,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused, opacityAnim, scaleAnim]);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tab}
      activeOpacity={0.7}
    >
      {/* Active pill background */}
      <Animated.View
        style={[
          styles.activePill,
          {
            opacity: opacityAnim,
            backgroundColor: tokens.color.primaryContainer + 'CC',
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />

      {/* Active glow behind icon */}
      {isFocused && <View style={styles.iconGlow} />}

      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <MaterialIcons
          name={iconName}
          size={22}
          color={isFocused ? tokens.color.onPrimaryContainer : tokens.color.onSurfaceVariant}
        />
      </Animated.View>

      <Text
        style={[
          tokens.typography.labelSm ?? tokens.typography.labelMd,
          {
            color: isFocused ? tokens.color.onPrimaryContainer : tokens.color.onSurfaceVariant,
            marginTop: 2,
            fontSize: 10,
            fontFamily: isFocused ? 'Poppins_600SemiBold' : 'Poppins_400Regular',
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderTopColor: 'rgba(200, 155, 255, 0.12)',
  },
  topLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  content: {
    flexDirection: 'row',
    height: '100%',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    paddingVertical: 6,
  },
  activePill: {
    position: 'absolute',
    top: -2,
    left: 6,
    right: 6,
    bottom: -2,
    borderRadius: 14,
  },
  iconGlow: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: 'rgba(200, 155, 255, 0.5)',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
});
