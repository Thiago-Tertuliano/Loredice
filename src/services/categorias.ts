import { db } from '../lib/db';
import { categorias, jogosCategorias } from '../db/schema/categorias';
import { executeQuery } from '../lib/db';
import { eq, and } from 'drizzle-orm';
import { type Result, success, failure } from '../utils/results';
import type { AppError } from '../errors/app-error';

export interface CategoriaData {
  id?: number;
  nome: string;
  cor?: string | null;
}

export function validarCategoria(data: CategoriaData): Result<CategoriaData, string> {
  if (!data.nome || data.nome.trim().length === 0) {
    return failure('Nome da categoria é obrigatório');
  }
  return success(data);
}

export async function listarCategorias(): Promise<Result<Record<string, unknown>[], AppError>> {
  return executeQuery(async () => {
    const result = await db.select().from(categorias).orderBy(categorias.nome);
    return { success: true, data: result };
  }, 'listarCategorias');
}

export async function criarCategoria(
  data: CategoriaData,
): Promise<Result<CategoriaData, AppError | string>> {
  const validation = validarCategoria(data);
  if (!validation.success) return validation;

  return executeQuery(async () => {
    const now = new Date().toISOString();
    const inserted = await db
      .insert(categorias)
      .values({
        nome: data.nome.trim(),
        cor: data.cor ?? '#6366F1',
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    const row = inserted[0];
    return { success: true, data: { ...data, id: row?.id } };
  }, 'criarCategoria');
}

export async function atualizarCategoria(
  id: number,
  data: Partial<CategoriaData>,
): Promise<Result<void, AppError | string>> {
  if (data.nome !== undefined && data.nome.trim().length === 0) {
    return failure('Nome da categoria não pode ser vazio');
  }

  return executeQuery(async () => {
    const now = new Date().toISOString();
    const updateData: Record<string, unknown> = { updatedAt: now };

    if (data.nome !== undefined) updateData.nome = data.nome.trim();
    if (data.cor !== undefined) updateData.cor = data.cor;

    await db.update(categorias).set(updateData).where(eq(categorias.id, id));
    return { success: true, data: undefined };
  }, 'atualizarCategoria');
}

export async function deletarCategoria(id: number): Promise<Result<void, AppError>> {
  return executeQuery(async () => {
    await db.delete(categorias).where(eq(categorias.id, id));
    return { success: true, data: undefined };
  }, 'deletarCategoria');
}

export async function associarCategoria(
  jogoId: number,
  categoriaId: number,
): Promise<Result<void, AppError>> {
  return executeQuery(async () => {
    await db.insert(jogosCategorias).values({ jogoId, categoriaId });
    return { success: true, data: undefined };
  }, 'associarCategoria');
}

export async function desassociarCategoria(
  jogoId: number,
  categoriaId: number,
): Promise<Result<void, AppError>> {
  return executeQuery(async () => {
    await db
      .delete(jogosCategorias)
      .where(and(eq(jogosCategorias.jogoId, jogoId), eq(jogosCategorias.categoriaId, categoriaId)));
    return { success: true, data: undefined };
  }, 'desassociarCategoria');
}

export async function listarCategoriasDoJogo(
  jogoId: number,
): Promise<Result<Record<string, unknown>[], AppError>> {
  return executeQuery(async () => {
    const result = await db
      .select({
        id: categorias.id,
        nome: categorias.nome,
        cor: categorias.cor,
      })
      .from(jogosCategorias)
      .innerJoin(categorias, eq(jogosCategorias.categoriaId, categorias.id))
      .where(eq(jogosCategorias.jogoId, jogoId));
    return { success: true, data: result };
  }, 'listarCategoriasDoJogo');
}
