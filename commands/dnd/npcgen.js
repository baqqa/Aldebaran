const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const generateName = require('../../namegenerator');
const axios = require('axios');


function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}



function charModifier(char){
  let mod;
  if(char === 10|| char === 11){
    mod = 0;
  }else if(char === 12|| char === 13){
    mod = 1;
  }else if(char === 14|| char === 15){
    mod = 2;
  }else if(char === 16|| char === 17){
    mod = 3;
  }else if(char === 18|| char === 19){
    mod = 4;
  }else if(char === 20){
    mod = 5;
  }
  return mod;
}

async function fetchData() {
  const weapons = await axios.get('https://api.open5e.com/v1/weapons/')
  console.log(weapons.data.results.map(e=>e))

  const classesResponse = await axios.get('https://www.dnd5eapi.co/api/classes/');
  const AllClasses = classesResponse.data.results.map(e => e.name);

  const racesResponse = await axios.get('https://www.dnd5eapi.co/api/races/');
  const AllRaces = racesResponse.data.results.map(race => race.name);

  
  const RandomClass = getRandomElement(AllClasses)
  const RandomRace = getRandomElement(AllRaces)
  const GeneratedName = generateName();

  const hpFinder = await axios.get(`https://www.dnd5eapi.co/api/classes/${RandomClass.toLowerCase()}`)
  
  let raceAgeMax;
  switch(RandomRace.toString()){
    case 'Dragonborn':
      raceAgeMax = 50;
      break;
    case 'Elf': 
      raceAgeMax = 730;
      break;
    case 'Half-Elf':
      raceAgeMax = 170;
      break;
    case 'Dwarf':
      raceAgeMax = 320;
      break;
    case 'Gnome':
      raceAgeMax= 430;
      break;
    case 'Halfling': 
      raceAgeMax = 130; 
      break;
    case 'Tiefling':
      raceAgeMax = 70;
      break;
    case 'Half-Orc':
      raceAgeMax = 55;
      break;
    case 'Human':
      raceAgeMax = 70;
      break;
      default:
        raceAgeMax = 80;
  }
  let age = [];
		for(let i = 0; i < 1; i++) {
			age.push(Math.floor(Math.random() * raceAgeMax) + 21);
		}
  const RandomAge = age.toString()

  function CharStatGen(){
    let char = [];
    for(let i = 0; i < 1; i++) {
			char.push(Math.floor(Math.random() * 10) + 10);
		}
    let sum = char.reduce((a, b) => a + b, 0);
    const tot = sum
    return tot;
  }
  const Str = CharStatGen();
  const Dex = CharStatGen();
  const Con = CharStatGen();
  const Int = CharStatGen();
  const Wis = CharStatGen();
  const Char = CharStatGen();

  const StrMod = charModifier(Str);
  const DexMod = charModifier(Dex);
  const ConMod = charModifier(Con);
  const IntMod = charModifier(Int);
  const WisMod = charModifier(Wis);
  const CharMod = charModifier(Char);

  return { RandomClass, RandomRace, GeneratedName, RandomAge, Int, Str, Dex, Con, Wis, Char, StrMod, DexMod, ConMod, IntMod, WisMod, CharMod, hpFinder };
}

module.exports = {
  cooldown:5,
	data: new SlashCommandBuilder()
		.setName('npcgen')
		.setDescription('Generates a random npc')
    .addIntegerOption(option => 
      option.setName('level')
          .setDescription('npc level')
          .setRequired(true)
          .setMaxValue(20)),
    async execute(interaction) {
      await interaction.deferReply();
      const inputLevel = interaction.options.getInteger('level')
      const { RandomClass, 
              RandomRace, 
              GeneratedName, 
              RandomAge, 
              Int, 
              Str, 
              Dex, 
              Con, 
              Wis, 
              Char, 
              StrMod, 
              DexMod, 
              ConMod, 
              IntMod, 
              WisMod, 
              CharMod,
              hpFinder
            } = await fetchData();
      const findClassLevel = await axios.get(`https://www.dnd5eapi.co/api/classes/${RandomClass.toLowerCase()}/levels/${inputLevel}`)
      const levelNpc = findClassLevel.data.level;
      const hpCalc = hpFinder.data.hit_die/2 + 1 + ConMod
      const hpNpc = hpCalc * levelNpc

      const inputLevelInt = parseInt(inputLevel);
      let proficiencyCalculator;
      switch (true) {
          case inputLevelInt <= 4:
              proficiencyCalculator = 2;
              break;
          case inputLevelInt >= 5 && inputLevelInt <= 8:
              proficiencyCalculator = 3;
              break;
          case inputLevelInt >= 9 && inputLevelInt <= 12:
              proficiencyCalculator = 4;
              break;
          case inputLevelInt >= 13 && inputLevelInt <= 16:
              proficiencyCalculator = 5;
              break;
          case inputLevelInt >= 17:
              proficiencyCalculator = 6;
              break;
          default:
              proficiencyCalculator = '-';
      }

      function getRandomSkills(options, choose) {
        const result = [];
        const remainingOptions = [...options]; // Create a copy of the original array
      
        while (result.length < choose && remainingOptions.length > 0) {
          const randomIndex = Math.floor(Math.random() * remainingOptions.length);
          const selectedItem = remainingOptions.splice(randomIndex, 1)[0];
          result.push(selectedItem);
        }
      
        return result;
      }

      const options = hpFinder.data.proficiency_choices[0].from.options;
      const choose = hpFinder.data.proficiency_choices[0].choose;
      const randomItems = getRandomSkills(options, choose)
      function listOfSkills(items){
        const SkillFinder = [];
        for (let i = 0; i < items.length; i++) {
        SkillFinder.push(items[i].item.name)
      }
      return SkillFinder;
      }
      const SkillList = listOfSkills(randomItems)

      const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(`Name: *${GeneratedName.toString()}*`)
        .addFields(
          {name: "Level: -------", value: levelNpc.toString(), inline: true},
          {name: "HP: -------", value: hpNpc.toString(), inline: true},
          {name: "Proficiencies: ---", value: SkillList.join('\n'), inline: true},
          {name: 'Age: -------', value: RandomAge.toString(), inline: true},
          {name: 'Race: -------', value: RandomRace.toString(), inline: true},
          {name: 'Class: -------', value: RandomClass.toString(), inline: true},
          {name: `**Characteristcs:**`, value: `[ Prof bonus: +${proficiencyCalculator} ]`},
          {name: 'Str:', value: `(${Str.toString()})\n +**${StrMod.toString()}**`, inline: true},
          {name: 'Dex:', value: `(${Dex.toString()})\n +**${DexMod.toString()}**`, inline: true},
          {name: 'Con:', value: `(${Con.toString()})\n +**${ConMod.toString()}**`, inline: true},
          {name: 'Int:', value: `(${Int.toString()})\n +**${IntMod.toString()}**`, inline: true},
          {name: 'Wis:', value: `(${Wis.toString()})\n +**${WisMod.toString()}**`, inline: true},
          {name: 'Char:', value: `(${Char.toString()})\n +**${CharMod.toString()}**`, inline: true},
        )
        await interaction.editReply({embeds: [exampleEmbed]});
    }}