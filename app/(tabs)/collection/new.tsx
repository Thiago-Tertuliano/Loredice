import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../../src/lib/theme';
import { GlassInput } from '../../../src/components/ui/GlassInput';
import { NumberField } from '../../../src/components/ui/NumberField';
import { StarRating } from '../../../src/components/ui/StarRating';
import { EstadoPicker } from '../../../src/components/ui/EstadoPicker';
import { CategorySelector } from '../../../src/components/ui/CategorySelector';
import { NeonButton } from '../../../src/components/ui/NeonButton';
import { AppHeader } from '../../../src/components/ui/AppHeader';
import { GlassCard } from '../../../src/components/ui/GlassCard';
import { GameImagePicker } from '../../../src/components/ui/GameImagePicker';
import { criarJogo } from '../../../src/services/collection';
import { useCollectionStore, Game } from '../../../src/stores/useCollectionStore';
import { router } from 'expo-router';
import type { EstadoConservacao } from '../../../src/services/collection';

export default function NewGameScreen() {
  const { tokens } = useTheme();
  const { addGame } = useCollectionStore();

  const [titulo, setTitulo] = useState('');
  const [editora, setEditora] = useState('');
  const [qtdJogadoresMin, setQtdJogadoresMin] = useState<number | null>(null);
  const [qtdJogadoresMax, setQtdJogadoresMax] = useState<number | null>(null);
  const [tempoMedio, setTempoMedio] = useState<number | null>(null);
  const [estadoConservacao, setEstadoConservacao] = useState<EstadoConservacao | null>(null);
  const [checklistPecas, setChecklistPecas] = useState('');
  const [avaliacao, setAvaliacao] = useState(0);
  const [resenha, setResenha] = useState('');
  const [favorito, setFavorito] = useState(false);
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [categoriaIds, setCategoriaIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!titulo.trim()) {
      setError('Título é obrigatório.');
      return;
    }

    setError(null);
    setSaving(true);
    const result = await criarJogo({
      titulo,
      editora: editora || undefined,
      qtdJogadoresMin: qtdJogadoresMin ?? undefined,
      qtdJogadoresMax: qtdJogadoresMax ?? undefined,
      tempoMedio: tempoMedio ?? undefined,
      estadoConservacao: estadoConservacao ?? undefined,
      checklistPecas: checklistPecas || undefined,
      avaliacaoPessoal: avaliacao || undefined,
      resenha: resenha || undefined,
      favorito,
      imagemUri: imagemUri ?? undefined,
      categoriaIds: categoriaIds.length > 0 ? categoriaIds : undefined,
    });

    setSaving(false);
    if (result.success) {
      addGame(result.data as Game);
      router.back();
    } else {
      setError(typeof result.error === 'string' ? result.error : result.error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader title="Adicionar Jogo" showBack />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Foto de capa */}
        <GlassCard variant="panel" style={styles.formCard}>
          <Text
            style={[
              tokens.typography.labelMd,
              { color: tokens.color.onSurfaceVariant, marginBottom: 12 },
            ]}
          >
            FOTO DO JOGO
          </Text>
          <GameImagePicker value={imagemUri} onChange={setImagemUri} />
        </GlassCard>

        {/* Informações básicas */}
        <GlassCard variant="panel" style={styles.formCard}>
          <GlassInput
            label="TÍTULO DO JOGO"
            placeholder="Ex: Twilight Imperium"
            value={titulo}
            onChangeText={setTitulo}
            icon="casino"
          />

          <GlassInput
            label="EDITORA"
            placeholder="Ex: Galápagos"
            value={editora}
            onChangeText={setEditora}
            icon="business"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <NumberField
                label="MIN. JOGADORES"
                value={qtdJogadoresMin}
                onChange={setQtdJogadoresMin}
                min={1}
                layout="horizontal"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <NumberField
                label="MÁX. JOGADORES"
                value={qtdJogadoresMax}
                onChange={setQtdJogadoresMax}
                min={1}
                layout="horizontal"
              />
            </View>
          </View>

          <View style={styles.divider} />

          <NumberField
            label="TEMPO MÉDIO (MINUTOS)"
            value={tempoMedio}
            onChange={setTempoMedio}
            min={1}
            step={15}
            layout="horizontal"
          />
        </GlassCard>

        {/* Estado e Checklist */}
        <GlassCard variant="panel" style={styles.formCard}>
          <EstadoPicker value={estadoConservacao} onChange={setEstadoConservacao} />

          <GlassInput
            label="CHECKLIST DE PEÇAS"
            placeholder="O que tem na caixa? Faltou algo?"
            value={checklistPecas}
            onChangeText={setChecklistPecas}
            multiline
            numberOfLines={3}
          />
        </GlassCard>

        {/* Avaliação e Resenha */}
        <GlassCard variant="panel" style={styles.formCard}>
          <Text
            style={[
              tokens.typography.labelMd,
              { color: tokens.color.onSurfaceVariant, marginBottom: 12 },
            ]}
          >
            AVALIAÇÃO PESSOAL
          </Text>
          <View style={{ marginBottom: 24, alignItems: 'center' }}>
            <StarRating value={avaliacao} onChange={setAvaliacao} />
          </View>

          <GlassInput
            label="RESENHA"
            placeholder="Sua experiência com o jogo..."
            value={resenha}
            onChangeText={setResenha}
            multiline
            numberOfLines={4}
          />

          <CategorySelector selectedIds={categoriaIds} onChange={setCategoriaIds} />
        </GlassCard>

        {/* Favorito */}
        <GlassCard variant="panel" style={[styles.formCard, styles.switchCard]}>
          <View style={styles.switchRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[tokens.typography.bodyLg, { color: tokens.color.onSurface }]}>
                ⭐ Favorito
              </Text>
            </View>
            <Switch
              value={favorito}
              onValueChange={setFavorito}
              trackColor={{
                false: tokens.color.surfaceVariant,
                true: tokens.color.secondaryContainer,
              }}
              thumbColor={favorito ? tokens.color.secondary : tokens.color.onSurfaceVariant}
            />
          </View>
        </GlassCard>

        {error && (
          <Text
            style={[
              tokens.typography.labelMd,
              { color: tokens.color.error, textAlign: 'center', marginBottom: 16 },
            ]}
          >
            {error}
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <NeonButton
          label={saving ? 'Salvando...' : 'Salvar Jogo'}
          icon="check"
          variant="primary"
          fullWidth
          onPress={handleSave}
          loading={saving}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0D1A',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    padding: 20,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(200, 155, 255, 0.08)',
    marginVertical: 16,
  },
  switchCard: {
    paddingVertical: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#e8a500',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    padding: 16,
    backgroundColor: 'rgba(15, 13, 26, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(200, 155, 255, 0.15)',
  },
});
