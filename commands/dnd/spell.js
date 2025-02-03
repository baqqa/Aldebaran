const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');


module.exports = {
  cooldown:5,
	data: new SlashCommandBuilder()
		.setName('spell')
		.setDescription('Search for any dnd 5e spell.')
    .addStringOption(option =>
      option.setName('spell')
      .setDescription('Write the name of the spell in english.')
      .setRequired(true)),

	async execute(interaction) {
    const Spell = interaction.options.getString('spell').toLowerCase();
    const MainInput = Spell.replace(/\s+/g, '-');
    const Url = `https://www.dnd5eapi.co/api/spells/${MainInput}`    
  axios
    .get(Url)
    .then((monsterResponse) => {
    const spellData = monsterResponse.data;
    console.log(spellData)
    const exampleEmbed = new EmbedBuilder()
	.setColor(0xFF0000)
	.setTitle(spellData.name)
	.setURL('https://discord.js.org/')
	.setAuthor({ name: 'DnD Spells', iconURL: 'https://www.cegliacarola.it/wp-content/uploads/2023/05/logo_principale2-2000x941.png'})
  .setDescription(spellData.desc.toString())
  .setFields(
    {name: 'Range:', value: spellData.range.toString()},
    {name: 'Components:', value: spellData.components.join(", ")},
    {name: 'Duration:', value: spellData.duration.toString()},
    {name: 'Casting time:', value: spellData.casting_time.toString()},
    {name: 'Spell level:', value: spellData.level.toString()},
  )
  .setFooter({ text: 'D&D 5e SRD API', iconURL: 'https://www.cegliacarola.it/wp-content/uploads/2023/05/logo_principale2-2000x941.png'});  

  if(spellData.material){
    exampleEmbed.addFields( {name: 'Material:', value: spellData.material.toString()},)
  }
  if(spellData.ritual){
    exampleEmbed.addFields({name: 'Ritual', value: spellData.ritual.toString()},)
  }
  if(spellData.concetration){
    exampleEmbed.addFields({name: 'Concentration:', value: spellData.concetration.toString()},)
  }
  if(spellData.higher_level.length === 0){
    console.log("wtf")
  }else if(spellData.higher_level){
    exampleEmbed.addFields({name: 'At higher levels', value: spellData.higher_level.toString()})
  }
  if(spellData.dc){
    exampleEmbed.addFields({name: "DC type:", value:`${spellData.dc.dc_type.name} - damage on save: ${spellData.dc.dc_success}`},)
  }
    interaction.reply({ embeds: [exampleEmbed] })
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
              interaction.reply("I'm sorry, i couldn't find the spell your looking for, try a different name.");
          } else {
              console.error(error);
              interaction.reply('There was a problem searching your spell, please contact an admin.');
          }
      });
}}

