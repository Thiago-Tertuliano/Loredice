import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../src/lib/theme';
import { router } from 'expo-router';

export default function MatchModalScreen() {
  const { tokens } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.color.background, padding: tokens.spacing.lg }}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.dismissAll()}
        style={{ alignSelf: 'flex-end' }}
      >
        <Text style={{ color: tokens.color.accent, fontSize: tokens.fontSize.lg }}>Fechar</Text>
      </Pressable>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: tokens.color.textMuted }}>Detalhes da partida em breve</Text>
      </View>
    </View>
  );
}
