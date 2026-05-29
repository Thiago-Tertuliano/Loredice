import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

export function logError(context: string, error: Error, metadata?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  // Em produção, escreve na tabela error_logs
  // Em dev, console.error
  if (__DEV__) {
    console.error(`[${timestamp}] [${context}]`, error.message, metadata);
  } else {
    try {
      db.run(
        sql`INSERT INTO error_logs (timestamp, context, error_message, stack_trace, metadata_json) VALUES (${timestamp}, ${context}, ${error.message}, ${error.stack ?? ''}, ${JSON.stringify(metadata ?? {})})`,
      );
    } catch {
      // Silencia erro do logger para não causar loop infinito
    }
  }
}
