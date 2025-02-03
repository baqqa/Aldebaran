const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('funfact')
    .setDescription('Wanna know something useless?'),

  async execute(interaction) {
    const Url = `https://uselessfacts.jsph.pl/api/v2/facts/random?language=en`;

    axios
      .get(Url)
      .then(async (factResponse) => {
        const Fact = factResponse.data.text; // Extract the fact text
        console.log(Fact);

          const exampleEmbed = new EmbedBuilder()
          .setColor(0x1F8B4C) // A visually appealing greenish-blue
          .setTitle("✨ Here's a Fact for You! ✨")
          .setDescription(`🌟 **${Fact}** 🌟`) // Adds a little flair to the fact text
          //.setThumbnail('https://example.com/fact-icon.png') // Add a relevant icon or image
          .addFields(
            { name: 'Did you know?', value: 'This fact might surprise you!', inline: true },
            { name: 'Want more?', value: 'Use `/funfact` to get another one!', inline: true }
          )
          //.setImage('https://example.com/fun-background.png') // A larger image for visual appeal
          .setFooter({
            text: 'Hey, I still won’t tell you my secrets...',
            //iconURL: 'https://example.com/mystery-icon.png', // Add a small icon next to the footer text
          })
          .setTimestamp(); // Adds the current timestamp to the footer
        
        interaction.reply({ embeds: [exampleEmbed] });
        } 
      )
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          interaction.reply("I'm sorry, I couldn't find the fact you're looking for.");
        } else {
          console.error(error);
          interaction.reply('There was a problem fetching the fact, please contact an admin.' + error);
        }
      });
  },
};
