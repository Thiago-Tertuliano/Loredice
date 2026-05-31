export class SqliteError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'SqliteError';
  }

  toAppError() {
    switch (this.code) {
      case 'SQLITE_CONSTRAINT_UNIQUE':
        return { code: 'DUPLICATE_ENTRY', message: 'Este registro já existe.' };
      case 'SQLITE_CORRUPT':
        return { code: 'DB_CORRUPT', message: 'O banco de dados está corrompido.' };
      default:
        return { code: 'DB_ERROR', message: 'Ocorreu um erro no banco de dados.' };
    }
  }
}
