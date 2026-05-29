import { type Result, success, failure } from '../utils/results';

export interface SaveMatchParams {
  tipoJogo: 'truco' | 'universal' | 'uno' | 'outro';
  jogadores: { nome: string; pontuacao: number }[];
  vencedorNome: string | null;
  duracaoSegundos: number;
}

export { type Result, success, failure };

export interface MatchRecord {
  id: number;
  tipoJogo: string;
  data: string;
  duracao: number;
  jogadores: string;
  vencedor: string | null;
}

export function validarJogadores(nomes: string[]): Result<string[], string> {
  const nomesValidos = nomes.filter((n) => n.trim().length > 0);
  if (nomesValidos.length < 2) {
    return failure('Mínimo de 2 jogadores necessários');
  }
  if (new Set(nomesValidos.map((n) => n.toLowerCase())).size !== nomesValidos.length) {
    return failure('Nomes de jogadores não podem se repetir');
  }
  return success(nomesValidos);
}

export function calcularVencedor(
  jogadores: { nome: string; pontuacao: number }[],
  limite: number,
): string | null {
  const vencedor = jogadores.find((j) => j.pontuacao >= limite);
  return vencedor?.nome ?? null;
}

export function formatarTempo(segundos: number): string {
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}
