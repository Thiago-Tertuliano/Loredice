import { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../src/lib/theme';
import { useCollectionStore } from '../../../src/stores/useCollectionStore';
import { listarJogos } from '../../../src/services/collection';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import type { Game } from '../../../src/stores/useCollectionStore';

const SCREEN_WIDTH = Dimensions.get('window').width;
const COLUMNS = 2;
const GAP = 12;
const PADDING = 16;
const CELL_SIZE = (SCREEN_WIDTH - PADDING * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

export default function GalleryScreen() {
  const { tokens } = useTheme();
  const { games, setGames } = useCollectionStore();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listarJogos();
    if (result.success) setGames(result.data as unknown as Game[]);
    setLoading(false);
  }, [setGames]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: Game & { imagemUri?: string | null };
    index: number;
  }) => {
    const isRightColumn = index % COLUMNS === 1;
    // Gera cor placeholder baseada no título
    const hue = (item.titulo.charCodeAt(0) * 37 + item.titulo.length * 13) % 360;
    const placeholderBg = `hsl(${hue}, 40%, 18%)`;

    return (
      <TouchableOpacity
        style={[styles.cell, isRightColumn && { marginLeft: GAP }]}
        activeOpacity={0.85}
        onPress={() => router.push(`/(tabs)/collection/${item.id}`)}
      >
        {item.imagemUri ? (
          <Image
            source={{ uri: item.imagemUri }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: placeholderBg }]}>
            <View style={styles.placeholderIconWrapper}>
              <MaterialIcons name="casino" size={32} color="rgba(200, 155, 255, 0.3)" />
            </View>
          </View>
        )}

        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(10, 8, 23, 0.9)']}
          style={StyleSheet.absoluteFill}
          locations={[0.45, 1]}
        />

        {/* Game title at bottom */}
        <View style={styles.cellFooter}>
          {item.favorito && (
            <MaterialIcons
              name="star"
              size={12}
              color={tokens.color.secondary}
              style={styles.starIcon}
            />
          )}
          <Text style={[styles.cellTitle, { fontFamily: 'Poppins_600SemiBold' }]} numberOfLines={2}>
            {item.titulo}
          </Text>
        </View>

        {/* No-photo badge */}
        {!item.imagemUri && (
          <View style={styles.noPhotoBadge}>
            <MaterialIcons name="add-photo-alternate" size={14} color={tokens.color.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const gamesWithPhoto = games.filter(
    (g: Game & { imagemUri?: string | null }) => g.imagemUri,
  ).length;

  return (
    <View style={styles.container}>
      <AppHeader title="Galeria" showBack />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={tokens.color.primary} />
        </View>
      ) : (
        <FlatList
          data={games as (Game & { imagemUri?: string | null })[]}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          numColumns={COLUMNS}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <MaterialIcons name="photo-library" size={14} color={tokens.color.primary} />
                <Text
                  style={[
                    tokens.typography.labelMd,
                    { color: tokens.color.primary, marginLeft: 6 },
                  ]}
                >
                  {gamesWithPhoto} com foto
                </Text>
              </View>
              <View style={styles.statPill}>
                <MaterialIcons name="grid-view" size={14} color={tokens.color.onSurfaceVariant} />
                <Text
                  style={[
                    tokens.typography.labelMd,
                    { color: tokens.color.onSurfaceVariant, marginLeft: 6 },
                  ]}
                >
                  {games.length} jogos
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="photo-library" size={56} color={tokens.color.outlineVariant} />
              <Text
                style={[
                  tokens.typography.headlineMd,
                  { color: tokens.color.onSurface, marginTop: 16, textAlign: 'center' },
                ]}
              >
                Nenhum jogo na coleção
              </Text>
              <Text
                style={[
                  tokens.typography.bodyMd,
                  { color: tokens.color.onSurfaceVariant, marginTop: 8, textAlign: 'center' },
                ]}
              >
                Adicione jogos para vê-los aqui em grid.
              </Text>
            </View>
          }
          columnWrapperStyle={styles.row}
        />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: PADDING,
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 26, 41, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(61, 52, 80, 0.8)',
  },
  row: {
    marginBottom: GAP,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE * 1.1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#1e1c2d',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(200, 155, 255, 0.1)',
  },
  placeholderIconWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  starIcon: {
    marginBottom: 2,
  },
  cellTitle: {
    fontSize: 12,
    lineHeight: 16,
    color: '#ede8ff',
  },
  noPhotoBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(10, 8, 23, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200, 155, 255, 0.25)',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
});
