const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { spawn } = require('child_process');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const queue = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song or playlist in your voice channel')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song name, YouTube URL, or playlist URL')
                .setRequired(true)),
    async execute(interaction) {
        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true });
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            return interaction.reply({ content: 'I need permission to join and speak in your voice channel!', ephemeral: true });
        }

        const query = interaction.options.getString('query');
        await interaction.deferReply();

        let urls = [];
        if (query.startsWith('https://www.youtube.com/playlist?')) {
            try {
                const ytDlpProcess = spawn('yt-dlp', ['--flat-playlist', '-j', query]);
                const playlistData = await new Promise((resolve, reject) => {
                    let result = '';
                    ytDlpProcess.stdout.on('data', data => result += data.toString());
                    ytDlpProcess.stderr.on('data', err => reject(err.toString()));
                    ytDlpProcess.on('close', () => {
                        const videos = result.trim().split('\n').map(JSON.parse);
                        resolve(videos.map(video => `https://www.youtube.com/watch?v=${video.id}`));
                    });
                });
                urls = playlistData;
            } catch (error) {
                console.error('Playlist Fetch Error:', error);
                return interaction.followUp({ content: 'Could not fetch the playlist.', ephemeral: true });
            }
        } else {
            let url = query.startsWith('https://www.youtube.com/') ? query : null;
            if (!url) {
                try {
                    const ytDlpSearch = spawn('yt-dlp', ['ytsearch1:' + query, '--get-id']);
                    const searchResult = await new Promise((resolve, reject) => {
                        let result = '';
                        ytDlpSearch.stdout.on('data', data => result += data.toString());
                        ytDlpSearch.stderr.on('data', err => reject(err.toString()));
                        ytDlpSearch.on('close', () => resolve(result.trim()));
                    });
                    url = `https://www.youtube.com/watch?v=${searchResult}`;
                } catch (error) {
                    console.error('Search Error:', error);
                    return interaction.followUp({ content: 'Could not find the song.', ephemeral: true });
                }
            }
            urls.push(url);
        }

        let serverQueue = queue.get(interaction.guild.id);
        if (!serverQueue) {
            serverQueue = {
                songs: [],
                player: createAudioPlayer(),
                connection: null,
                loop: false,
                collector: null // Add collector reference
            };
            queue.set(interaction.guild.id, serverQueue);
        }

        serverQueue.songs.push(...urls);

        if (!serverQueue.connection) {
            playSong(interaction, serverQueue, voiceChannel);
        } else {
            interaction.followUp({ content: `Added ${urls.length} song(s) to queue.` });
        }
    }
};

async function playSong(interaction, serverQueue, voiceChannel) {
    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    serverQueue.connection = connection;
    const song = serverQueue.songs.shift();
    if (!song) {
        connection.destroy();
        queue.delete(interaction.guild.id);
        return;
    }

    try {
        const ytDlpProcess = spawn('yt-dlp', ['-o', '-', '-f', 'bestaudio', song]);
        const resource = createAudioResource(ytDlpProcess.stdout);
        serverQueue.player.play(resource);
        connection.subscribe(serverQueue.player);

        serverQueue.player.on(AudioPlayerStatus.Idle, () => {
            if (!serverQueue.loop) {
                playSong(interaction, serverQueue, voiceChannel);
            } else {
                serverQueue.songs.unshift(song);
                playSong(interaction, serverQueue, voiceChannel);
            }
        });

        serverQueue.player.on('error', error => {
            console.error('Player error:', error.message);
            playSong(interaction, serverQueue, voiceChannel);
        });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setLabel('⏭ Skip')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('loop')
                    .setLabel('🔁 Loop')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setLabel('⏹ Stop')
                    .setStyle(ButtonStyle.Danger)
            );

        const message = await interaction.followUp({ content: `Now playing: ${song}`, components: [row] });

        // Stop previous collector if it exists
        if (serverQueue.collector) {
            serverQueue.collector.stop();
        }

        // Create a new collector and store it
        const collector = message.createMessageComponentCollector();
        serverQueue.collector = collector;

        collector.on('collect', async (btnInteraction) => {
            if (btnInteraction.customId === 'skip') {
                serverQueue.player.stop();
                await btnInteraction.update({ content: '⏭ Skipping the song...', components: [] });
            }
            if (btnInteraction.customId === 'loop') {
                serverQueue.loop = !serverQueue.loop;
                await btnInteraction.update({ content: `🔁 Looping is now ${serverQueue.loop ? 'enabled' : 'disabled'}.`, components: [] });
            }
            if (btnInteraction.customId === 'stop') {
                serverQueue.songs = [];
                serverQueue.connection.destroy();
                queue.delete(interaction.guild.id);
                await btnInteraction.update({ content: '⏹ Stopped playback and disconnected.', components: [] });
            }
        });

    } catch (error) {
        console.error('Error playing song:', error.message);
        queue.delete(interaction.guild.id);
    }
}
