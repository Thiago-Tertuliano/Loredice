import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../src/lib/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { obterJogo } from '../../src/services/collection';
import { listarCategoriasDoJogo } from '../../src/services/categorias';
import { StarRating } from '../../src/components/ui/StarRating';
import { ConservationBadge } from '../../src/components/ui/ConservationBadge';
import { CategoryBadge } from '../../src/components/ui/CategoryBadge';

interface GameView {
  titulo: string;
  editora: string | null;
  qtd_jogadores_min: number | null;
  qtd_jogadores_max: number | null;
  tempo_medio: number | null;
  estadoConservacao: string | null;
  avaliacao_pessoal: number | null;
}

export default function GameModalScreen() {
  const { tokens } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [game, setGame] = useState<GameView | null>(null);
  const [categorias, setCategorias] = useState<{ id: number; nome: string; cor: string | null }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([obterJogo(Number(id)), listarCategoriasDoJogo(Number(id))]).then(
      ([gameResult, catResult]) => {
        if (gameResult.success) setGame(gameResult.data as unknown as GameView);
        if (catResult.success)
          setCategorias(catResult.data as { id: number; nome: string; cor: string | null }[]);
        setLoading(false);
      },
    );
  }, [id]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.color.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: tokens.color.textMuted }}>Carregando...</Text>
      </View>
    );
  }

  if (!game) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: tokens.color.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: tokens.color.textMuted }}>Jogo não encontrado</Text>
        <Pressable accessibilityRole="button" onPress={() => router.dismissAll()}>
          <Text style={{ color: tokens.color.accent, marginTop: tokens.spacing.md }}>Fechar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: tokens.color.background, padding: tokens.spacing.lg }}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.dismissAll()}
        style={{ alignSelf: 'flex-end' }}
      >
        <Text style={{ color: tokens.color.accent, fontSize: tokens.fontSize.lg }}>Fechar</Text>
      </Pressable>

      <Text
        style={{
          color: tokens.color.text,
          fontSize: tokens.fontSize.xxl,
          fontWeight: 'bold',
          marginTop: tokens.spacing.lg,
        }}
      >
        {game.titulo}
      </Text>
      {game.editora && <Text style={{ color: tokens.color.textMuted }}>{game.editora}</Text>}

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: tokens.spacing.sm,
          marginTop: tokens.spacing.md,
        }}
      >
        {(game.qtd_jogadores_min != null || game.qtd_jogadores_max != null) && (
          <Text style={{ color: tokens.color.textMuted, fontSize: tokens.fontSize.sm }}>
            {'👥'} {game.qtd_jogadores_min ?? '?'}–{game.qtd_jogadores_max ?? '?'} jogadores
          </Text>
        )}
        {game.tempo_medio != null && (
          <Text style={{ color: tokens.color.textMuted, fontSize: tokens.fontSize.sm }}>
            {'⏱'} {game.tempo_medio} min
          </Text>
        )}
        {game.estadoConservacao && (
          <ConservationBadge
            estado={
              game.estadoConservacao as 'novo' | 'como_novo' | 'desgastado' | 'faltando_pecas'
            }
          />
        )}
      </View>

      {categorias.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: tokens.spacing.xs,
            marginTop: tokens.spacing.md,
          }}
        >
          {categorias.map((cat) => (
            <CategoryBadge key={cat.id} nome={cat.nome} cor={cat.cor} />
          ))}
        </View>
      )}

      <View style={{ marginTop: tokens.spacing.lg }}>
        <StarRating value={game.avaliacao_pessoal ?? 0} readonly />
      </View>
    </View>
  );
}
