import { drizzle } from 'drizzle-orm/node-postgres';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as schema from './schema';

export const DRIZZLE_PROVIDER = 'DRIZZLE_PROVIDER';
export type DrizzleDb = NodePgDatabase<typeof schema>;

export const DrizzleProvider: Provider = {
  provide: DRIZZLE_PROVIDER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): DrizzleDb => {
    const connectionString = configService.get<string>('database.url');
    const pool = new Pool({ connectionString });
    return drizzle(pool, { schema });
  },
};
