import type { NextAuthOptions } from "next-auth";

const authConfig: NextAuthOptions = {
  providers: [],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ req, token }) {
      const { pathname } = req.nextUrl;
      const isProtectedRoute = pathname.startsWith("/dashboard");

      if (isProtectedRoute) {
        return !!token;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default authConfig;
