import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

const globalForDb = globalThis as unknown as {
  pool?: Pool;
};

const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/scout_dev';

export const pool =
  globalForDb.pool ||
  new Pool({
    connectionString,
    ssl:
      process.env.NODE_ENV === 'production' || connectionString.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : false
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema });
export type Database = typeof db;
