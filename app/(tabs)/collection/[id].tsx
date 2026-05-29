import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../src/lib/theme';
import { StarRating } from '../../../src/components/ui/StarRating';
import { ConservationBadge } from '../../../src/components/ui/ConservationBadge';
import { CategoryBadge } from '../../../src/components/ui/CategoryBadge';
import { ConfirmDialog } from '../../../src/components/ui/ConfirmDialog';
import { obterJogo, deletarJogo } from '../../../src/services/collection';
import { listarCategoriasDoJogo } from '../../../src/services/categorias';
import { router, useLocalSearchParams } from 'expo-router';

interface GameView {
  titulo: string;
  editora: string | null;
  qtd_jogadores_min: number | null;
  qtd_jogadores_max: number | null;
  tempo_medio: number | null;
  estadoConservacao: string | null;
  avaliacao_pessoal: number | null;
  resenha: string | null;
  favorito: boolean | null;
}

export default function GameDetailScreen() {
  const { tokens } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const jogoId = Number(id);

  const [game, setGame] = useState<GameView | null>(null);
  const [categorias, setCategorias] = useState<{ id: number; nome: string; cor: string | null }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    Promise.all([obterJogo(jogoId), listarCategoriasDoJogo(jogoId)]).then(
      ([gameResult, catResult]) => {
        if (gameResult.success) setGame(gameResult.data as unknown as GameView);
        if (catResult.success)
          setCategorias(catResult.data as { id: number; nome: string; cor: string | null }[]);
        setLoading(false);
      },
    );
  }, [jogoId]);

  async function handleDelete() {
    setDeleting(true);
    const result = await deletarJogo(jogoId);
    setDeleting(false);
    if (result.success) {
      router.back();
    }
  }

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
        <ActivityIndicator size="large" color={tokens.color.accent} />
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
        <Pressable accessibilityRole="button" onPress={() => router.back()}>
          <Text style={{ color: tokens.color.accent, marginTop: tokens.spacing.md }}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: tokens.color.background }}>
      <View style={{ padding: tokens.spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
          >
            <Text style={{ color: tokens.color.accent }}>← Voltar</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Editar jogo"
            onPress={() => router.push(`/(tabs)/collection/edit/${jogoId}`)}
          >
            <Text style={{ color: tokens.color.accent }}>Editar</Text>
          </Pressable>
        </View>

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

        {game.editora && (
          <Text style={{ color: tokens.color.textMuted, marginTop: tokens.spacing.xs }}>
            {game.editora}
          </Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: tokens.spacing.sm,
            marginTop: tokens.spacing.md,
          }}
        >
          {(game.qtd_jogadores_min != null || game.qtd_jogadores_max != null) && (
            <View
              style={{
                backgroundColor: tokens.color.surface,
                borderRadius: tokens.borderRadius.sm,
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: tokens.spacing.xs,
              }}
            >
              <Text style={{ color: tokens.color.textMuted, fontSize: tokens.fontSize.sm }}>
                {'👥'} {game.qtd_jogadores_min ?? '?'}–{game.qtd_jogadores_max ?? '?'} jogadores
              </Text>
            </View>
          )}
          {game.tempo_medio != null && (
            <View
              style={{
                backgroundColor: tokens.color.surface,
                borderRadius: tokens.borderRadius.sm,
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: tokens.spacing.xs,
              }}
            >
              <Text style={{ color: tokens.color.textMuted, fontSize: tokens.fontSize.sm }}>
                {'⏱'} {game.tempo_medio} min
              </Text>
            </View>
          )}
          {game.estadoConservacao && (
            <ConservationBadge
              estado={
                game.estadoConservacao as 'novo' | 'como_novo' | 'desgastado' | 'faltando_pecas'
              }
            />
          )}
          {game.favorito && (
            <View
              style={{
                backgroundColor: tokens.color.gold + '20',
                borderRadius: tokens.borderRadius.sm,
                paddingHorizontal: tokens.spacing.sm,
                paddingVertical: tokens.spacing.xs,
              }}
            >
              <Text
                style={{
                  color: tokens.color.gold,
                  fontSize: tokens.fontSize.sm,
                  fontWeight: 'bold',
                }}
              >
                {'⭐'} Favorito
              </Text>
            </View>
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

        {game.resenha && (
          <Text
            style={{ color: tokens.color.textMuted, marginTop: tokens.spacing.lg, lineHeight: 22 }}
          >
            {game.resenha}
          </Text>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Excluir jogo"
          onPress={() => setShowDeleteConfirm(true)}
          disabled={deleting}
          style={{ marginTop: tokens.spacing.xl }}
        >
          <Text style={{ color: tokens.color.error }}>
            {deleting ? 'Excluindo...' : 'Excluir Jogo'}
          </Text>
        </Pressable>

        <ConfirmDialog
          visible={showDeleteConfirm}
          title="Excluir Jogo"
          message={`Tem certeza que deseja excluir "${game.titulo}"? Esta ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          destructive
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </View>
    </ScrollView>
  );
}
