import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { jogosColecao } from './jogos';

export const categorias = sqliteTable('categorias', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull().unique(),
  cor: text('cor').default('#6366F1'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const jogosCategorias = sqliteTable(
  'jogos_categorias',
  {
    jogoId: integer('jogo_id')
      .notNull()
      .references(() => jogosColecao.id, { onDelete: 'cascade' }),
    categoriaId: integer('categoria_id')
      .notNull()
      .references(() => categorias.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.jogoId, table.categoriaId] }),
  }),
);
