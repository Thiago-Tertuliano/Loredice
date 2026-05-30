import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const jogosColecao = sqliteTable('jogos_colecao', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  editora: text('editora'),
  qtdJogadoresMin: integer('qtd_jogadores_min'),
  qtdJogadoresMax: integer('qtd_jogadores_max'),
  tempoMedio: integer('tempo_medio'), // Minutos
  estadoConservacao: text('estado_conservacao', {
    enum: ['novo', 'como_novo', 'desgastado', 'faltando_pecas'],
  }).default('novo'),
  checklistPecas: text('checklist_pecas'), // JSON string
  avaliacaoPessoal: integer('avaliacao_pessoal'), // 1 a 5
  resenha: text('resenha'),
  favorito: integer('favorito', { mode: 'boolean' }).default(false),
  imagemUri: text('imagem_uri'), // URI local da foto do jogo (nova coluna v3)
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
