// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify email guilds",
          redirect_uri: process.env.DISCORD_REDIRECT_URI,
        },
      },
    }),
  ],
  // 他のプロバイダを追加する場合はここに追加します
  // オプションの設定をここに追加できます
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account == null || account.access_token == null) return false;
      return await isJoinGuild(account.access_token);
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },

    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      if (session?.user) {
        session.user.id = token.id;
      }
      return session;
    },

    async jwt({ token, user, account, profile, isNewUser }) {
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.id = profile.id;
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

async function isJoinGuild(accessToken) {
  const res = await fetch("https://discordapp.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (res.ok) {
    const guilds = await res.json();
    return guilds.some((guild) => guild.id === process.env.KY_OJI_GUILD_ID);
  }
  return false;
}
