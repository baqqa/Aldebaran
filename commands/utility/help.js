const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Command list'),


    async execute(interaction){
    const Embed = new EmbedBuilder()
        .setColor(0x1F8B4C)
        .setTitle("Ecco i commandi che Aldeberan accetta")
        .setDescription("magari un perfavore ogni tanto...")
        .addFields(
            { name: '/monster', value: 'esempio: /monster -monster name- zombie | risponderà con una scheda, immagine e abilità del mostro, deve essere un mostro dal manuale ufficiale ed in inglese.', inline: true },
            { name: '/npcgen', value: 'esempio: /npcgen -level- 5 | dopo il commando slash, il numero da inserire è il livello, verrà generata una scheda random di un npc del livello scelto, la classe, razza, hp, maestrie e carattaristiche saranno tutte generate di conseguenza.', inline: true },
            { name: '/roll', value: 'esempio: /roll -dadi- 1 -facce- 20 | Per tirare un dado, dopo il commando scegli il numero di dadi e quante facce.', inline: true},
            {name: '/roll', value: 'esempio: /spell -spell- | deve essere un incantesimo dal manuale ufficiale in ingelese.'},
            { name: '/generate_meme', value:'/generate_meme -template- -top_text- -bottom_text- | allows to generate a meme from the availabe /list_meme, bottom text is not needed on all.', inline: true},
            { name: '/play', vlaue: 'esempio: /play -youtube url- | si può mettere il link di un video individuale o il link di una playlist (se una playlist assicurati che ci sia la parola playlist nel url come: https://www.youtube.com/playlist?list=PLK95con', inline: true },
            { name: '/funFact', value: 'esempio: /funFact | Questo comando risponderà con un fatto a caso in inglese... boh così', inline: true},
            { name: '/help', value: '... è questo comando qui...', inline: true }
        )
        .setFooter({
         text: 'Hey, I still won’t tell you my secrets...',
        })
        .setTimestamp();

    interaction.reply({ embeds: [Embed] });
    }
    };