import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { jogosColecao } from './jogos';
import { jogadores } from './jogadores';

export const partidas = sqliteTable('partidas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  jogoId: integer('jogo_id').references(() => jogosColecao.id),
  tipoJogo: text('tipo_jogo', {
    enum: ['truco', 'universal', 'uno', 'outro'],
  }).notNull(),
  data: text('data').notNull(),
  duracao: integer('duracao'), // segundos
  vencedorId: integer('vencedor_id').references(() => jogadores.id),
  vencedorNome: text('vencedor_nome'), // fallback textual — salvo diretamente para garantir histórico correto
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
