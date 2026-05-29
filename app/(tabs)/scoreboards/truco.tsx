import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useScoreboardStore } from '../../../src/stores/useScoreboardStore';
import { useTheme } from '../../../src/lib/theme';
import { TrucoScoreboard } from '../../../src/components/scoreboard/TrucoScoreboard';
import { router } from 'expo-router';
import { saveMatch } from '../../../src/services/match-storage';

export default function TrucoScreen() {
  const { tokens } = useTheme();
  const { setMode, players, winnerId, elapsedSeconds, reset } = useScoreboardStore();

  useEffect(() => {
    setMode('truco');
    return () => reset();
  }, [setMode, reset]);

  useEffect(() => {
    if (winnerId && players.length >= 2) {
      const winner = players.find((p) => p.id === winnerId);
      saveMatch({
        tipoJogo: 'truco',
        jogadores: players.map((p) => ({ nome: p.name, pontuacao: p.score })),
        vencedorNome: winner?.name ?? null,
        duracaoSegundos: elapsedSeconds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winnerId]);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.color.background }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: tokens.spacing.md,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
        >
          <Text style={{ color: tokens.color.accent, fontSize: tokens.fontSize.lg }}>← Voltar</Text>
        </Pressable>
      </View>
      <TrucoScoreboard />
    </View>
  );
}
