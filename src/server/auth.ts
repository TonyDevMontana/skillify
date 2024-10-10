import { DefaultSession, getServerSession, NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import db from "@/server/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      creatorId: string;
    } & DefaultSession["user"];
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn(params) {
      const email = params.user.email;
      const name = params.user.name;
      if (!email || !name) {
        return false;
      }

      try {
        const existingUser = await db.user.findUnique({
          where: {
            email,
          },
        });
        if (existingUser) {
          return true;
        }

        await db.user.create({
          data: {
            name,
            email,
            creator: {
              create: {
                name,
              },
            },
          },
        });
      } catch (e) {
        console.log(e);
        return false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user && user.email) {
        const dbUser = await db.user.findUnique({
          where: {
            email: user.email,
          },
          include: { creator: true },
        });

        if (!dbUser) {
          return token;
        }

        return {
          ...token,
          id: dbUser.id,
          creatorId: dbUser.creator?.id,
        };
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          creatorId: token.creatorId as string,
        },
      };
    },
  },
} satisfies NextAuthOptions;

export const auth = async () => await getServerSession(authOptions);
