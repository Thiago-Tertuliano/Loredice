import { View, Text, Pressable } from 'react-native';
import { useScoreboardStore } from '../../stores/useScoreboardStore';
import { useTheme } from '../../lib/theme';
import { Timer } from './Timer';
import { PlayerScoreCard } from './PlayerScoreCard';

export function TrucoScoreboard() {
  const { tokens } = useTheme();
  const { players, addPlayer, incrementScore, decrementScore, winnerId, reset, limit } =
    useScoreboardStore();

  const isTeamAFull = players.length >= 1; // time A = 1 jogador hardcoded para V1
  const isTeamBFull = players.length >= 2;

  if (players.length < 2) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.color.background,
          padding: tokens.spacing.lg,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: tokens.color.text, fontSize: tokens.fontSize.lg }}>
          Adicione 2 jogadores
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar Time A"
          onPress={() => addPlayer('Time A')}
          disabled={isTeamAFull}
          style={{
            backgroundColor: tokens.color.accent,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.md,
            marginTop: tokens.spacing.md,
            opacity: isTeamAFull ? 0.5 : 1,
          }}
        >
          <Text style={{ color: tokens.color.text }}>Adicionar Time A</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar Time B"
          onPress={() => addPlayer('Time B')}
          disabled={isTeamBFull}
          style={{
            backgroundColor: tokens.color.gold,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.md,
            marginTop: tokens.spacing.md,
            opacity: isTeamBFull ? 0.5 : 1,
          }}
        >
          <Text style={{ color: tokens.color.background }}>Adicionar Time B</Text>
        </Pressable>
      </View>
    );
  }

  const teamA = players[0]!;
  const teamB = players[1]!;
  const winner = winnerId ? players.find((p) => p.id === winnerId) : null;

  if (winner) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.color.background,
          justifyContent: 'center',
          alignItems: 'center',
          padding: tokens.spacing.lg,
        }}
      >
        <Text
          accessibilityRole="header"
          style={{ color: tokens.color.gold, fontSize: tokens.fontSize.xxl, fontWeight: 'bold' }}
        >
          🏆 {winner.name} venceu!
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nova partida"
          onPress={reset}
          style={{
            backgroundColor: tokens.color.accent,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.md,
            marginTop: tokens.spacing.lg,
          }}
        >
          <Text style={{ color: tokens.color.text }}>Nova Partida</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.color.background, padding: tokens.spacing.lg }}>
      <Timer />
      <Text
        style={{ color: tokens.color.textMuted, textAlign: 'center', marginTop: tokens.spacing.sm }}
      >
        Primeiro a {limit} vence
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: tokens.spacing.lg,
        }}
      >
        <PlayerScoreCard
          name={teamA.name}
          score={teamA.score}
          isWinner={false}
          onIncrement={() => incrementScore(teamA.id)}
          onDecrement={() => decrementScore(teamA.id)}
          accessibilityLabelPrefix="Time A: "
        />
        <PlayerScoreCard
          name={teamB.name}
          score={teamB.score}
          isWinner={false}
          onIncrement={() => incrementScore(teamB.id)}
          onDecrement={() => decrementScore(teamB.id)}
          accessibilityLabelPrefix="Time B: "
        />
      </View>
    </View>
  );
}
