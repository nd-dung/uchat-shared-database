import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';
import { seedFacilities } from './facilities.seeder';
import { seedPermissions } from './permissions.seeder';
import { seedUsers } from './users.seeder';

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run database seed.');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema });

  try {
    await seedFacilities(db);
    await seedPermissions(db);
    await seedUsers(db);
    console.log('Database seed completed.');
  } finally {
    await pool.end();
  }
}

void main().catch((error) => {
  console.error('Database seed failed.');
  console.error(error);
  process.exit(1);
});
