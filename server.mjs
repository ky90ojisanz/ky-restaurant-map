import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Client, GatewayIntentBits } from "discord.js";
import axios from "axios";

import { config } from "dotenv";
config({ path: ".env.local" });

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

discord.on("ready", () => {
  console.log(`Logged in as ${discord.user.tag}!`);
});

discord.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    message.channelId !== process.env.TARGET_CHANNEL_ID
  ) {
    return;
  }
  try {
    const response = await axios.post(
      `${process.env.NEXTAUTH_URL}/api/discord-messages`,
      {
        content: message.content,
        author: message.author.username,
      }
    );
    const info = response.data;

    if (Boolean(info.success) && info.analysis.restaurantResult.name !== "") {
      if (Boolean(info.analysis.isNew)) {
        message.channel.send(
          `登録しました\n店名：${info.analysis.restaurantResult.name}\n住所：${info.analysis.restaurantResult.url}`
        );
      } else {
        message.channel.send(
          `すでに登録されています\n店名：${info.analysis.restaurantResult.name}\n住所：${info.analysis.restaurantResult.url}`
        );
      }
    }
  } catch (error) {
    console.error("Error forwarding message to Next.js app:", error);
  }
});

await discord.login(process.env.DISCORD_TOKEN);

await app.prepare();

createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  handle(req, res, parsedUrl);
}).listen(3000, (err) => {
  if (err) throw err;
  console.log(`"> Ready on ${process.env.NEXTAUTH_URL}"`);
});
