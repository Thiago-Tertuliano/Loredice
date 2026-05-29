import { sqlite } from './db';

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS \`categorias\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`nome\` text NOT NULL,
  \`cor\` text DEFAULT '#6366F1',
  \`created_at\` text NOT NULL,
  \`updated_at\` text NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS \`categorias_nome_unique\` ON \`categorias\` (\`nome\`);
CREATE TABLE IF NOT EXISTS \`jogos_categorias\` (
  \`jogo_id\` integer NOT NULL,
  \`categoria_id\` integer NOT NULL,
  PRIMARY KEY(\`jogo_id\`, \`categoria_id\`),
  FOREIGN KEY (\`jogo_id\`) REFERENCES \`jogos_colecao\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`categoria_id\`) REFERENCES \`categorias\`(\`id\`) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS \`jogadores\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`nome\` text NOT NULL,
  \`partidas_jogadas\` integer DEFAULT 0,
  \`vitorias\` integer DEFAULT 0,
  \`created_at\` text NOT NULL,
  \`updated_at\` text NOT NULL
);
CREATE TABLE IF NOT EXISTS \`jogos_colecao\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`titulo\` text NOT NULL,
  \`editora\` text,
  \`qtd_jogadores_min\` integer,
  \`qtd_jogadores_max\` integer,
  \`tempo_medio\` integer,
  \`estado_conservacao\` text DEFAULT 'novo',
  \`checklist_pecas\` text,
  \`avaliacao_pessoal\` integer,
  \`resenha\` text,
  \`favorito\` integer DEFAULT false,
  \`created_at\` text NOT NULL,
  \`updated_at\` text NOT NULL
);
CREATE TABLE IF NOT EXISTS \`partidas\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`jogo_id\` integer,
  \`tipo_jogo\` text NOT NULL,
  \`data\` text NOT NULL,
  \`duracao\` integer,
  \`vencedor_id\` integer,
  \`created_at\` text NOT NULL,
  \`updated_at\` text NOT NULL,
  FOREIGN KEY (\`jogo_id\`) REFERENCES \`jogos_colecao\`(\`id\`),
  FOREIGN KEY (\`vencedor_id\`) REFERENCES \`jogadores\`(\`id\`)
);
`.trim();

const SEED_CATEGORIAS = [
  { nome: 'Estratégia', cor: '#6366F1' },
  { nome: 'Party Game', cor: '#F59E0B' },
  { nome: 'Card Game', cor: '#10B981' },
  { nome: 'Eurogame', cor: '#8B5CF6' },
  { nome: 'Wargame', cor: '#EF4444' },
  { nome: 'Cooperativo', cor: '#06B6D4' },
  { nome: 'Solo', cor: '#EC4899' },
  { nome: 'Família', cor: '#34D399' },
];

export async function initializeDatabase() {
  const row = await sqlite.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const version = row?.user_version ?? 0;

  if (version < 1) {
    await sqlite.execAsync(MIGRATION_SQL);
    await sqlite.execAsync('PRAGMA user_version = 1');
  }

  if (version < 2) {
    const row = await sqlite.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM categorias',
    );
    if (!row || row.count === 0) {
      const now = new Date().toISOString();
      for (const cat of SEED_CATEGORIAS) {
        await sqlite.runAsync(
          'INSERT INTO categorias (nome, cor, created_at, updated_at) VALUES (?, ?, ?, ?)',
          cat.nome,
          cat.cor,
          now,
          now,
        );
      }
    }
    await sqlite.execAsync('PRAGMA user_version = 2');
  }
}
