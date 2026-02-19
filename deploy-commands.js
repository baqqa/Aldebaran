const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { config } = require("dotenv");
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.clientId;
const guildIds = process.env.guildIds

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    // 1. Ensure guildIds is actually an array of strings
    // If your .env is GUILD_IDS="123,456", use .split(',')
    const idsToDeploy = Array.isArray(guildIds) ? guildIds : [guildIds];

    console.log(`Refreshing ${commands.length} commands for ${idsToDeploy.length} guilds.`);

    for (const id of idsToDeploy) {
      // Force 'id' to be a string just in case
      const guildString = String(id).trim();

      console.log(`-> Deploying to: ${guildString}`);

      await rest.put(
        Routes.applicationGuildCommands(clientId, guildString),
        { body: commands },
      );
      
      console.log(`✅ Success for ${guildString}`);
    }
  } catch (error) {
    console.error("Deployment failed:", error);
  }
})();