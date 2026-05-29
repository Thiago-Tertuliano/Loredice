CREATE TABLE `categorias` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`cor` text DEFAULT '#6366F1',
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categorias_nome_unique` ON `categorias` (`nome`);--> statement-breakpoint
CREATE TABLE `jogos_categorias` (
	`jogo_id` integer NOT NULL,
	`categoria_id` integer NOT NULL,
	PRIMARY KEY(`jogo_id`, `categoria_id`),
	FOREIGN KEY (`jogo_id`) REFERENCES `jogos_colecao`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `jogadores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`partidas_jogadas` integer DEFAULT 0,
	`vitorias` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `jogos_colecao` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`editora` text,
	`qtd_jogadores_min` integer,
	`qtd_jogadores_max` integer,
	`tempo_medio` integer,
	`estado_conservacao` text DEFAULT 'novo',
	`checklist_pecas` text,
	`avaliacao_pessoal` integer,
	`resenha` text,
	`favorito` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `partidas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jogo_id` integer,
	`tipo_jogo` text NOT NULL,
	`data` text NOT NULL,
	`duracao` integer,
	`vencedor_id` integer,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`jogo_id`) REFERENCES `jogos_colecao`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`vencedor_id`) REFERENCES `jogadores`(`id`) ON UPDATE no action ON DELETE no action
);
