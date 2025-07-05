const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const {config} = require("dotenv");
const imgFlipUsername = process.env.imgFlipUsername;
const imgFlipPassword = process.env.imgFlipPassword;

let memeTemplatesCache = null; // Cache templates in memory
let lastCacheTime = 0; // Store the time of last cache update
const CACHE_DURATION = 3600000; // Cache duration: 1 hour

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('generate_meme')
    .setDescription('Generate a meme with custom text')
    .addStringOption(option =>
      option.setName('template')
        .setDescription('Enter a meme template ID (Use /list_memes to see options)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('top_text')
        .setDescription('Text for the top of the meme')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('bottom_text')
        .setDescription('Text for the bottom of the meme')
        .setRequired(false)),

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

      // Retrieve user input
      const templateId = interaction.options.getString('template').trim();
      const topText = interaction.options.getString('top_text') || '';
      const bottomText = interaction.options.getString('bottom_text') || '';

      // Validate template ID
      const selectedTemplate = memeTemplatesCache.find(t => t.id.toString() === templateId);
      if (!selectedTemplate) {
        return interaction.reply({ content: 'Invalid template ID. Use /list_memes to see available templates.', ephemeral: true });
      }

      // Make a request to generate meme
      const { data } = await axios.post(
        'https://api.imgflip.com/caption_image',
        new URLSearchParams({
          template_id: templateId,
          username: imgFlipUsername,
          password: imgFlipPassword,
          text0: topText,
          text1: bottomText,
        })
      );

      if (data.success) {
        const memeUrl = data.data.url;

        const memeEmbed = new EmbedBuilder()
          .setColor(0x00AE86)
          .setTitle('Here’s your meme!')
          .setDescription(`Template: ${selectedTemplate.name}`)
          .setImage(memeUrl)
          .setFooter({ text: 'Meme generated via Imgflip' });

        return interaction.reply({ embeds: [memeEmbed] });
      } else {
        return interaction.reply({ content: 'Failed to generate meme. Please try again later.', ephemeral: true });
      }
    } catch (error) {
      console.error('Error generating meme:', error);
      return interaction.reply({ content: 'An error occurred while generating the meme.', ephemeral: true });
    }
  },
};
