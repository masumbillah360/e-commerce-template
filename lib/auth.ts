import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/db'; // your drizzle instance
import * as schema from '@/db/schema'; // your drizzle schema
import { nextCookies } from 'better-auth/next-js';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg', // or "mysql", "sqlite"
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
        maxPasswordLength: 24,
        minPasswordLength: 8,
    },
    experimental: {
        joins: true,
    },
    user: {
        additionalFields: {
            role: {
                type: 'string',
                required: false,
                defaultValue: 'user',
                input: false, // User cannot set their own role via API
            },
        },
    },
    plugins: [nextCookies()],
});
