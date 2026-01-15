// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { createSecurityEvent } from './security';

export const authOptions: NextAuthOptions = {
  // 👇 ВАЖНЫЙ ФИКС — кастуем prisma к any, чтобы типы не мозг ебали
  adapter: PrismaAdapter(prisma as any) as any,

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          await createSecurityEvent({
            type: 'login_email_not_found',
            details: `Email: ${credentials.email}`,
            level: 'warning',
          });
          throw new Error('Invalid credentials');
        }

        if (user.isBlocked) {
          await createSecurityEvent({
            userId: user.id,
            type: 'blocked_login_attempt',
            details: `Blocked user tried to log in (${user.email})`,
            level: 'high',
          });
          throw new Error('Your account is blocked');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          await createSecurityEvent({
            userId: user.id,
            type: 'login_wrong_password',
            details: `Email: ${user.email}`,
            level: 'warning',
          });
          throw new Error('Invalid credentials');
        }

        await createSecurityEvent({
          userId: user.id,
          type: 'login_success',
          level: 'info',
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          rememberMe: credentials.rememberMe === 'true',
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.rememberMe = (user as any).rememberMe;

        // если НЕ remember me — сессия 24 часа
        if (!(user as any).rememberMe) {
          token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};
