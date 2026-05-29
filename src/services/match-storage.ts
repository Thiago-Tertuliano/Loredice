import { db } from '../lib/db';
import { partidas } from '../db/schema/partidas';
import { jogadores } from '../db/schema/jogadores';
import { executeQuery } from '../lib/db';
import { eq } from 'drizzle-orm';
import type { SaveMatchParams } from './scoreboard';

export async function saveMatch(params: SaveMatchParams) {
  const now = new Date().toISOString();

  await executeQuery(async () => {
    // Cria/atualiza jogadores
    for (const j of params.jogadores) {
      const existing = await db.select().from(jogadores).where(eq(jogadores.nome, j.nome)).limit(1);
      const existingPlayer = existing[0];
      if (existingPlayer) {
        await db
          .update(jogadores)
          .set({ partidasJogadas: (existingPlayer.partidasJogadas ?? 0) + 1, updatedAt: now })
          .where(eq(jogadores.id, existingPlayer.id));
      } else {
        await db
          .insert(jogadores)
          .values({
            nome: j.nome,
            partidasJogadas: 1,
            vitorias: 0,
            createdAt: now,
            updatedAt: now,
          });
      }
    }

    // Busca o vencedor no banco
    let vencedorId: number | null = null;
    if (params.vencedorNome) {
      const winner = await db
        .select()
        .from(jogadores)
        .where(eq(jogadores.nome, params.vencedorNome))
        .limit(1);
      const winnerRow = winner[0];
      if (winnerRow) {
        vencedorId = winnerRow.id;
        await db
          .update(jogadores)
          .set({ vitorias: (winnerRow.vitorias ?? 0) + 1, updatedAt: now })
          .where(eq(jogadores.id, winnerRow.id));
      }
    }

    // Salva partida
    await db.insert(partidas).values({
      tipoJogo: params.tipoJogo,
      data: now,
      duracao: params.duracaoSegundos,
      vencedorId,
      createdAt: now,
      updatedAt: now,
    });
  }, 'saveMatch');
}
