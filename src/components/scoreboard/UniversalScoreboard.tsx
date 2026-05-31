import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useScoreboardStore } from '../../stores/useScoreboardStore';
import { useTheme } from '../../lib/theme';
import { Timer } from './Timer';
import { PlayerScoreCard } from './PlayerScoreCard';
import { GlassInput } from '../ui/GlassInput';
import { NeonButton } from '../ui/NeonButton';
import { NumberField } from '../ui/NumberField';
import { GlassCard } from '../ui/GlassCard';

export function UniversalScoreboard() {
  const { tokens } = useTheme();
  const {
    players,
    addPlayer,
    removePlayer,
    incrementScore,
    decrementScore,
    winnerId,
    reset,
    setLimit,
    limit,
  } = useScoreboardStore();
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmedName = newName.trim();
    if (!trimmedName) {
      setError('Nome não pode estar vazio');
      return;
    }
    if (players.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('Este jogador já está no placar');
      return;
    }
    addPlayer(trimmedName);
    setNewName('');
    setError(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Timer />

      <GlassCard variant="panel" style={styles.configCard}>
        <View style={styles.limitRow}>
          <Text style={[tokens.typography.headlineMd, { color: tokens.color.onSurface }]}>
            Pontuação Máxima
          </Text>
          <NumberField
            label=""
            value={limit}
            onChange={(v) => setLimit(v || 12)}
            min={1}
            layout="horizontal"
          />
        </View>

        <View style={styles.addPlayerRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <GlassInput
              placeholder="Adicionar jogador..."
              icon="person-add"
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleAdd}
              error={error || undefined}
            />
          </View>
          <NeonButton
            label="ADD"
            variant="primary"
            onPress={handleAdd}
            style={{ height: 50, marginTop: -16 }}
          />
        </View>
      </GlassCard>

      <View style={styles.playersGrid}>
        {players.map((player) => (
          <View key={player.id} style={styles.playerWrapper}>
            <PlayerScoreCard
              name={player.name}
              score={player.score}
              isWinner={player.id === winnerId}
              onIncrement={() => incrementScore(player.id)}
              onDecrement={() => decrementScore(player.id)}
              onRemove={() => removePlayer(player.id)}
              variant="universal"
            />
          </View>
        ))}
      </View>

      {winnerId && (
        <View style={styles.winnerAction}>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  configCard: {
    padding: 20,
    marginBottom: 24,
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  addPlayerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  playersGrid: {
    gap: 0,
  },
  playerWrapper: {
    width: '100%',
  },
  winnerAction: {
    marginTop: 24,
    alignItems: 'center',
  },
});
