/**
 * next-auth credentials provider against the `users` table.
 *
 * Sessions are JWT (no DB session table) so admin pages don't add a
 * round-trip per request.  The user's role is included on the JWT so
 * middleware can authorize without hitting the DB.
 */

import type { AuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'admin' | 'editor';
    } & DefaultSession['user'];
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'admin' | 'editor';
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        let row;
        try {
          [row] = await db.select().from(users).where(eq(users.email, creds.email));
        } catch {
          // DATABASE_URL not set → fail closed but quietly.
          return null;
        }
        if (!row) return null;
        const ok = await bcrypt.compare(creds.password, row.passwordHash);
        if (!ok) return null;
        return {
          id: row.id,
          email: row.email,
          name: row.name ?? row.email,
          role: row.role as 'admin' | 'editor',
        };
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 /* 8h */ },
  pages: { signIn: '/admin/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id: string; role: 'admin' | 'editor' };
        token.id = u.id;
        token.role = u.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
