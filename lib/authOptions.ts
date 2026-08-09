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
      // Google always gives us a verified email; without one we can't key a user.
      if (!user.email) return false;

      try {
        // Idempotent create-if-missing. onConflictDoNothing makes this safe for
        // every account (including concurrent first sign-ins) instead of only
        // the accounts that already have a row — the old code threw on the
        // insert path, which locked out every user but the first.
        await db
          .insert(users)
          .values({
            name: user.name ?? user.email,
            email: user.email,
          })
          .onConflictDoNothing({ target: users.email });
      } catch (e) {
        // Recording the user failed (e.g. a transient DB error). Log it, but
        // don't rethrow — a bookkeeping failure must not deny an otherwise
        // valid sign-in for everyone.
        console.error("signIn: failed to upsert user", e);
      }

      return true;
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
