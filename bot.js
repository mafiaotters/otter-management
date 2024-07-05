require('dotenv').config();

const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799) // Indents used for the bot
const bot = new Discord.Client({intents});

const loadCommands = require('./Loader/loadCommands');
const loadEvents = require('./Loader/loadEvents');
const loadDatabase = require('./Loader/loadDatabase');

const loadSlashCommands = require('./Loader/loadSlashCommands');

const timestamp = new Date().toISOString();

bot.color = "#95A5A6" // Set bot color

bot.commands = new Discord.Collection(); // Create collection of commands
bot.function = {
    //All functions of bot should go here
    linkGuildDB: require('./Helpers/checkGuildComponent')
}

console.log(timestamp + ': Connexion à Discord...')
bot.login(process.env.DISCORD_TOKEN); // Login to Discord
console.log('Connexion validée !')


bot.db = loadDatabase()

loadCommands(bot); // Load all commands in collection, to the bot
loadEvents(bot); // Load all commands in collection, to the bot

// Quand le bot est prêt et connecté
bot.on('ready', () => {
    console.log(`Bot opérationnel sous le nom: ${bot.user.tag}!`);

    // Load slash commands
    loadSlashCommands(bot);
});

// TELECHARGEMENT DU SITE
const updateWebsite = require('./Helpers/updateWebsite');
const websiteUrl = 'https://github.com/Satalis/LOUTRES_SITE/';
const outputPath = './PublicWebsite';
updateWebsite(websiteUrl, outputPath); //- A REACTIVER QUAND LES TESTS SONT FINIS

// Quand un membre change de role
const handleRoleChange = require('./Events/handleRoleChange');
bot.on('guildMemberUpdate', (oldMember, newMember) => {
  handleRoleChange(bot, oldMember, newMember);
});



//When bot join a guild
bot.on('guildCreate', async (guild) => {
    await bot.function.linkGuildDB(bot, guild);
});