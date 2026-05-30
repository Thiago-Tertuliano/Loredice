import { db } from '../lib/db';
import { partidas } from '../db/schema/partidas';
import { jogadores } from '../db/schema/jogadores';
import { executeQuery } from '../lib/db';
import { eq } from 'drizzle-orm';
import type { Result } from '../utils/results';
import type { AppError } from '../errors/app-error';

export interface MatchWithWinner {
  id: number;
  tipoJogo: string;
  data: string;
  duracao: number | null;
  vencedorNome: string | null;
}

export async function listarHistorico(): Promise<Result<MatchWithWinner[], AppError>> {
  return executeQuery(async () => {
    const data = await db
      .select({
        id: partidas.id,
        tipoJogo: partidas.tipoJogo,
        data: partidas.data,
        duracao: partidas.duracao,
        // Preferir vencedorNome salvo diretamente; fallback para JOIN com jogadores
        vencedorNome: partidas.vencedorNome,
        vencedorNomeJoin: jogadores.nome,
      })
      .from(partidas)
      .leftJoin(jogadores, eq(partidas.vencedorId, jogadores.id))
      .orderBy(partidas.data);

    // Resolve o nome do vencedor: campo direto > join
    const mapped: MatchWithWinner[] = data.map((row) => ({
      id: row.id,
      tipoJogo: row.tipoJogo,
      data: row.data,
      duracao: row.duracao,
      vencedorNome: row.vencedorNome ?? row.vencedorNomeJoin ?? null,
    }));

    return { success: true, data: mapped };
  }, 'listarHistorico');
}
