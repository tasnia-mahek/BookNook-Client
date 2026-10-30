import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/booknook-auth');
export const auth = betterAuth({
  database: mongodbAdapter(client.db('booknook-auth')),
  secret: process.env.BETTER_AUTH_SECRET,
  socialProviders: process.env.GOOGLE_CLIENT_ID ? {
    google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '' }
  } : undefined,
  emailAndPassword: { enabled: true }
});
