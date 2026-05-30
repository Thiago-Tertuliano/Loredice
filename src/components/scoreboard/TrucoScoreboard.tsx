import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useScoreboardStore } from '../../stores/useScoreboardStore';
import { useTheme } from '../../lib/theme';
import { Timer } from './Timer';
import { PlayerScoreCard } from './PlayerScoreCard';
import { NeonButton } from '../ui/NeonButton';

export function TrucoScoreboard() {
  const { tokens } = useTheme();
  const { players, addPlayer, incrementScore, decrementScore, winnerId, reset, limit } =
    useScoreboardStore();

  const isTeamAFull = players.length >= 1;
  const isTeamBFull = players.length >= 2;

  if (players.length < 2) {
    return (
      <View style={styles.centerContainer}>
        <Text
          style={[tokens.typography.headlineMd, { color: tokens.color.onSurface, marginBottom: 8 }]}
        >
          Adicione 2 times para começar
        </Text>
        <Text
          style={[
            tokens.typography.bodyMd,
            { color: tokens.color.onSurfaceVariant, textAlign: 'center', marginBottom: 32 },
          ]}
        >
          Primeiro time a chegar em {limit} pontos vence!
        </Text>
        <NeonButton
          label="Adicionar Nós"
          variant="primary"
          onPress={() => addPlayer('Nós')}
          disabled={isTeamAFull}
          style={{ marginBottom: 16, minWidth: 200 }}
        />
        <NeonButton
          label="Adicionar Eles"
          variant="secondary"
          onPress={() => addPlayer('Eles')}
          disabled={isTeamBFull}
          style={{ minWidth: 200 }}
        />
      </View>
    );
  }

  const teamA = players[0]!;
  const teamB = players[1]!;
  const isWinnerA = winnerId === teamA.id;
  const isWinnerB = winnerId === teamB.id;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <Timer />

      <Text style={[tokens.typography.labelMd, styles.limitLabel]}>
        PRIMEIRO A {limit} PONTOS VENCE
      </Text>

      <View style={styles.teamsContainer}>
        <PlayerScoreCard
          name={teamA.name}
          score={teamA.score}
          isWinner={isWinnerA}
          onIncrement={() => incrementScore(teamA.id)}
          onDecrement={() => decrementScore(teamA.id)}
          variant="truco"
        />

        <PlayerScoreCard
          name={teamB.name}
          score={teamB.score}
          isWinner={isWinnerB}
          onIncrement={() => incrementScore(teamB.id)}
          onDecrement={() => decrementScore(teamB.id)}
          variant="truco"
        />
      </View>

      {(isWinnerA || isWinnerB) && (
        <View style={styles.actionContainer}>
          <NeonButton
            label="Nova Partida"
            icon="replay"
            variant="primary"
            fullWidth
            onPress={reset}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  limitLabel: {
    color: '#7a6e8a',
    textAlign: 'center',
    letterSpacing: 1.5,
    marginBottom: 16,
    marginTop: 4,
  },
  teamsContainer: {
    marginTop: 8,
  },
  actionContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
});
