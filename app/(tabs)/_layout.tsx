import { Tabs } from 'expo-router';
import { tokens } from '../../src/lib/theme';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: tokens.color.surface, borderTopColor: tokens.color.border },
        tabBarActiveTintColor: tokens.color.accent,
        tabBarInactiveTintColor: tokens.color.textMuted,
      }}
    >
      <Tabs.Screen
        name="scoreboards"
        options={{ title: 'Placares', tabBarIcon: () => <Text style={{ fontSize: 24 }}>🏆</Text> }}
      />
      <Tabs.Screen
        name="collection"
        options={{ title: 'Coleção', tabBarIcon: () => <Text style={{ fontSize: 24 }}>📦</Text> }}
      />
    </Tabs>
  );
}
