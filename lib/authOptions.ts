import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/app/db/schema";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    //   CredentialsProvider({
    //     name: "Credentials",
    //     credentials: {
    //       email: { label: "Email", type: "text" },
    //       password: { label: "Password", type: "password" },
    //     },
    //     async authorize(credentials) {
    //       if (!credentials || !credentials.email) {
    //         throw new Error("Email is required");
    //       }

    //       const user = await db
    //         .select()
    //         .from(users)
    //         .where(eq(users.email, credentials.email));

    //       if (user.length === 0) {
    //         return null;
    //       }

    //       // Here you would normally check the password, but for simplicity, we skip it.
    //       // Ensure the returned user matches NextAuth's User shape (id must be a string)
    //       const u = user[0];
    //       return {
    //         id: String(u.id),
    //         name: u.name,
    //         email: u.email,
    //       };
    //     },
    //   }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user }) {
      try {
        const existing = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email!));

        console.log(existing);

        if (existing.length === 0) {
          await db.insert(users).values({
            name: user.name!,
            email: user.email!,
          });
        }

        return true;
      } catch (e) {
        console.error("DATABASE ERROR:");
        console.error(e);
        throw e;
      }
    },

    async jwt({ token }) {
      // `token.sub` is the provider's subject id (e.g. Google's OAuth id),
      // which is NOT our DB `users.id`. Resolve the real id by email once and
      // cache it on the token so downstream routes get a valid serial id.
      // Never let a DB hiccup here throw — that would invalidate the whole
      // session and 401 every authenticated route.
      if (!token.id && token.email) {
        try {
          const dbUser = await db
            .select()
            .from(users)
            .where(eq(users.email, token.email));
          if (dbUser.length > 0) {
            token.id = String(dbUser[0].id);
          }
        } catch (err) {
          console.error("jwt callback: failed to resolve user id", err);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string | undefined) ?? token.sub!;
      }
      return session;
    },
  },
};
