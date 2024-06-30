// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: { scope: "identify email guilds" },
      },
    }),
  ],
  // 他のプロバイダを追加する場合はここに追加します
  // オプションの設定をここに追加できます
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token, user }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  //   session: {
  //     strategy: "database",
  //     maxAge: 60 * 60 * 24 * 30, // 30 days
  //     updateAge: 60 * 60 * 24, // 24 hours
  //   },

  pages: {
    error: "/auth/error", // エラーページのパスを指定
  },
});
