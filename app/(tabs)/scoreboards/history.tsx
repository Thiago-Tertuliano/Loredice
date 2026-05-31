import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useTheme } from '../../../src/lib/theme';
import { router } from 'expo-router';
import { listarHistorico } from '../../../src/services/history';
import type { MatchWithWinner } from '../../../src/services/history';

export default function HistoryScreen() {
  const { tokens } = useTheme();
  const [matches, setMatches] = useState<MatchWithWinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarHistorico().then((result) => {
      if (result.success) setMatches(result.data);
      setLoading(false);
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: tokens.color.background, padding: tokens.spacing.lg }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text
          style={{ color: tokens.color.text, fontSize: tokens.fontSize.xl, fontWeight: 'bold' }}
        >
          Histórico
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={() => router.back()}
        >
          <Text style={{ color: tokens.color.accent }}>← Voltar</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={tokens.color.accent} />
        </View>
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: tokens.color.surface,
                borderRadius: tokens.borderRadius.lg,
                padding: tokens.spacing.md,
                marginTop: tokens.spacing.sm,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: tokens.color.text, fontWeight: 'bold' }}>
                  {item.tipoJogo}
                </Text>
                {item.duracao != null && (
                  <Text style={{ color: tokens.color.textMuted, fontSize: tokens.fontSize.sm }}>
                    {Math.floor(item.duracao / 60)}min
                  </Text>
                )}
              </View>
              <Text style={{ color: tokens.color.textMuted, fontSize: tokens.fontSize.sm }}>
                {new Date(item.data).toLocaleDateString('pt-BR')}
              </Text>
              {item.vencedorNome && (
                <Text style={{ color: tokens.color.gold, marginTop: tokens.spacing.xs }}>
                  🏆 {item.vencedorNome}
                </Text>
              )}
            </View>
          )}
          ListEmptyComponent={
            <Text
              style={{
                color: tokens.color.textMuted,
                textAlign: 'center',
                marginTop: tokens.spacing.xl,
              }}
            >
              Nenhuma partida registrada ainda
            </Text>
          }
        />
      )}
    </View>
  );
}
