<div align="center">
<p align="center">
  <img src="/aldebaran logo.png" alt="Aldebaran Logo" width="200"/>
</p>
<h1>
Aldebaran
</h1>

[![GitHub license](https://img.shields.io/github/license/baqqa/Aldebaran)](https://github.com/baqqa/Aldebaran/blob/main/LICENSE)
[![Node.js Version](https://img.shields.io/node/v/discord.js)](https://nodejs.org/)
[![Discord.js Version](https://img.shields.io/github/package-json/dependency-version/baqqa/Aldebaran/discord.js)](https://discord.js.org/)
[![GitHub issues](https://img.shields.io/github/issues/baqqa/Aldebaran)](https://github.com/baqqa/Aldebaran/issues)
[![GitHub stars](https://img.shields.io/github/stars/baqqa/Aldebaran)](https://github.com/baqqa/Aldebaran/stargazers)

**A powerful, modular Discord bot built with JavaScript featuring D&D utilities, music playback, memes, and more!**

[Features](#-features) • [Installation](#-quick-start) • [Commands](#-commands-by-folder) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents
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

<p align="center">
  <img src="https://raw.githubusercontent.com/baqqa/Aldebaran/refs/heads/main/banner.png" alt="Aldebaran Banner" width="100%">
</p>

## ✨ Features

- 🎯 **Slash Commands** - Modern Discord slash command interface powered by discord.js
- 📁 **Modular Architecture** - Clean folder structure for easy command organization
- 🐉 **D&D Utilities** - Monster lookups, NPC generators, and spell references
- 🎵 **Music Playback** - Stream music from YouTube with queue support
- 😂 **Meme Generation** - Create memes with built-in templates
- 🛠️ **Utility Commands** - Helpful tools like fun facts, server info, and more
- ⚡ **Performance** - Efficient command loading with cooldown management

## 📋 Requirements

Before running Aldebaran, ensure you have the following installed:

| Requirement | Version | Purpose |
|-------------|---------|---------|
| 📦 **Node.js** | 16+ (LTS recommended) | Runtime environment |
| 📥 **npm/yarn** | Latest | Package management |
| 🤖 **Discord Bot Token** | - | Bot authentication |
| 🎵 **yt-dlp** | Latest | Music streaming (optional) |
| 🎬 **FFmpeg** | Latest | Audio processing (optional) |
| 🌐 **Internet Access** | - | External API calls |

## 🚀 Quick Start

Get Aldebaran up and running in just a few steps:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/baqqa/Aldebaran.git
cd Aldebaran
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Configuration
Create a `.env` file in the root directory:
```env
DISCORD_TOKEN=your-discord-bot-token
clientId=your-application-client-id
GUILD_ID=your-dev-guild-id          # Optional for development
```

### 4️⃣ Deploy Commands
```bash
node deploy-commands.js
```

### 5️⃣ Start the Bot
```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

> 🎉 **That's it!** Your bot should now be online and ready to use.

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | ✅ | Your Discord bot token |
| `clientId` | ✅ | Your Discord application client ID |
| `GUILD_ID` | ❌ | Development guild ID (for faster command deployment) |
| `MONGO_URI` | ❌ | MongoDB connection string (if using database features) |
| `NODE_ENV` | ❌ | Environment (`development`/`production`) |

### Example `.env` file:
```env
DISCORD_TOKEN=your-discord-bot-token
clientId=your-application-client-id
GUILD_ID=your-dev-guild-id
MONGO_URI=mongodb://user:pass@host:port/dbname
NODE_ENV=development
```

> ⚠️ **Important:** Keep your `.env` file secure and never commit it to version control!

## 🎮 Commands (by folder)

Aldebaran organizes commands into logical folders under the `commands/` directory. Each command is a module that exports a `data` (SlashCommandBuilder) and an `execute` function, with optional `cooldown` properties.

### 🐉 D&D Commands
<details>
<summary>Click to expand D&D utilities</summary>

#### `/monster`
- **Description:** 📖 Fetch D&D Monster Manual stat blocks
- **Usage:** `/monster name:<monster name>`
- **Cooldown:** 5 seconds
- **Features:** API-powered monster lookup with embedded stat blocks

#### `/npcgen`
- **Description:** 🎭 Generate random NPCs with complete stat sheets
- **Usage:** `/npcgen level:<1-20>`
- **Cooldown:** 5 seconds
- **Features:** Random names, classes, races, and ability scores

</details>

### 😂 Meme Commands
<details>
<summary>Click to expand meme utilities</summary>

#### `/list_memes`
- **Description:** 📋 Browse available meme templates
- **Usage:** `/list_memes`
- **Features:** 1-hour caching, interactive pagination

#### `/generate_meme`
- **Description:** 🖼️ Create custom memes
- **Usage:** `/generate_meme template:<template> text:<your text>`
- **Features:** Multiple templates, custom text overlay

</details>

### 🎵 Music Commands
<details>
<summary>Click to expand music features</summary>

#### `/play`
- **Description:** 🎶 Stream music from YouTube
- **Usage:** `/play query:<song name | youtube url | playlist url>`
- **Features:** 
  - YouTube search and direct URLs
  - Playlist support with queue expansion
  - Voice channel management
  - High-quality audio streaming via yt-dlp
- **Requirements:** Bot needs CONNECT and SPEAK permissions

</details>

### 🛠️ Utility Commands
<details>
<summary>Click to expand utility features</summary>

#### `/funfact`
- **Description:** 🧠 Get random interesting facts
- **Usage:** `/funfact`
- **Cooldown:** 5 seconds

#### `/help`
- **Description:** ℹ️ Display available commands
- **Usage:** `/help`
- **Features:** Comprehensive command overview

#### `/ping`
- **Description:** 🏓 Check bot latency
- **Usage:** `/ping`

#### `/server`
- **Description:** 🏠 Display server information
- **Usage:** `/server`

#### `/user`
- **Description:** 👤 Show user profile
- **Usage:** `/user [target_user]`

</details>

### 📝 Adding New Commands

When creating new commands, follow this structure:

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commandname')
        .setDescription('Command description'),
    cooldown: 5, // Optional: seconds between uses
    async execute(interaction) {
        // Your command logic here
    },
};
```

## 🔧 How Commands Work

### Command Loading Process
1. **Bootstrap** - `index.js` reads the `commands/` folder recursively
2. **Registration** - Each command exports `data` and `execute` functions  
3. **Storage** - Commands are stored in `client.commands` collection
4. **Deployment** - `deploy-commands.js` registers commands with Discord API

### Command Registration
```bash
# Guild-specific (instant updates)
node deploy-commands.js

# Global commands (up to 1 hour to propagate)
# Modify deploy-commands.js for global registration
```

## 🎵 Voice & Media Setup

### Music Playback Requirements

The music functionality requires additional setup:

| Component | Purpose | Installation |
|-----------|---------|--------------|
| 🎵 **yt-dlp** | YouTube content extraction | `pip install yt-dlp` |
| 🎬 **FFmpeg** | Audio transcoding | [Download FFmpeg](https://ffmpeg.org/download.html) |

### Discord Bot Permissions

Ensure your bot has these intents enabled in the Discord Developer Portal:

- ✅ **Guilds** - Basic server operations
- ✅ **Guild Voice States** - Voice channel management  
- ✅ **Guild Messages** - Message handling (if needed)

### Required Bot Permissions
- `CONNECT` - Join voice channels
- `SPEAK` - Play audio in voice channels
- `USE_SLASH_COMMANDS` - Execute slash commands

## 💡 Development Tips

### Best Practices
- 🧪 **Testing** - Use a test guild (`GUILD_ID`) for instant command deployment
- 🐛 **Debugging** - Add `console.log` statements in command modules and event handlers
- ⚡ **Performance** - Keep long-running operations async and defer interaction replies
- 💾 **Persistence** - Music queues are in-memory; implement storage for cross-restart persistence

### Code Structure
```
Aldebaran/
├── commands/           # Slash commands organized by category
│   ├── dnd/           # D&D utilities
│   ├── memes/         # Meme generation
│   ├── music/         # Audio playback
│   └── utility/       # General utilities
├── events/            # Discord.js event handlers
├── deploy-commands.js # Command registration script
└── index.js          # Main bot entry point
```

## 🔧 Troubleshooting

### Common Issues

<details>
<summary>🚫 Bot Won't Start</summary>

- ✅ Verify `DISCORD_TOKEN` is valid and present in `.env`
- ✅ Confirm `node_modules` are installed (`npm install`)
- ✅ Check Node.js version (requires 16+)
- ✅ Ensure all required environment variables are set

</details>

<details>
<summary>👻 Slash Commands Not Visible</summary>

- ✅ Run command deployment: `node deploy-commands.js`
- ✅ For global commands, wait up to 1 hour for propagation
- ✅ Use guild registration for instant updates during development
- ✅ Verify bot has `applications.commands` scope

</details>

<details>
<summary>🎵 Music Playback Issues</summary>

- ✅ Install `yt-dlp`: `pip install yt-dlp`
- ✅ Ensure `ffmpeg` is in your system PATH
- ✅ Check bot has `CONNECT` and `SPEAK` permissions
- ✅ Verify user is in a voice channel before using `/play`

</details>

<details>
<summary>🌐 API Call Failures</summary>

- ✅ Check internet connectivity
- ✅ Verify API endpoints are accessible
- ✅ Review rate limits and API quotas
- ✅ Check firewall settings

</details>

## 🤝 Contributing

We welcome contributions from the community! Here's how to get involved:

### 🔄 Contribution Workflow

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch: `git checkout -b feat/your-feature`
3. **🛠️ Develop** following the existing patterns
4. **🧪 Test** in a development guild
5. **📬 Submit** a pull request with a clear description

### 📋 Contribution Guidelines

- ✅ Export `data` and `execute` functions for new commands
- ✅ Add appropriate cooldowns where necessary
- ✅ Include unit tests when applicable
- ✅ Keep sensitive information in environment variables
- ✅ Follow existing code style and structure
- ✅ Update documentation for new features

### 🛡️ Security Best Practices

- 🔒 **Never commit** `.env` files or tokens to version control
- 🔑 **Rotate tokens** immediately if compromised
- 👥 **Limit admin commands** to authorized users only
- 🛡️ **Validate inputs** to prevent injection attacks
- 📝 **Review dependencies** regularly for security updates

---

## 📄 License & Contact

<div align="center">

**Maintainer:** [baqqa](https://github.com/baqqa)  
**Repository:** [github.com/baqqa/Aldebaran](https://github.com/baqqa/Aldebaran)  
**License:** MIT

### 💬 Get Help

[![Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github&logoColor=white)](https://github.com/baqqa/Aldebaran/issues)

---

⭐ **Star this repository if you found it helpful!** ⭐

</div>

