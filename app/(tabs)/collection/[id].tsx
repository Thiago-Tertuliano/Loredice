import { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../../src/lib/theme';
import { StarRating } from '../../../src/components/ui/StarRating';
import { ConservationBadge } from '../../../src/components/ui/ConservationBadge';
import { CategoryBadge } from '../../../src/components/ui/CategoryBadge';
import { ConfirmDialog } from '../../../src/components/ui/ConfirmDialog';
import { GlassCard } from '../../../src/components/ui/GlassCard';
import { NeonButton } from '../../../src/components/ui/NeonButton';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { obterJogo, deletarJogo } from '../../../src/services/collection';
import { listarCategoriasDoJogo } from '../../../src/services/categorias';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
  imagem_uri: string | null;
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color={tokens.color.primary} />
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.center}>
        <Text style={[tokens.typography.headlineMd, { color: tokens.color.onSurfaceVariant }]}>
          Jogo não encontrado
        </Text>
        <NeonButton
          label="Voltar"
          variant="ghost"
          onPress={() => router.back()}
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  // Placeholder color único por jogo
  const hue = (game.titulo.charCodeAt(0) * 37 + game.titulo.length * 13) % 360;
  const placeholderBg = `hsl(${hue}, 40%, 14%)`;

  return (
    <View style={styles.container}>
      <AppHeader
        title=""
        showBack
        transparent
        rightAction={{
          icon: 'edit',
          label: 'Editar',
          onPress: () => router.push(`/(tabs)/collection/edit/${jogoId}`),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image — real photo or placeholder */}
        <View style={[styles.heroImage, !game.imagem_uri && { backgroundColor: placeholderBg }]}>
          {game.imagem_uri && (
            <Image
              source={{ uri: game.imagem_uri }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          )}
          <LinearGradient
            colors={['transparent', '#0F0D1A']}
            style={StyleSheet.absoluteFill}
            locations={[0.45, 1]}
          />
          {!game.imagem_uri && (
            <View style={styles.placeholderIcon}>
              <MaterialIcons name="casino" size={48} color="rgba(200, 155, 255, 0.15)" />
            </View>
          )}
        </View>

        {/* Title area */}
        <View style={styles.headerInfo}>
          {game.editora && (
            <Text style={[tokens.typography.labelMd, styles.editora]}>
              {game.editora.toUpperCase()}
            </Text>
          )}
          <Text style={[tokens.typography.displayLg, { color: tokens.color.primary }]}>
            {game.titulo}
          </Text>
        </View>

        {/* Info Tags */}
        <View style={styles.tagsContainer}>
          {(game.qtd_jogadores_min != null || game.qtd_jogadores_max != null) && (
            <View style={styles.infoPill}>
              <MaterialIcons
                name="group"
                size={14}
                color={tokens.color.onSurfaceVariant}
                style={{ marginRight: 4 }}
              />
              <Text style={[tokens.typography.labelMd, { color: tokens.color.onSurfaceVariant }]}>
                {game.qtd_jogadores_min ?? '?'}–{game.qtd_jogadores_max ?? '?'} jog.
              </Text>
            </View>
          )}
          {game.tempo_medio != null && (
            <View style={styles.infoPill}>
              <MaterialIcons
                name="timer"
                size={14}
                color={tokens.color.onSurfaceVariant}
                style={{ marginRight: 4 }}
              />
              <Text style={[tokens.typography.labelMd, { color: tokens.color.onSurfaceVariant }]}>
                {game.tempo_medio} min
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
              style={[
                styles.infoPill,
                {
                  backgroundColor: tokens.color.secondaryContainer + '22',
                  borderColor: tokens.color.secondary + '40',
                },
              ]}
            >
              <MaterialIcons
                name="star"
                size={14}
                color={tokens.color.secondary}
                style={{ marginRight: 4 }}
              />
              <Text style={[tokens.typography.labelMd, { color: tokens.color.secondary }]}>
                Favorito
              </Text>
            </View>
          )}
        </View>

        {categorias.length > 0 && (
          <View style={styles.categoriesContainer}>
            {categorias.map((cat) => (
              <CategoryBadge key={cat.id} nome={cat.nome} cor={cat.cor} />
            ))}
          </View>
        )}

        {/* Avaliação */}
        <GlassCard variant="panel" style={styles.ratingCard}>
          <Text
            style={[tokens.typography.labelMd, { color: tokens.color.primary, marginBottom: 12 }]}
          >
            SUA AVALIAÇÃO
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <StarRating value={game.avaliacao_pessoal ?? 0} readonly />
            {game.avaliacao_pessoal != null && game.avaliacao_pessoal > 0 && (
              <Text
                style={[
                  tokens.typography.headlineMd,
                  { color: tokens.color.secondary, marginLeft: 16 },
                ]}
              >
                {game.avaliacao_pessoal}.0
              </Text>
            )}
          </View>
        </GlassCard>

        {/* Resenha */}
        {game.resenha && (
          <GlassCard style={styles.reviewCard}>
            <Text style={[tokens.typography.labelMd, styles.reviewLabel]}>SOBRE A EXPERIÊNCIA</Text>
            <Text style={[tokens.typography.bodyLg, { color: tokens.color.onSurface }]}>
              {game.resenha}
            </Text>
          </GlassCard>
        )}

        {/* Delete */}
        <View style={styles.footer}>
          <NeonButton
            label={deleting ? 'Excluindo...' : 'Excluir Jogo'}
            icon="delete"
            variant="danger"
            fullWidth
            onPress={() => setShowDeleteConfirm(true)}
            disabled={deleting}
          />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Excluir Jogo"
        message={`Tem certeza que deseja excluir "${game.titulo}"? Esta ação não pode ser desfeita e todas as partidas vinculadas perderão a referência do jogo.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0D1A',
  },
  center: {
    flex: 1,
    backgroundColor: '#0F0D1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 48,
  },
  heroImage: {
    width: '100%',
    height: 260,
    marginTop: -64, // pull up under transparent header
    zIndex: -1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    paddingHorizontal: 16,
    marginTop: -40,
  },
  editora: {
    color: '#7a6e8a',
    letterSpacing: 2,
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1829',
    borderWidth: 1,
    borderColor: '#3d3450',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  ratingCard: {
    marginHorizontal: 16,
    marginTop: 28,
    padding: 20,
  },
  reviewCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 24,
  },
  reviewLabel: {
    color: '#8b3fcc',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 16,
    marginTop: 40,
    marginBottom: 16,
  },
});
