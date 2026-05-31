import { db } from '../lib/db';
import { jogosColecao } from '../db/schema/jogos';
import { jogosCategorias } from '../db/schema/categorias';
import { executeQuery } from '../lib/db';
import { eq } from 'drizzle-orm';
import { type Result, success, failure } from '../utils/results';
import type { AppError } from '../errors/app-error';

export type EstadoConservacao = 'novo' | 'como_novo' | 'desgastado' | 'faltando_pecas';

export interface GameFormData {
  id?: number;
  titulo: string;
  editora?: string | null;
  qtdJogadoresMin?: number | null;
  qtdJogadoresMax?: number | null;
  tempoMedio?: number | null;
  estadoConservacao?: EstadoConservacao | null;
  checklistPecas?: string | null;
  avaliacaoPessoal?: number | null;
  resenha?: string | null;
  favorito?: boolean | null;
  imagemUri?: string | null;
  categoriaIds?: number[];
}

export function validarGame(data: GameFormData): Result<GameFormData, string> {
  if (!data.titulo || data.titulo.trim().length === 0) {
    return failure('Título é obrigatório');
  }
  if (data.avaliacaoPessoal != null && (data.avaliacaoPessoal < 1 || data.avaliacaoPessoal > 5)) {
    return failure('Avaliação deve ser entre 1 e 5');
  }
  if (
    data.qtdJogadoresMin != null &&
    data.qtdJogadoresMax != null &&
    data.qtdJogadoresMin > data.qtdJogadoresMax
  ) {
    return failure('Mínimo de jogadores não pode ser maior que o máximo');
  }
  return success(data);
}

export async function listarJogos(): Promise<Result<Record<string, unknown>[], AppError>> {
  return executeQuery(async () => {
    const result = await db.select().from(jogosColecao).orderBy(jogosColecao.titulo);
    return { success: true, data: result };
  }, 'listarJogos');
}

export async function obterJogo(id: number): Promise<Result<Record<string, unknown>, AppError>> {
  return executeQuery(async () => {
    const rows = await db.select().from(jogosColecao).where(eq(jogosColecao.id, id)).limit(1);
    const row = rows[0];
    if (!row) {
      return {
        success: false as const,
        error: { code: 'NOT_FOUND', message: 'Jogo não encontrado' },
      };
    }
    return { success: true, data: row };
  }, 'obterJogo');
}

export async function criarJogo(
  data: GameFormData,
): Promise<Result<GameFormData, AppError | string>> {
  const validation = validarGame(data);
  if (!validation.success) return validation;

  return executeQuery(async () => {
    const now = new Date().toISOString();
    const inserted = await db
      .insert(jogosColecao)
      .values({
        titulo: data.titulo,
        editora: data.editora ?? null,
        qtdJogadoresMin: data.qtdJogadoresMin ?? null,
        qtdJogadoresMax: data.qtdJogadoresMax ?? null,
        tempoMedio: data.tempoMedio ?? null,
        estadoConservacao: (data.estadoConservacao ?? 'novo') as EstadoConservacao,
        checklistPecas: data.checklistPecas ?? null,
        avaliacaoPessoal: data.avaliacaoPessoal ?? null,
        resenha: data.resenha ?? null,
        favorito: data.favorito ?? false,
        imagemUri: data.imagemUri ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    const row = inserted[0];
    const jogoId = row?.id;

    if (jogoId && data.categoriaIds && data.categoriaIds.length > 0) {
      await db.insert(jogosCategorias).values(
        data.categoriaIds.map((catId) => ({
          jogoId,
          categoriaId: catId,
        })),
      );
    }

    return { success: true, data: { ...data, id: jogoId } };
  }, 'criarJogo');
}

export async function atualizarJogo(
  id: number,
  data: Partial<GameFormData>,
): Promise<Result<void, AppError | string>> {
  return executeQuery(async () => {
    const now = new Date().toISOString();
    const updateData: Record<string, unknown> = { updatedAt: now };

    if (data.titulo !== undefined) updateData.titulo = data.titulo;
    if (data.editora !== undefined) updateData.editora = data.editora;
    if (data.qtdJogadoresMin !== undefined) updateData.qtdJogadoresMin = data.qtdJogadoresMin;
    if (data.qtdJogadoresMax !== undefined) updateData.qtdJogadoresMax = data.qtdJogadoresMax;
    if (data.tempoMedio !== undefined) updateData.tempoMedio = data.tempoMedio;
    if (data.estadoConservacao !== undefined) updateData.estadoConservacao = data.estadoConservacao;
    if (data.checklistPecas !== undefined) updateData.checklistPecas = data.checklistPecas;
    if (data.avaliacaoPessoal !== undefined) updateData.avaliacaoPessoal = data.avaliacaoPessoal;
    if (data.resenha !== undefined) updateData.resenha = data.resenha;
    if (data.favorito !== undefined) updateData.favorito = data.favorito;
    if (data.imagemUri !== undefined) updateData.imagemUri = data.imagemUri;

    await db.update(jogosColecao).set(updateData).where(eq(jogosColecao.id, id));

    if (data.categoriaIds !== undefined) {
      await db.delete(jogosCategorias).where(eq(jogosCategorias.jogoId, id));
      if (data.categoriaIds.length > 0) {
        await db
          .insert(jogosCategorias)
          .values(data.categoriaIds.map((catId) => ({ jogoId: id, categoriaId: catId })));
      }
    }

    return { success: true, data: undefined };
  }, 'atualizarJogo');
}

export async function deletarJogo(id: number): Promise<Result<void, AppError>> {
  return executeQuery(async () => {
    await db.delete(jogosColecao).where(eq(jogosColecao.id, id));
    return { success: true, data: undefined };
  }, 'deletarJogo');
}
