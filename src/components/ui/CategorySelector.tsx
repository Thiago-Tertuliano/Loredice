import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
    <View style={styles.wrapper}>
      <Text
        style={[
          tokens.typography.labelMd,
          { color: tokens.color.onSurfaceVariant, marginBottom: 12 },
        ]}
      >
        CATEGORIAS
      </Text>
      <View style={styles.grid}>
        {categorias.map((cat) => {
          const selected = selectedIds.includes(cat.id);
          const baseColor = cat.cor ?? '#8b3fcc';
          return (
            <TouchableOpacity
              key={cat.id}
              accessibilityRole="button"
              accessibilityLabel={`${selected ? 'Remover' : 'Adicionar'} categoria ${cat.nome}`}
              onPress={() => toggle(cat.id)}
              activeOpacity={0.7}
              style={[
                styles.badge,
                {
                  backgroundColor: selected ? baseColor : baseColor + '15',
                  borderColor: selected ? baseColor : baseColor + '30',
                },
              ]}
            >
              <Text
                style={[
                  tokens.typography.labelMd,
                  { color: selected ? '#FFF' : baseColor, fontSize: 12 },
                ]}
              >
                {cat.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
});
