import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../../src/lib/theme';
import { router, useFocusEffect } from 'expo-router';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { GlassCard } from '../../../src/components/ui/GlassCard';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { listarHistorico } from '../../../src/services/history';
import type { MatchWithWinner } from '../../../src/services/history';

export default function Home() {
  const { tokens } = useTheme();
  const [recentMatches, setRecentMatches] = useState<MatchWithWinner[]>([]);

  useFocusEffect(
    useCallback(() => {
      listarHistorico().then((result) => {
        if (result.success) {
          // Mostrar só as 3 mais recentes
          setRecentMatches(result.data.slice(-3).reverse());
        }
      });
    }, []),
  );

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="LoreDice" showMenu showAccount />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <View style={styles.section}>
          <GlassCard style={styles.heroBanner} neonGlow glowColor="purple">
            <LinearGradient
              colors={['#2d1040', '#1a1432']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.heroContent}>
              <View>
                <Text
                  style={[
                    tokens.typography.labelMd,
                    { color: tokens.color.primary, letterSpacing: 2 },
                  ]}
                >
                  BEM-VINDO
                </Text>
                <Text
                  style={[
                    tokens.typography.headlineLgMobile,
                    { color: tokens.color.onSurface, marginTop: 4 },
                  ]}
                >
                  Gerencie suas{'\n'}partidas com estilo
                </Text>
                <Text
                  style={[
                    tokens.typography.bodyMd,
                    { color: tokens.color.onSurfaceVariant, marginTop: 8 },
                  ]}
                >
                  Placar, coleção e campanhas em um só lugar.
                </Text>
              </View>
              <View style={styles.heroDice}>
                <Text style={styles.diceEmoji}>🎲</Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Placares Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[tokens.typography.headlineMd, { color: tokens.color.onSurface }]}>
              Placares
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/scoreboards/history')}>
              <Text style={[tokens.typography.labelMd, { color: tokens.color.primary }]}>
                Histórico →
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bentoGrid}>
            <TouchableOpacity
              style={[styles.gridItem, { paddingRight: 6 }]}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/scoreboards/truco')}
            >
              <GlassCard variant="panel" style={styles.scoreCard}>
                <LinearGradient
                  colors={['rgba(232, 165, 0, 0.12)', 'transparent']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: tokens.color.secondaryContainer + '30' },
                  ]}
                >
                  <MaterialIcons name="style" size={26} color={tokens.color.secondary} />
                </View>
                <Text
                  style={[
                    tokens.typography.headlineMd,
                    { color: tokens.color.onSurface, marginTop: 14 },
                  ]}
                >
                  Truco
                </Text>
                <Text
                  style={[
                    tokens.typography.labelMd,
                    { color: tokens.color.onSurfaceVariant, marginTop: 2 },
                  ]}
                >
                  12 Pontos
                </Text>
                <View style={styles.playButton}>
                  <MaterialIcons name="play-arrow" size={16} color={tokens.color.secondary} />
                </View>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.gridItem, { paddingLeft: 6 }]}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/scoreboards/universal')}
            >
              <GlassCard variant="panel" style={styles.scoreCard}>
                <LinearGradient
                  colors={['rgba(200, 155, 255, 0.12)', 'transparent']}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: tokens.color.primaryContainer + '30' },
                  ]}
                >
                  <MaterialIcons name="calculate" size={26} color={tokens.color.primary} />
                </View>
                <Text
                  style={[
                    tokens.typography.headlineMd,
                    { color: tokens.color.onSurface, marginTop: 14 },
                  ]}
                >
                  Universal
                </Text>
                <Text
                  style={[
                    tokens.typography.labelMd,
                    { color: tokens.color.onSurfaceVariant, marginTop: 2 },
                  ]}
                >
                  N Jogadores
                </Text>
                <View style={styles.playButton}>
                  <MaterialIcons name="play-arrow" size={16} color={tokens.color.primary} />
                </View>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </View>

        {/* Atividade Recente */}
        <View style={styles.section}>
          <Text style={[tokens.typography.labelMd, styles.sectionLabel]}>ATIVIDADE RECENTE</Text>

          {recentMatches.length === 0 ? (
            <GlassCard style={styles.emptyRecent}>
              <MaterialIcons
                name="history"
                size={32}
                color={tokens.color.outlineVariant}
                style={{ marginBottom: 8 }}
              />
              <Text
                style={[
                  tokens.typography.bodyMd,
                  { color: tokens.color.onSurfaceVariant, textAlign: 'center' },
                ]}
              >
                Nenhuma partida ainda.{'\n'}Comece a jogar!
              </Text>
            </GlassCard>
          ) : (
            recentMatches.map((match) => (
              <GlassCard key={match.id} style={styles.recentCard}>
                <View style={styles.recentIconWrapper}>
                  <MaterialIcons
                    name={match.tipoJogo === 'truco' ? 'style' : 'calculate'}
                    size={20}
                    color={tokens.color.primary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[tokens.typography.bodyLg, { color: tokens.color.onSurface }]}>
                    {match.tipoJogo === 'truco' ? 'Truco' : 'Contador Universal'}
                  </Text>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}
                  >
                    <Text
                      style={[tokens.typography.bodyMd, { color: tokens.color.onSurfaceVariant }]}
                    >
                      {formatDate(match.data)}
                    </Text>
                    {match.vencedorNome && (
                      <View style={styles.winnerTag}>
                        <MaterialIcons
                          name="emoji-events"
                          size={12}
                          color={tokens.color.secondary}
                        />
                        <Text
                          style={[
                            tokens.typography.labelMd,
                            { color: tokens.color.secondary, marginLeft: 4, fontSize: 11 },
                          ]}
                        >
                          {match.vencedorNome}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={tokens.color.outlineVariant} />
              </GlassCard>
            ))
          )}
        </View>

        {/* Quick Nav */}
        <View style={styles.section}>
          <Text style={[tokens.typography.labelMd, styles.sectionLabel]}>ACESSO RÁPIDO</Text>
          <View style={styles.quickNav}>
            <TouchableOpacity
              style={styles.quickNavItem}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/collection')}
            >
              <GlassCard variant="panel" style={styles.quickNavCard}>
                <MaterialIcons name="library-books" size={24} color={tokens.color.tertiary} />
                <Text
                  style={[
                    tokens.typography.labelMd,
                    { color: tokens.color.onSurface, marginTop: 8 },
                  ]}
                >
                  Coleção
                </Text>
              </GlassCard>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickNavItem}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/campaigns')}
            >
              <GlassCard variant="panel" style={styles.quickNavCard}>
                <MaterialIcons name="auto-awesome" size={24} color={tokens.color.primary} />
                <Text
                  style={[
                    tokens.typography.labelMd,
                    { color: tokens.color.onSurface, marginTop: 8 },
                  ]}
                >
                  Campanhas
                </Text>
              </GlassCard>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickNavItem}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/wishlist')}
            >
              <GlassCard variant="panel" style={styles.quickNavCard}>
                <MaterialIcons name="favorite" size={24} color={tokens.color.error} />
                <Text
                  style={[
                    tokens.typography.labelMd,
                    { color: tokens.color.onSurface, marginTop: 8 },
                  ]}
                >
                  Desejos
                </Text>
              </GlassCard>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0D1A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 28,
  },
  sectionLabel: {
    color: '#7a6e8a',
    marginBottom: 12,
    letterSpacing: 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroBanner: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(200, 155, 255, 0.25)',
    padding: 0,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  heroDice: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceEmoji: {
    fontSize: 52,
  },
  bentoGrid: {
    flexDirection: 'row',
  },
  gridItem: {
    flex: 1,
  },
  scoreCard: {
    padding: 20,
    height: 168,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 8,
  },
  recentIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(200, 155, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  winnerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(232, 165, 0, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  emptyRecent: {
    padding: 32,
    alignItems: 'center',
  },
  quickNav: {
    flexDirection: 'row',
    gap: 10,
  },
  quickNavItem: {
    flex: 1,
  },
  quickNavCard: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
