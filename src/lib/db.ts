import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from '../db/schema';
import { SqliteError } from '../errors/sqlite-error';
import { logError } from '../services/logger';

export const sqlite = openDatabaseSync('loredice.db');
export const db = drizzle(sqlite, { schema });

type QueryFn<T> = () => Promise<T>;

export async function executeQuery<T>(query: QueryFn<T>, context: string, retries = 3): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await query();
    } catch (error) {
      if (error instanceof SqliteError) {
        if (error.code === 'SQLITE_BUSY' && attempt < retries) {
          await new Promise((r) => setTimeout(r, 100 * attempt)); // Exponential backoff
          continue; // Tente novamente
        }
        logError(context, error);
        throw error.toAppError();
      }
      logError(context, error as Error);
      throw error;
    }
  }
  throw new Error(`Failed to execute query after ${retries} attempts: ${context}`);
}
