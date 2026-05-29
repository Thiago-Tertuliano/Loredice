import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../lib/theme';
import { listarCategorias } from '../../services/categorias';

interface Props {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
}

export function CategorySelector({ selectedIds, onChange }: Props) {
  const { tokens } = useTheme();
  const [categorias, setCategorias] = useState<{ id: number; nome: string; cor: string | null }[]>(
    [],
  );

  useEffect(() => {
    listarCategorias().then((result) => {
      if (result.success)
        setCategorias(result.data as { id: number; nome: string; cor: string | null }[]);
    });
  }, []);

  function toggle(id: number) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  if (categorias.length === 0) return null;

  return (
    <View style={{ marginTop: tokens.spacing.md }}>
      <Text style={{ color: tokens.color.textMuted, marginBottom: tokens.spacing.sm }}>
        Categorias
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.sm }}>
        {categorias.map((cat) => {
          const selected = selectedIds.includes(cat.id);
          const bgColor = cat.cor ?? '#6366F1';
          return (
            <Pressable
              key={cat.id}
              accessibilityRole="button"
              accessibilityLabel={`${selected ? 'Remover' : 'Adicionar'} categoria ${cat.nome}`}
              onPress={() => toggle(cat.id)}
              style={{
                backgroundColor: selected ? bgColor : bgColor + '20',
                borderRadius: tokens.borderRadius.md,
                paddingHorizontal: tokens.spacing.md,
                paddingVertical: tokens.spacing.sm,
                borderWidth: 1,
                borderColor: selected ? bgColor : bgColor + '40',
              }}
            >
              <Text style={{ color: selected ? '#FFF' : bgColor, fontWeight: 'bold' }}>
                {cat.nome}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
