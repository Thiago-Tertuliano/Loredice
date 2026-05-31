import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useScoreboardStore } from '../../stores/useScoreboardStore';
import { useTheme } from '../../lib/theme';
import { Timer } from './Timer';
import { PlayerScoreCard } from './PlayerScoreCard';
import { NeonButton } from '../ui/NeonButton';
import { GlassInput } from '../ui/GlassInput';

const TEAM_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444'];

export function TrucoScoreboard() {
  const { tokens } = useTheme();
  const { players, addPlayer, incrementScore, decrementScore, winnerId, reset, limit } =
    useScoreboardStore();

  const [teamAName, setTeamAName] = useState('Nós');
  const [teamBName, setTeamBName] = useState('Eles');
  const [teamAColor, setTeamAColor] = useState(TEAM_COLORS[0]);
  const [teamBColor, setTeamBColor] = useState(TEAM_COLORS[3]);

  if (players.length < 2) {
    const handleStart = () => {
      addPlayer(teamAName || 'Nós', teamAColor);
      addPlayer(teamBName || 'Eles', teamBColor);
    };

    return (
      <ScrollView contentContainerStyle={styles.centerContainer} showsVerticalScrollIndicator={false}>
        <Text style={[tokens.typography.headlineMd, { color: tokens.color.onSurface, marginBottom: 8 }]}>
          Configurar Partida
        </Text>
        <Text style={[tokens.typography.bodyMd, { color: tokens.color.onSurfaceVariant, textAlign: 'center', marginBottom: 32 }]}>
          Primeiro a chegar em {limit} pontos vence!
        </Text>

        <View style={styles.teamSetupCard}>
          <GlassInput label="Time 1" value={teamAName} onChangeText={setTeamAName} placeholder="Ex: Nós" icon="groups" />
          <View style={styles.colorRow}>
            {TEAM_COLORS.map(c => (
              <TouchableOpacity key={c} onPress={() => setTeamAColor(c)} style={[styles.colorCircle, { backgroundColor: c }, teamAColor === c && styles.colorSelected]} />
            ))}
          </View>
        </View>

        <View style={styles.teamSetupCard}>
          <GlassInput label="Time 2" value={teamBName} onChangeText={setTeamBName} placeholder="Ex: Eles" icon="groups" />
          <View style={styles.colorRow}>
            {TEAM_COLORS.map(c => (
              <TouchableOpacity key={c} onPress={() => setTeamBColor(c)} style={[styles.colorCircle, { backgroundColor: c }, teamBColor === c && styles.colorSelected]} />
            ))}
          </View>
        </View>

        <NeonButton label="Iniciar Partida" variant="primary" icon="play-arrow" onPress={handleStart} style={{ marginTop: 16, minWidth: '100%' }} />
      </ScrollView>
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
          color={teamA.color}
          isWinner={isWinnerA}
          onIncrement={() => incrementScore(teamA.id)}
          onDecrement={() => decrementScore(teamA.id)}
          variant="truco"
        />

        <PlayerScoreCard
          name={teamB.name}
          score={teamB.score}
          color={teamB.color}
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
    padding: 24,
    paddingTop: 12,
  },
  teamSetupCard: {
    width: '100%',
    backgroundColor: 'rgba(26, 24, 41, 0.4)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(200, 155, 255, 0.1)',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    opacity: 0.5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorSelected: {
    opacity: 1,
    borderColor: '#FFF',
    transform: [{ scale: 1.1 }],
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
