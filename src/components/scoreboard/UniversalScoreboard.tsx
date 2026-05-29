import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useScoreboardStore } from '../../stores/useScoreboardStore';
import { useTheme } from '../../lib/theme';
import { Timer } from './Timer';
import { PlayerScoreCard } from './PlayerScoreCard';
import { validarJogadores } from '../../services/scoreboard';

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
    const result = validarJogadores([...players.map((p) => p.name), newName]);
    if (!result.success) {
      setError(result.error);
      return;
    }
    addPlayer(newName.trim());
    setNewName('');
    setError(null);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: tokens.color.background, padding: tokens.spacing.lg }}
    >
      <Timer />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: tokens.spacing.md,
          gap: tokens.spacing.sm,
        }}
      >
        <Text accessibilityLabel="Limite de pontos" style={{ color: tokens.color.textMuted }}>
          Limite:
        </Text>
        <TextInput
          accessibilityLabel="Limite de pontos"
          keyboardType="number-pad"
          value={String(limit)}
          onChangeText={(v) => setLimit(Number(v) || 12)}
          style={{
            backgroundColor: tokens.color.surface,
            color: tokens.color.text,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.sm,
            width: 60,
            textAlign: 'center',
          }}
        />
      </View>

      <View style={{ flexDirection: 'row', marginTop: tokens.spacing.md, gap: tokens.spacing.sm }}>
        <TextInput
          accessibilityLabel="Nome do novo jogador"
          placeholder="Nome do jogador"
          placeholderTextColor={tokens.color.textMuted}
          value={newName}
          onChangeText={setNewName}
          onSubmitEditing={handleAdd}
          style={{
            flex: 1,
            backgroundColor: tokens.color.surface,
            color: tokens.color.text,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.md,
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar jogador"
          onPress={handleAdd}
          style={{
            backgroundColor: tokens.color.accent,
            borderRadius: tokens.borderRadius.md,
            paddingHorizontal: tokens.spacing.lg,
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: tokens.color.text, fontWeight: 'bold' }}>+</Text>
        </Pressable>
      </View>
      {error && (
        <Text style={{ color: tokens.color.error, marginTop: tokens.spacing.xs }}>{error}</Text>
      )}

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: tokens.spacing.md,
          marginTop: tokens.spacing.lg,
        }}
      >
        {players.map((player) => (
          <View key={player.id}>
            <PlayerScoreCard
              name={player.name}
              score={player.score}
              isWinner={player.id === winnerId}
              onIncrement={() => incrementScore(player.id)}
              onDecrement={() => decrementScore(player.id)}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Remover ${player.name}`}
              onPress={() => removePlayer(player.id)}
              style={{ alignSelf: 'center', marginTop: tokens.spacing.xs }}
            >
              <Text style={{ color: tokens.color.error, fontSize: tokens.fontSize.sm }}>
                Remover
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      {winnerId && (
        <View style={{ alignItems: 'center', marginTop: tokens.spacing.xl }}>
          <Text
            accessibilityRole="header"
            style={{ color: tokens.color.gold, fontSize: tokens.fontSize.xxl, fontWeight: 'bold' }}
          >
            🏆 {players.find((p) => p.id === winnerId)?.name} venceu!
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Nova partida"
            onPress={reset}
            style={{
              backgroundColor: tokens.color.accent,
              borderRadius: tokens.borderRadius.md,
              padding: tokens.spacing.md,
              marginTop: tokens.spacing.md,
            }}
          >
            <Text style={{ color: tokens.color.text }}>Nova Partida</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}
