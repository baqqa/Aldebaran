const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');


module.exports = {
  cooldown:5,
	data: new SlashCommandBuilder()
  //Command name
		.setName('monster')
    //Command Descritprtion
		.setDescription('Print the stat block of ay monster in the dnd monster manual.')
    //Adding options like inputs, in this case the monster name.
    .addStringOption(option =>
      option.setName('name')
      .setDescription("Input the monster's name")
      .setRequired(true)),

	async execute(interaction) {
    const Mostrone = interaction.options.getString('name').toLowerCase();
    const MainInput = Mostrone.replace(/\s+/g, '-');
    const Url = `https://www.dnd5eapi.co/api/monsters/${MainInput}`    
  axios
    .get(Url)
    .then((monsterResponse) => {
    const monsterData = monsterResponse.data;
   //Embed builder for first half of monster stats 
const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle(monsterData.name)
	.setAuthor({ name: 'DnD Monsters', url: 'https://5e-bits.github.io/docs/' })
  .addFields(
    {name: 'AC:', value: monsterData.armor_class[0].value.toString(), inline: true},
    {name: 'HP:', value: monsterData.hit_points.toString(), inline: true},
    {name: 'Speed:', value: monsterData.speed.walk.toString(), inline: true},
    {name: 'Size:', value: monsterData.size, inline: true},
    {name: 'Type:', value: monsterData.type, inline: true},
    {name: 'Align:', value: monsterData.alignment, inline: true},
  )
	//.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Str', value: monsterData.strength.toString(), inline: true },
		{ name: 'Dex', value: monsterData.dexterity.toString() , inline: true },
		{ name: 'Con', value: monsterData.constitution.toString() , inline: true }, 
		{ name: 'Int', value: monsterData.intelligence.toString() , inline: true },
		{ name: 'Wis', value: monsterData.wisdom.toString() , inline: true },
		{ name: 'Char', value: monsterData.charisma.toString() , inline: true },

	)
  .setImage(`https://www.dnd5eapi.co/api/images/monsters/${MainInput}.png`)
  
   //Embed builder for Second half of monster stats 
  const AbilityEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTimestamp()
    .setFooter({ text: 'D&D 5e SRD API', iconURL: 'https://www.cegliacarola.it/wp-content/uploads/2023/05/logo_principale2-2000x941.png'});  
  // Add special abilites
  if (monsterData.special_abilities.length === 0) {
    console.log('wtf')
  }else if (monsterData.special_abilities){   
    AbilityEmbed.addFields({name: 'Special Abilities', value: '---------------------------------'});  
    monsterData.special_abilities.forEach(ability => {
      AbilityEmbed.addFields({name: ability.name, value: ability.desc});
    });
  }
  // Add actions
  if (monsterData.actions) {
    AbilityEmbed.addFields({name: 'Actions', value: '---------------------------------'});
    monsterData.actions.forEach(action => {
      AbilityEmbed.addFields({name: action.name, value: action.desc});
    });
  }
  // Add legendary actions
  if (monsterData.legendary_actions.length === 0) {
    console.log('wtf');
  }else if(monsterData.legendary_actions){
    AbilityEmbed.addFields({name: 'Legendary Actions',value: '---------------------------------'});
    monsterData.legendary_actions.forEach(action => {
      AbilityEmbed.addFields({name: action.name, value: action.desc});
    });
  }
  //Printing the command
    interaction.reply({ embeds: [exampleEmbed, AbilityEmbed] })
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
              interaction.reply("I'm sorry, i couldn't find the monster your looking for, try a different name.");
          } else {
              console.error(error);
              interaction.reply('There was a problem searching your monster, please contact an admin.');
          }
      });
}}

