import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../../src/lib/theme';
import { router } from 'expo-router';

const modos = [
  { key: 'truco', label: 'Truco', icon: '🃏', desc: 'Clássico 12 pontos' },
  { key: 'universal', label: 'Universal', icon: '🎲', desc: 'Contador modular' },
];

export default function ScoreboardList() {
  const { tokens } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: tokens.color.background, padding: tokens.spacing.lg }}>
      <Text style={{ color: tokens.color.text, fontSize: tokens.fontSize.xl, fontWeight: 'bold' }}>
        Placares
      </Text>
      {modos.map((modo) => (
        <Pressable
          key={modo.key}
          accessibilityRole="button"
          accessibilityLabel={`Marcador de ${modo.label}`}
          onPress={() => router.push(`/(tabs)/scoreboards/${modo.key}`)}
          style={{
            backgroundColor: tokens.color.surface,
            borderRadius: tokens.borderRadius.lg,
            padding: tokens.spacing.lg,
            marginTop: tokens.spacing.md,
          }}
        >
          <Text style={{ fontSize: 32 }}>{modo.icon}</Text>
          <Text
            style={{ color: tokens.color.text, fontSize: tokens.fontSize.lg, fontWeight: 'bold' }}
          >
            {modo.label}
          </Text>
          <Text style={{ color: tokens.color.textMuted }}>{modo.desc}</Text>
        </Pressable>
      ))}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Histórico de partidas"
        onPress={() => router.push('/(tabs)/scoreboards/history')}
        style={{ marginTop: tokens.spacing.lg }}
      >
        <Text style={{ color: tokens.color.accent }}>Ver Histórico →</Text>
      </Pressable>
    </View>
  );
}
