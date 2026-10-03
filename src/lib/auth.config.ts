import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, user, token }) {
      // In JWT strategy (if adapter fails or not used on edge), user is inside token
      if (session.user) {
        if (user) {
          session.user.id = user.id
          ;(session.user as any).role = (user as any).role || 'USER'
        } else if (token) {
          session.user.id = token.sub!
          ;(session.user as any).role = token.role || 'USER'
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
        token.role = (user as any).role || 'USER'
      }
      return token
    },
  },
} satisfies NextAuthConfig
