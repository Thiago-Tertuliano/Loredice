import { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { useTheme } from '../../../../src/lib/theme';
import { FormField } from '../../../../src/components/ui/FormField';
import { NumberField } from '../../../../src/components/ui/NumberField';
import { StarRating } from '../../../../src/components/ui/StarRating';
import { EstadoPicker } from '../../../../src/components/ui/EstadoPicker';
import { CategorySelector } from '../../../../src/components/ui/CategorySelector';
import { atualizarJogo, obterJogo } from '../../../../src/services/collection';
import { useCollectionStore } from '../../../../src/stores/useCollectionStore';
import { router, useLocalSearchParams } from 'expo-router';
import type { EstadoConservacao } from '../../../../src/services/collection';

export default function EditGameScreen() {
  const { tokens } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { updateGame } = useCollectionStore();
  const jogoId = Number(id);

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
  const [categoriaIds, setCategoriaIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    obterJogo(jogoId).then((result) => {
      if (result.success) {
        const g = result.data as Record<string, unknown>;
        setTitulo((g.titulo as string) ?? '');
        setEditora((g.editora as string) ?? '');
        setQtdJogadoresMin((g.qtd_jogadores_min as number) ?? null);
        setQtdJogadoresMax((g.qtd_jogadores_max as number) ?? null);
        setTempoMedio((g.tempo_medio as number) ?? null);
        setEstadoConservacao((g.estado_conservacao as EstadoConservacao) ?? null);
        setChecklistPecas((g.checklist_pecas as string) ?? '');
        setAvaliacao((g.avaliacao_pessoal as number) ?? 0);
        setResenha((g.resenha as string) ?? '');
        setFavorito((g.favorito as boolean) ?? false);
      } else {
        setError('Jogo não encontrado');
      }
      setLoading(false);
    });
  }, [jogoId]);

  async function handleSave() {
    setError(null);
    setSaving(true);
    const result = await atualizarJogo(jogoId, {
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
      categoriaIds: categoriaIds.length > 0 ? categoriaIds : [],
    });
    setSaving(false);
    if (result.success) {
      updateGame(jogoId, {
        titulo,
        editora: editora || null,
        qtdJogadoresMin: qtdJogadoresMin ?? undefined,
        qtdJogadoresMax: qtdJogadoresMax ?? undefined,
        tempoMedio: tempoMedio ?? undefined,
        estadoConservacao: estadoConservacao ?? undefined,
        checklistPecas: checklistPecas || undefined,
        avaliacaoPessoal: avaliacao || undefined,
        resenha: resenha || undefined,
        favorito,
        categoriaIds: categoriaIds.length > 0 ? categoriaIds : undefined,
      });
      router.back();
    } else {
      setError(typeof result.error === 'string' ? result.error : result.error.message);
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
        <Text style={{ color: tokens.color.textMuted }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: tokens.color.background }}>
      <View style={{ padding: tokens.spacing.lg }}>
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text
            style={{ color: tokens.color.text, fontSize: tokens.fontSize.xl, fontWeight: 'bold' }}
          >
            Editar Jogo
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={() => router.back()}
          >
            <Text style={{ color: tokens.color.accent }}>Cancelar</Text>
          </Pressable>
        </View>

        <FormField label="Título" value={titulo} onChangeText={setTitulo} />
        <FormField label="Editora" value={editora} onChangeText={setEditora} />

        <View style={{ flexDirection: 'row', gap: tokens.spacing.md }}>
          <View style={{ flex: 1 }}>
            <NumberField
              label="Min. Jogadores"
              value={qtdJogadoresMin}
              onChange={setQtdJogadoresMin}
              min={1}
            />
          </View>
          <View style={{ flex: 1 }}>
            <NumberField
              label="Max. Jogadores"
              value={qtdJogadoresMax}
              onChange={setQtdJogadoresMax}
              min={1}
            />
          </View>
        </View>

        <NumberField
          label="Tempo Médio (min)"
          value={tempoMedio}
          onChange={setTempoMedio}
          min={1}
        />

        <EstadoPicker value={estadoConservacao} onChange={setEstadoConservacao} />

        <FormField
          label="Checklist de Peças"
          value={checklistPecas}
          onChangeText={setChecklistPecas}
          multiline
          numberOfLines={3}
        />

        <View style={{ marginTop: tokens.spacing.md }}>
          <Text style={{ color: tokens.color.textMuted, marginBottom: tokens.spacing.sm }}>
            Avaliação
          </Text>
          <StarRating value={avaliacao} onChange={setAvaliacao} />
        </View>

        <FormField
          label="Resenha"
          value={resenha}
          onChangeText={setResenha}
          multiline
          numberOfLines={4}
        />

        <CategorySelector selectedIds={categoriaIds} onChange={setCategoriaIds} />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: tokens.spacing.lg,
          }}
        >
          <Text style={{ color: tokens.color.text }}>Favorito</Text>
          <Switch
            accessibilityLabel="Marcar como favorito"
            value={favorito}
            onValueChange={setFavorito}
            trackColor={{ false: tokens.color.surfaceLight, true: tokens.color.gold + '60' }}
            thumbColor={favorito ? tokens.color.gold : tokens.color.textMuted}
          />
        </View>

        {error && (
          <Text style={{ color: tokens.color.error, marginTop: tokens.spacing.md }}>{error}</Text>
        )}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Salvar alterações"
          onPress={handleSave}
          disabled={saving}
          style={{
            backgroundColor: saving ? tokens.color.accent + '60' : tokens.color.accent,
            borderRadius: tokens.borderRadius.md,
            padding: tokens.spacing.md,
            marginTop: tokens.spacing.lg,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
