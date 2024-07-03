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
  console.log(`Received message: ${message.content}`);
  try {
    const response = await axios.post(
      `${process.env.NEXTAUTH_URL}/api/discord-messages`,
      {
        content: message.content,
        author: message.author.username,
      }
    );
    console.log(response.data);
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
