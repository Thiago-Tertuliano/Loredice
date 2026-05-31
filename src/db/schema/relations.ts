import { relations } from 'drizzle-orm';
import { jogosColecao } from './jogos';
import { jogadores } from './jogadores';
import { partidas } from './partidas';
import { categorias, jogosCategorias } from './categorias';

export const jogosRelations = relations(jogosColecao, ({ many }) => ({
  partidas: many(partidas),
  categorias: many(jogosCategorias),
}));

export const jogadoresRelations = relations(jogadores, ({ many }) => ({
  vitorias: many(partidas),
}));

export const partidasRelations = relations(partidas, ({ one }) => ({
  jogo: one(jogosColecao, {
    fields: [partidas.jogoId],
    references: [jogosColecao.id],
  }),
  vencedor: one(jogadores, {
    fields: [partidas.vencedorId],
    references: [jogadores.id],
  }),
}));

export const categoriasRelations = relations(categorias, ({ many }) => ({
  jogos: many(jogosCategorias),
}));

export const jogosCategoriasRelations = relations(jogosCategorias, ({ one }) => ({
  jogo: one(jogosColecao, {
    fields: [jogosCategorias.jogoId],
    references: [jogosColecao.id],
  }),
  categoria: one(categorias, {
    fields: [jogosCategorias.categoriaId],
    references: [categorias.id],
  }),
}));
