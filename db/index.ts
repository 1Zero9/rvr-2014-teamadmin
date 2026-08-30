import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

let dbInstance: PostgresJsDatabase<typeof schema> | undefined;

export function getDb() {
  if (!dbInstance) {
    const connectionString =
      process.env.POSTGRES_URL ||
      process.env.PRISMA_DATABASE_URL ||
      process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error(
        'Database connection string is missing. Please set POSTGRES_URL or PRISMA_DATABASE_URL in your environment.',
      );
    }

    const client = postgres(connectionString, {
      prepare: false,
    });

    dbInstance = drizzle(client, { schema });
  }

  return dbInstance;
}
