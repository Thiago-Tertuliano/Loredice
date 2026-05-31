import { useEffect } from 'react';
import { View } from 'react-native';
import { useScoreboardStore } from '../../../src/stores/useScoreboardStore';
import { useTheme } from '../../../src/lib/theme';
import { TrucoScoreboard } from '../../../src/components/scoreboard/TrucoScoreboard';
import { AppHeader } from '../../../src/components/ui/AppHeader';
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
      <AppHeader title="Partida de Truco" showBack transparent />
      <TrucoScoreboard />
    </View>
  );
}
