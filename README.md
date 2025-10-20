# Aldebaran

Aldebaran — a modular Discord bot implemented in JavaScript.

This README describes how to set up, run, and extend the bot and documents the command folders and commands found in the repository.

---

Table of contents
- [Features](#features)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Commands (by folder)](#commands-by-folder)
- [How commands are loaded & registered](#how-commands-are-loaded--registered)
- [Voice & media notes](#voice--media-notes)
- [Development tips](#development-tips)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License & Contact](#license--contact)

---

## Features

- Slash-command based Discord bot (discord.js).
- Modular command structure with folders and subfolders.
- Example D&D utilities (monster lookup, NPC generator).
- Music playback command using yt-dlp and discord voice.
- Meme template listing and generation utilities.
- Utility commands (help, fun facts, etc.).

## Requirements

- Node.js (recommend latest LTS; tested with Node 16+ / 18+).
- npm or yarn.
- A Discord application and bot token.
- For music playback: yt-dlp (or youtube-dl replacement), ffmpeg (or ffmpeg-static).
- Internet access for external APIs used by some commands.

## Quick start

1. Clone the repository
   ```bash
   git clone https://github.com/baqqa/Aldebaran.git
   cd Aldebaran
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Add environment variables (see Configuration).

4. Register slash commands (see the "How commands are loaded & registered" section — repository includes `deploy-commands.js`).

5. Start the bot
   ```bash
   npm start
   ```
   For development with reload tools (if you add nodemon):
   ```bash
   npm run dev
   ```

## Configuration

Create a `.env` file in the project root with at minimum the Discord token and client id. Example:

```env
DISCORD_TOKEN=your-discord-bot-token
clientId=your-application-client-id
# Optional / common
GUILD_ID=your-dev-guild-id
MONGO_URI=mongodb://user:pass@host:port/dbname
NODE_ENV=development
```

Note: The code uses `process.env.clientId` (lowercase `clientId`) in some places — ensure variables match the names used in your code. The `deploy-commands.js` script references `config.json` for `guildIds` in the repository; you can populate that file or adapt the deploy script.

## Commands (by folder)

The project organizes commands under the `commands/` directory. Each subfolder groups related commands. Commands are implemented as modules that export a `data` (SlashCommandBuilder) and an `execute` function. Some commands also expose a `cooldown` property.

The following command folders and files were found in the repository and are documented here:

- commands/
  - dnd/
    - monster.js
      - Description: Print a D&D Monster Manual stat block for a monster (queries an API).
      - Usage: `/monster name:<monster name>`
      - Notes: Requires the monster name (in English). The command uses axios to fetch data and returns an embedded stat block.
      - Cooldown: 5 seconds
    - npcgen.js
      - Description: Generate a random NPC at a given level with stats and a generated name.
      - Usage: `/npcgen level:<1-20>`
      - Notes: Uses a name generator module (`namegenerator`) and external data via axios to build class/race/ability values. Outputs an embedded NPC sheet (stats, modifiers, hp, proficiencies, etc.).
      - Cooldown: 5 seconds

  - memes/
    - list_memes.js
      - Description: List available meme templates for generating memes.
      - Usage: `/list_memes`
      - Notes: Fetches templates via an API, caches templates for 1 hour to reduce API calls. The command returns templates (often with a paginated or interactive UI using buttons).

  - music/
    - play.js
      - Description: Play a song or playlist in your voice channel (supports YouTube links and search queries).
      - Usage: `/play query:<song name | youtube url | playlist url>`
      - Notes:
        - If you pass a playlist URL (YouTube playlist), the command tries to expand it and queue items.
        - Requires bot to join voice channel; checks for CONNECT and SPEAK permissions.
        - Uses `yt-dlp` (spawned as a process) to fetch stream info and then plays audio via @discordjs/voice.
        - Ensure `yt-dlp` (or equivalent) and `ffmpeg` are available on the host.
      - Typical interaction flow:
        - User runs `/play` with query.
        - Bot defers reply and attempts to resolve the query to one or more streamable URLs.
        - Bot joins the user's voice channel and plays audio using an audio player and resources.
      - The bot stores a per-server queue in memory (a Map in the command module).

  - utility/
    - funFact.js
      - Description: Returns a random fun fact.
      - Usage: `/funfact`
      - Notes: Uses axios to call an external API and returns an embedded response.
      - Cooldown: 5 seconds
    - help.js
      - Description: Show a help embed listing supported commands and short usage examples (content includes Italian text for descriptions).
      - Usage: `/help`
      - Notes: The help embed includes commands such as `/monster`, `/npcgen`, `/play`, `/funFact`, `/roll`, `/spell`, `/generate_meme`, and explains a bit about each (some descriptions are in Italian).

If you add new commands:
- Each command module should export `data` (builder) and `execute`.
- Optionally include `cooldown`.
- For slash commands, `data` is transformed with `.toJSON()` when registering.

## How commands are loaded & registered

- index.js bootstraps the client, reads the `commands` folder, and loads each command. It expects each command module to contain `data` and `execute`. The command is added to `client.commands` with `client.commands.set(command.data.name, command)`.
- `deploy-commands.js` iterates the same command folders to build an array of command JSON objects and uses the Discord REST API via discord.js REST to register them. The script references `guildIds` from `config.json` for guild command registration and reads the token and client id from environment variables.

To register commands locally (development / guild registration):
- Ensure `DISCORD_TOKEN` and `clientId` are set.
- Run:
  ```bash
  node deploy-commands.js
  ```
  (Adjust the script if you need global registration or different scoping. Guild-level registration updates instantly; global commands can take up to an hour to propagate.)

## Voice & media notes

- The play command uses external binaries/processes (yt-dlp) to fetch and parse YouTube content and ffmpeg to transcode audio. Make sure:
  - `yt-dlp` is installed and accessible in PATH, or adapt the command to a library wrapper.
  - `ffmpeg` is available (you can use system ffmpeg or include `ffmpeg-static`).
- The bot requests the following intents in code: Guilds, GuildVoiceStates, GuildMessages. Make sure the bot's OAuth invite and Developer Portal settings include required intents and scopes (bot, applications.commands).

## Development tips

- Use a test guild (GUILD_ID) to register commands quickly during development.
- Use `console.log` inside command modules and event handlers to debug.
- Keep long-running or blocking operations out of the main `execute` function where possible — use async/await and defer replies on interactions for requests that need more time.
- The music queue is ephemeral (in-memory). For persistence across restarts, implement a storage layer.

## Troubleshooting

- Bot won't start:
  - Verify `DISCORD_TOKEN` is valid and present in `.env`.
  - Confirm node_modules are installed.
- Slash commands not visible:
  - If registered globally, wait up to an hour; for immediate results, register in a dev guild.
  - Check `deploy-commands.js` and `config.json` for `guildIds`.
- Music playback errors:
  - Ensure `yt-dlp` and `ffmpeg` exist and are in PATH.
  - Confirm the bot has permission to join and speak in the target voice channel.
- API calls failing:
  - Check outbound network connectivity from the host and any API key / rate limits.

## Contributing

Contributions are welcome.

Suggested workflow:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Add or modify commands following the existing pattern (export `data` and `execute`).
4. Run and test in a dev guild.
5. Open a pull request back to `baqqa/Aldebaran` with a clear description of the change.

When adding commands:
- Add unit or integration tests where applicable.
- Keep sensitive keys out of source control — use `.env` or secrets managers.

## Security & best practices

- Never commit tokens or `.env` files.
- Limit admin-only commands to the bot owner or trusted roles.
- Rotate tokens if you suspect a leak.

## License & Contact

Maintainer: baqqa  
Repository: https://github.com/baqqa/Aldebaran

License: (choose and include a license file — e.g., MIT)  

---

Notes about this README:
- This README was tailored by scanning the project structure and source files in the repository. It documents the command folders and command files found (dnd, memes, music, utility) with summaries, usage, and implementation notes.
- If you want, I can produce an `.env.example`, a Dockerfile, or a deploy script adapted to your chosen hosting provider — just indicate which one and I'll produce the file.
