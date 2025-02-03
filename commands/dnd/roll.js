const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	cooldown:5,
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a dice')
        .addIntegerOption(option => 
            option.setName('dadi')
                .setDescription('Number of dice to roll')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('facce')
                .setDescription('Number of sides on the dice')
                .setRequired(true)),
	async execute(interaction) {
		const numDice = interaction.options.getInteger('dadi');
		const numSides = interaction.options.getInteger('facce');
        const Mod = interaction.options.getInteger('modificatore');
		let result = [];
		for(let i = 0; i < numDice; i++) {
			result.push(Math.floor(Math.random() * numSides) + 1);
		}
		let sum = result.reduce((a, b) => a + b, 0);
		const rollEmbed = new EmbedBuilder()
		.setColor(0xF0FF00)
		.setTitle(`Tot: ${sum.toString()}`)
		.addFields({name: 'Number of dice', value: numDice.toString(), inline: true},)
		.addFields({name: 'Type of die', value:` d${numSides.toString()}`, inline: true},)
		.addFields({name: '--------', value:` ${result.join(", ")}`,},)
		await interaction.reply({embeds:[rollEmbed]});
	}
};
