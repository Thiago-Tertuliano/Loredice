import { db } from '../../lib/db';
import { jogosColecao } from '../schema/jogos';

const jogosIniciais = [
  { titulo: 'Catan', editora: 'Devir', qtdJogadoresMin: 3, qtdJogadoresMax: 4, tempoMedio: 90 },
  { titulo: 'Dixit', editora: 'Galápagos', qtdJogadoresMin: 3, qtdJogadoresMax: 6, tempoMedio: 30 },
  { titulo: 'War', editora: 'Grow', qtdJogadoresMin: 2, qtdJogadoresMax: 6, tempoMedio: 120 },
];

export async function seedDatabase() {
  const now = new Date().toISOString();
  for (const jogo of jogosIniciais) {
    await db.insert(jogosColecao).values({ ...jogo, createdAt: now, updatedAt: now });
  }
}
