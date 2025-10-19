# Aldebaran

Aldebaran — a Discord bot implemented in JavaScript.

This repository contains the source code for Aldebaran, a modular Discord bot built with Node.js. The bot is intended to be easy to run locally, deploy to a server (or container), and extend with new commands and event handlers.

> Repository: https://github.com/baqqa/Aldebaran  
> Language: JavaScript

---

Table of contents
- [Features](#features)
- [Requirements](#requirements)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Commands and structure](#commands-and-structure)
- [Running in development](#running-in-development)
- [Deployment](#deployment)
- [Logging & Monitoring](#logging--monitoring)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Security and best practices](#security-and-best-practices)
- [License](#license)
- [Contact](#contact)

---

## Features

- Lightweight Discord bot scaffold written in JavaScript.
- Modular command/event structure (easy to extend).
- Example commands and utilities (see `src/`).
- Ready for running locally or deploying to a process manager / container.

> Note: This README is intentionally generic. Update the commands and feature list below to match the actual capabilities implemented in `src/` if you want an exact command reference.

## Requirements

- Node.js 16.9+ (or later) — ensure compatibility with the Discord library version used.
- npm (or yarn)
- A Discord bot token (create an application and bot at https://discord.com/developers/applications)
- Optional: a database (MongoDB, Postgres, etc.) if your bot uses persistent storage.

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

3. Create an `.env` file in the project root (see [Configuration](#configuration) for variables).

4. Start the bot
   ```bash
   npm start
   ```
   For development with auto-reload (if configured):
   ```bash
   npm run dev
   ```

## Configuration

Create a `.env` file in the project root and add the required environment variables. Example:

```env
# Required
DISCORD_TOKEN=your-discord-bot-token
CLIENT_ID=your-application-client-id

# Optional / common
GUILD_ID=your-dev-guild-id       # useful for registering guild (dev) commands quickly
PREFIX=!                         # if the bot also supports prefix commands
MONGO_URI=mongodb://user:pass@host:port/dbname
NODE_ENV=development
```

Adjust the names above to match the variables used in your code. If your code expects different keys, update this file accordingly.

## Commands and structure

This project uses a modular pattern for commands and events. Typical layout:

- src/
  - commands/    — individual command files (e.g. ping.js, help.js)
  - events/      — Discord event handlers (ready, interactionCreate, messageCreate)
  - utils/       — helpers and shared utilities
  - index.js     — bot entrypoint / bootstrapping logic

Common commands you may find or implement:
- /ping — respond with latency (pong).
- /help — list available commands.
- /info — bot information and uptime.
- admin-only commands — reload commands, set config, etc. (use only for trusted users)

To generate an accurate command list for the README, run a quick inspection of `src/commands` and copy each command's name and description here.

## Running in development

- Use nodemon / ts-node-dev (if already configured) to auto-reload on changes:
  ```bash
  npm run dev
  ```

- Use a dedicated test guild for registering and testing slash commands to avoid rate limits when developing.

## Deployment

Common deployment options:

- Process manager (PM2)
  ```bash
  npm install -g pm2
  pm2 start npm --name aldebaran -- start
  ```

- Docker (example)
  1. Create a Dockerfile (example)
     ```dockerfile
     FROM node:18-alpine
     WORKDIR /app
     COPY package*.json ./
     RUN npm ci --production
     COPY . .
     ENV NODE_ENV=production
     CMD ["node", "index.js"]
     ```
  2. Build and run
     ```bash
     docker build -t aldebaran .
     docker run -d --env-file .env --name aldebaran aldebaran
     ```

- Cloud providers: Render, Fly, Heroku, AWS, GCP — ensure you set env variables securely and enable appropriate intents.

## Logging & Monitoring

- Print essential events (bot started, errors connecting, failed command handlers).
- Capture unhandled rejections and uncaught exceptions to avoid silent failures.
- Consider integrating a logging service or Sentry for production error tracking.

## License

This project is provided under the MIT License.
