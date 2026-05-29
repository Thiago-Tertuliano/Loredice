import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const jogadores = sqliteTable('jogadores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  partidasJogadas: integer('partidas_jogadas').default(0),
  vitorias: integer('vitorias').default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
