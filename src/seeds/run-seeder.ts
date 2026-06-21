import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';
import type { SeedDatabase } from './seed-database.type';

type Seeder = (db: SeedDatabase) => Promise<void>;

export async function runSeeder(name: string, seeder: Seeder): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run database seed.');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema });

  try {
    await seeder(db);
    console.log(`${name} seed completed.`);
  } finally {
    await pool.end();
  }
}
