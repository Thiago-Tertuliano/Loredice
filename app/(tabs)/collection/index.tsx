import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../src/lib/theme';
import { useCollectionStore, Game } from '../../../src/stores/useCollectionStore';
import { listarJogos } from '../../../src/services/collection';
import { router } from 'expo-router';

export default function CollectionScreen() {
  const { tokens } = useTheme();
  const { games, setGames } = useCollectionStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await listarJogos();
      if (result.success) setGames(result.data as unknown as Game[]);
      setLoading(false);
    }
    load();
  }, [setGames]);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.color.background, padding: tokens.spacing.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text
          style={{ color: tokens.color.text, fontSize: tokens.fontSize.xl, fontWeight: 'bold' }}
        >
          Coleção
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar novo jogo"
          onPress={() => router.push('/(tabs)/collection/new')}
        >
          <Text style={{ color: tokens.color.accent, fontSize: 28 }}>+</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={tokens.color.accent} />
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.titulo}, ${item.avaliacaoPessoal ?? 'sem'} estrelas`}
              onPress={() => router.push(`/(tabs)/collection/${item.id}`)}
              style={{
                backgroundColor: tokens.color.surface,
                borderRadius: tokens.borderRadius.lg,
                padding: tokens.spacing.md,
                marginTop: tokens.spacing.sm,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}
                >
                  <Text
                    style={{
                      color: tokens.color.text,
                      fontSize: tokens.fontSize.md,
                      fontWeight: 'bold',
                    }}
                  >
                    {item.titulo}
                  </Text>
                  {item.favorito && <Text style={{ color: tokens.color.gold }}>⭐</Text>}
                </View>
                {item.editora && (
                  <Text style={{ color: tokens.color.textMuted }}>{item.editora}</Text>
                )}
              </View>
              <Text style={{ color: tokens.color.gold, fontSize: tokens.fontSize.lg }}>
                {'★'.repeat(item.avaliacaoPessoal ?? 0)}
              </Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text
              style={{
                color: tokens.color.textMuted,
                textAlign: 'center',
                marginTop: tokens.spacing.xl,
              }}
            >
              Nenhum jogo na coleção ainda
            </Text>
          }
        />
      )}
    </View>
  );
}
