import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../src/lib/theme';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { GlassCard } from '../../../src/components/ui/GlassCard';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const WISHLIST_FEATURES = [
  { icon: 'bookmark-add' as const, label: 'Lista de Desejos', desc: 'Jogos que você quer ter' },
  { icon: 'price-check' as const, label: 'Controle de Preços', desc: 'Acompanhe promoções' },
  { icon: 'share' as const, label: 'Compartilhar Lista', desc: 'Envie para seus amigos' },
];

export default function WishlistScreen() {
  const { tokens } = useTheme();

  return (
    <View style={styles.container}>
      <AppHeader title="Desejos" showMenu showAccount />

      <View style={styles.center}>
        <GlassCard neonGlow glowColor="gold" style={styles.mainCard}>
          <LinearGradient
            colors={['rgba(232, 165, 0, 0.12)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />

          <View style={styles.iconWrapper}>
            <MaterialIcons name="favorite" size={40} color={tokens.color.secondary} />
          </View>

          <Text
            style={[
              tokens.typography.headlineMd,
              { color: tokens.color.onSurface, textAlign: 'center', marginTop: 16 },
            ]}
          >
            Em Desenvolvimento
          </Text>
          <Text
            style={[
              tokens.typography.bodyMd,
              {
                color: tokens.color.onSurfaceVariant,
                textAlign: 'center',
                marginTop: 8,
                lineHeight: 20,
              },
            ]}
          >
            Sua lista de desejos está chegando. Nunca mais esqueça os jogos que você quer!
          </Text>

          <View style={styles.divider} />

          {WISHLIST_FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <MaterialIcons name={f.icon} size={18} color={tokens.color.secondary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[tokens.typography.labelMd, { color: tokens.color.onSurface }]}>
                  {f.label}
                </Text>
                <Text
                  style={[
                    tokens.typography.bodyMd,
                    { color: tokens.color.onSurfaceVariant, fontSize: 12 },
                  ]}
                >
                  {f.desc}
                </Text>
              </View>
              <MaterialIcons name="schedule" size={14} color={tokens.color.outlineVariant} />
            </View>
          ))}
        </GlassCard>
      </View>
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
    padding: 20,
  },
  mainCard: {
    width: '100%',
    padding: 28,
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(232, 165, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(232, 165, 0, 0.25)',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(232, 165, 0, 0.12)',
    marginVertical: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
    width: '100%',
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(232, 165, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
