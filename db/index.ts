import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import env from '@/lib/env'; // Using our type-safe env

/**
 * CACHE THE DATABASE CONNECTION
 *
 * Next.js in development mode reloads files on every save.
 * If we don't cache the connection in 'globalThis', we will create
 * thousands of connections and exhaust the database limit.
 */
const globalForDb = globalThis as unknown as {
    conn: postgres.Sql | undefined;
};

const conn =
    globalForDb.conn ??
    postgres(env.DATABASE_URL, {
        // OPTIMIZATION:
        // 'prepare: false' is recommended for serverless environments (like Vercel)
        // or when using connection poolers (like Supabase Transaction Mode)
        // to prevent prepared statement errors.
        prepare: false,
    });

if (env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema });
