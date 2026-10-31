import { betterAuth } from 'better-auth';
import { mongodbAdapter } from '@better-auth/mongo-adapter';
import { jwt } from 'better-auth/plugins';
import { MongoClient } from 'mongodb';

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) throw new Error('MONGODB_URI is required for Better Auth.');

const mongoClient = new MongoClient(mongoUri);
const database = mongoClient.db(process.env.MONGODB_DB || 'booknook');
const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const developmentOrigins = ['http://localhost:3000', 'http://localhost:3001'];
const configuredOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS || '').split(',').map(origin => origin.trim()).filter(Boolean);

export const auth = betterAuth({
  database: mongodbAdapter(database, { client: mongoClient }),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  basePath: '/api/auth',
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: Array.from(new Set([...developmentOrigins, ...configuredOrigins, process.env.BETTER_AUTH_URL].filter((origin): origin is string => Boolean(origin)))),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
  },
  socialProviders: googleEnabled
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,
  plugins: [
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
        audience: 'booknook-server',
      },
    }),
  ],
});
