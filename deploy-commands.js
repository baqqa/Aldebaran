const { REST, Routes } = require('discord.js');
const { guildIds} = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const {config} = require("dotenv");
require("dotenv"),config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.clientId;

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
		console.log(`Started refreshing ${commands.length} application (/) commands for ${guildIds.length} guilds.`);

		for (const guildId of guildIds) {
			const data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: commands },
			);
			console.log(`Successfully reloaded ${data.length} application (/) commands for guild ${guildId}.`);
		}
	} catch (error) {
		console.error(error);
	}
})();
