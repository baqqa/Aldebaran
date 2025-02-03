const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

let memeTemplatesCache = null;
let lastCacheTime = 0;
const CACHE_DURATION = 3600000; // 1 hour

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('list_memes')
    .setDescription('Lists available meme templates for generating memes'),

  async execute(interaction) {
    try {
      // Refresh meme templates cache if expired
      if (!memeTemplatesCache || Date.now() - lastCacheTime > CACHE_DURATION) {
        const { data } = await axios.get('https://api.imgflip.com/get_memes');
        if (data.success) {
          memeTemplatesCache = data.data.memes;
          lastCacheTime = Date.now();
        } else {
          return interaction.reply({ content: 'Failed to fetch meme templates from Imgflip.', ephemeral: true });
        }
      }

      let page = 0;
      const templatesPerPage = 10;
      const totalPages = Math.ceil(memeTemplatesCache.length / templatesPerPage);

      const generateEmbed = (page) => {
        const start = page * templatesPerPage;
        const end = start + templatesPerPage;
        const memeList = memeTemplatesCache.slice(start, end)
          .map((m, i) => `*${start + i + 1}.* ${m.name} - **ID:** \`${m.id}\``)
          .join('\n');

        return new EmbedBuilder()
          .setColor(0x00AE86)
          .setTitle(`Meme Templates (Page ${page + 1}/${totalPages})`)
          .setDescription(memeList)
          .setFooter({ text: 'Use the template **ID** with /generate_meme in the **Template** field' });
      };

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('prev_page')
            .setLabel('⬅️ Previous')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 0),
          new ButtonBuilder()
            .setCustomId('next_page')
            .setLabel('Next ➡️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === totalPages - 1),
        );

      const message = await interaction.reply({
        embeds: [generateEmbed(page)],
        components: [row],
        fetchReply: true,
      });

      const collector = message.createMessageComponentCollector({
        time: 60000, // 1 minute
      });

      collector.on('collect', async (btnInteraction) => {
        if (btnInteraction.user.id !== interaction.user.id) {
          return btnInteraction.reply({ content: "You're not allowed to use this button!", ephemeral: true });
        }

        if (btnInteraction.customId === 'prev_page' && page > 0) {
          page--;
        } else if (btnInteraction.customId === 'next_page' && page < totalPages - 1) {
          page++;
        }

        await btnInteraction.update({
          embeds: [generateEmbed(page)],
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId('prev_page')
                  .setLabel('⬅️ Previous')
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(page === 0),
                new ButtonBuilder()
                  .setCustomId('next_page')
                  .setLabel('Next ➡️')
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(page === totalPages - 1),
              ),
          ],
        });
      });

    } catch (error) {
      console.error('Error fetching meme templates:', error);
      return interaction.reply({ content: 'An error occurred while fetching meme templates.', ephemeral: true });
    }
  },
};
