import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '../../src/lib/theme';
import { AppHeader } from '../../src/components/ui/AppHeader';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { UserAvatar } from '../../src/components/ui/UserAvatar';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserProfileStore } from '../../src/stores/useUserProfileStore';
import { useState } from 'react';

const AVATAR_COLORS = [
  '#8b3fcc',
  '#6366f1',
  '#0891b2',
  '#059669',
  '#dc2626',
  '#ea580c',
  '#ca8a04',
  '#db2777',
];

export default function SettingsScreen() {
  const { tokens } = useTheme();
  const { profile, setName, setAvatarColor } = useUserProfileStore();
  const [editingName, setEditingName] = useState(profile.name);

  const handleSaveName = () => {
    setName(editingName);
    Alert.alert('Salvo!', 'Nome do perfil atualizado.');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Configurações" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <GlassCard variant="panel" style={styles.card}>
          <View style={styles.profileHeader}>
            <UserAvatar size={72} />
            <View style={styles.profileInfo}>
              <Text style={[tokens.typography.headlineMd, { color: tokens.color.onSurface }]}>
                {profile.name}
              </Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: '#64748b' }]} />
                <Text style={[tokens.typography.bodyMd, { color: tokens.color.onSurfaceVariant }]}>
                  Modo Offline
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Edit Name */}
        <GlassCard variant="panel" style={styles.card}>
          <Text
            style={[
              tokens.typography.labelMd,
              { color: tokens.color.onSurfaceVariant, marginBottom: 12 },
            ]}
          >
            NOME DO PERFIL
          </Text>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                value={editingName}
                onChangeText={setEditingName}
                style={[
                  styles.textInput,
                  { fontFamily: 'Poppins_400Regular', color: tokens.color.onSurface },
                ]}
                placeholderTextColor={tokens.color.onSurfaceVariant}
                placeholder="Seu nome de jogador"
                maxLength={24}
              />
            </View>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveName} activeOpacity={0.75}>
              <MaterialIcons name="check" size={20} color={tokens.color.onPrimaryContainer} />
            </TouchableOpacity>
          </View>
        </GlassCard>

        {/* Avatar Color */}
        <GlassCard variant="panel" style={styles.card}>
          <Text
            style={[
              tokens.typography.labelMd,
              { color: tokens.color.onSurfaceVariant, marginBottom: 16 },
            ]}
          >
            COR DO AVATAR
          </Text>
          <View style={styles.colorGrid}>
            {AVATAR_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  profile.avatarColor === color && styles.colorCircleActive,
                ]}
                onPress={() => setAvatarColor(color)}
                activeOpacity={0.8}
              >
                {profile.avatarColor === color && (
                  <MaterialIcons name="check" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Future Features */}
        <GlassCard variant="panel" style={styles.card}>
          <Text
            style={[
              tokens.typography.labelMd,
              { color: tokens.color.onSurfaceVariant, marginBottom: 16 },
            ]}
          >
            EM BREVE
          </Text>
          {[
            { icon: 'cloud-sync', label: 'Sincronização na Nuvem', desc: 'Backup dos seus dados' },
            { icon: 'group', label: 'Perfis Múltiplos', desc: 'Gerencie jogadores da família' },
            { icon: 'notifications', label: 'Notificações', desc: 'Lembretes de sessão' },
          ].map((f, i) => (
            <View key={i} style={[styles.featureRow, i < 2 && { marginBottom: 16 }]}>
              <View style={[styles.featureIcon, { backgroundColor: 'rgba(200, 155, 255, 0.1)' }]}>
                <MaterialIcons
                  name={f.icon as keyof typeof MaterialIcons.glyphMap}
                  size={18}
                  color={tokens.color.primary}
                />
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
              <View style={styles.comingSoonBadge}>
                <Text
                  style={[
                    tokens.typography.labelSm ?? tokens.typography.labelMd,
                    { color: tokens.color.primary, fontSize: 10 },
                  ]}
                >
                  Em breve
                </Text>
              </View>
            </View>
          ))}
        </GlassCard>
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
    paddingBottom: 48,
  },
  card: {
    padding: 20,
    marginBottom: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: 'rgba(26, 24, 41, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(200, 155, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  textInput: {
    fontSize: 16,
  },
  saveBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#8b3fcc',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b3fcc',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleActive: {
    borderColor: 'rgba(255, 255, 255, 0.6)',
    transform: [{ scale: 1.1 }],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(200, 155, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(200, 155, 255, 0.2)',
  },
});
