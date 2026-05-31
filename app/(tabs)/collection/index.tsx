import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
} from 'react-native';
import { useTheme } from '../../../src/lib/theme';
import { useCollectionStore, Game } from '../../../src/stores/useCollectionStore';
import { listarJogos } from '../../../src/services/collection';
import { router, useFocusEffect } from 'expo-router';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { GlassCard } from '../../../src/components/ui/GlassCard';
import { MaterialIcons } from '@expo/vector-icons';
import { CategoryBadge } from '../../../src/components/ui/CategoryBadge';
import { LinearGradient } from 'expo-linear-gradient';

type GameWithExtras = Game & {
  categorias?: { id: number; nome: string; cor: string | null }[];
  imagemUri?: string | null;
};

export default function CollectionScreen() {
  const { tokens } = useTheme();
  const { games, setGames } = useCollectionStore();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const result = await listarJogos();
    if (result.success) setGames(result.data as unknown as Game[]);
    setLoading(false);
  }, [setGames]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const renderItem = ({ item }: { item: GameWithExtras }) => {
    // Gera cor placeholder única por jogo
    const hue = (item.titulo.charCodeAt(0) * 37 + item.titulo.length * 13) % 360;
    const placeholderBg = `hsl(${hue}, 40%, 16%)`;

    return (
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={() => router.push(`/(tabs)/collection/${item.id}`)}
        style={{ marginBottom: 16 }}
      >
        <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
          {/* Cover Image */}
          <View style={styles.coverImage}>
            {item.imagemUri ? (
              <Image
                source={{ uri: item.imagemUri }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: placeholderBg }]}>
                <View style={styles.placeholderIconWrapper}>
                  <MaterialIcons name="casino" size={36} color="rgba(200,155,255,0.2)" />
                </View>
              </View>
            )}
            {/* Gradient on image */}
            <LinearGradient
              colors={['transparent', 'rgba(14, 12, 27, 0.7)']}
              style={StyleSheet.absoluteFill}
              locations={[0.4, 1]}
            />
            {item.favorito && (
              <View style={styles.favoriteBadge}>
                <MaterialIcons name="star" size={16} color={tokens.color.onSecondary} />
              </View>
            )}
          </View>

          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={[tokens.typography.headlineMd, { color: tokens.color.primary }]}>
                  {item.titulo}
                </Text>
                {item.editora && (
                  <Text
                    style={[
                      tokens.typography.labelMd,
                      { color: tokens.color.onSurfaceVariant, marginTop: 1 },
                    ]}
                  >
                    {item.editora.toUpperCase()}
                  </Text>
                )}
              </View>

              {item.avaliacaoPessoal != null && item.avaliacaoPessoal > 0 && (
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={14} color={tokens.color.secondary} />
                  <Text
                    style={[
                      tokens.typography.labelMd,
                      { color: tokens.color.secondary, marginLeft: 3 },
                    ]}
                  >
                    {item.avaliacaoPessoal}.0
                  </Text>
                </View>
              )}
            </View>

            {item.categorias && item.categorias.length > 0 && (
              <View style={styles.categoriesRow}>
                {item.categorias.map((cat) => (
                  <CategoryBadge key={cat.id} nome={cat.nome} cor={cat.cor} />
                ))}
              </View>
            )}

            {/* Info pills */}
            {(item.qtdJogadoresMin || item.tempoMedio) && (
              <View style={styles.infoPills}>
                {(item.qtdJogadoresMin || item.qtdJogadoresMax) && (
                  <View style={styles.infoPill}>
                    <MaterialIcons name="group" size={12} color={tokens.color.onSurfaceVariant} />
                    <Text
                      style={[
                        tokens.typography.labelSm,
                        { color: tokens.color.onSurfaceVariant, marginLeft: 4 },
                      ]}
                    >
                      {item.qtdJogadoresMin ?? '?'}–{item.qtdJogadoresMax ?? '?'} jog.
                    </Text>
                  </View>
                )}
                {item.tempoMedio && (
                  <View style={styles.infoPill}>
                    <MaterialIcons name="timer" size={12} color={tokens.color.onSurfaceVariant} />
                    <Text
                      style={[
                        tokens.typography.labelSm,
                        { color: tokens.color.onSurfaceVariant, marginLeft: 4 },
                      ]}
                    >
                      {item.tempoMedio} min
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <GlassCard style={styles.emptyCard}>
        <View style={styles.dashedBorder}>
          <MaterialIcons
            name="inventory-2"
            size={48}
            color={tokens.color.outlineVariant}
            style={{ marginBottom: 16 }}
          />
          <Text
            style={[
              tokens.typography.headlineMd,
              { color: tokens.color.onSurface, textAlign: 'center' },
            ]}
          >
            Sua coleção está vazia
          </Text>
          <Text
            style={[
              tokens.typography.bodyMd,
              { color: tokens.color.onSurfaceVariant, textAlign: 'center', marginTop: 8 },
            ]}
          >
            Comece a catalogar seus jogos para acompanhar seu acervo.
          </Text>
        </View>
      </GlassCard>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        title="Minha Coleção"
        showMenu
        showAccount
        rightAction={{
          icon: 'grid-view',
          onPress: () => router.push('/(tabs)/collection/gallery'),
        }}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={tokens.color.primary} />
        </View>
      ) : (
        <>
          <FlatList
            data={games as GameWithExtras[]}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            ListHeaderComponent={
              games.length > 0 ? (
                <Text
                  style={[
                    tokens.typography.labelMd,
                    { color: tokens.color.onSurfaceVariant, marginBottom: 16 },
                  ]}
                >
                  {games.length} {games.length === 1 ? 'JOGO REGISTRADO' : 'JOGOS REGISTRADOS'}
                </Text>
              ) : null
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <TouchableOpacity
            style={[styles.fab, tokens.shadow.neonGlowPurple]}
            onPress={() => router.push('/(tabs)/collection/new')}
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#a855f7', '#7c3aed']} style={StyleSheet.absoluteFill} />
            <MaterialIcons name="add" size={32} color="#f5e8ff" />
          </TouchableOpacity>
        </>
      )}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 110,
  },
  coverImage: {
    width: '100%',
    height: 156,
    position: 'relative',
  },
  placeholderIconWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#e8a500',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e8a500',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  cardContent: {
    padding: 14,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 165, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  infoPills: {
    flexDirection: 'row',
    gap: 8,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(61, 52, 80, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 96,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  emptyContainer: {
    marginTop: 40,
  },
  emptyCard: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  dashedBorder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3d3450',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
  },
});
