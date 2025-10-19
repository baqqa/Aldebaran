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
        //.setThumbnail('https://example.com/fact-icon.png') // Add a relevant icon or image
        .addFields(
            { name: '/monster', value: 'esempio: /monster -monster name- zombie | risponderà con una scheda, immagine e abilità del mostro, deve essere un mostro dal manuale ufficiale ed in inglese.', inline: true },
            { name: '/npcgen', value: 'esempio: /npcgen -level- 5 | dopo il commando slash, il numero da inserire è il livello, verrà generata una scheda random di un npc del livello scelto, la classe, razza, hp, maestrie e carattaristiche saranno tutte generate di conseguenza.', inline: true },
            { name: '/roll', value: 'esempio: /roll -dadi- 1 -facce- 20 | Per tirare un dado, dopo il commando scegli il numero di dadi e quante facce.', inline: true},
        )
        //.setImage('https://example.com/fun-background.png') // A larger image for visual appeal
        .setFooter({
         text: 'Hey, I still won’t tell you my secrets...',
        })
        .setTimestamp(); // Adds the current timestamp to the footer

    interaction.reply({ embeds: [Embed] });
    }
    };