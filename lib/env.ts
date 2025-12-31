import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().default('http://localhost:3000'),
    NODE_ENV: z
        .enum(['development', 'test', 'production'])
        .default('development'),
    UPLOADTHING_SECRET: z.string().min(1),
    UPLOADTHING_APP_ID: z.string().min(1),
});

// Validate process.env and throw error if invalid
const env = envSchema.parse(process.env);

export default env;
