/* INFOS
Pour rajouter des valeurs par défaut sur les membres, c'est dans Commands/add.js
*/

// Charge les modules alias
require('module-alias/register');
const https = require("https");

//HEALTH CHECK UP DE L'APPLICATION
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000; // Utilisez la variable d'environnement PORT fournie par Heroku ou un port par défaut

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Le serveur est en écoute sur le port ${PORT}`);
});
//FIN DE HEALTH CHECK UP DE L'APPLICATION

require('dotenv').config();

const isDev = process.env.DEV_MODE === 'true';
const botSettings = require(isDev ? './settings-dev.js' : './settings.js');

const {dateFormatLog} = require('./Helpers/logTools');

const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799) // Indents used for the bot
const bot = new Discord.Client({intents});

bot.rolePermissions = {
  "Le Parrain": 7,
  "Loutre Lanceuse de Pantoufles": 6,
  "Loutre Sottocapo": 5,
  "Enrôloutre": 4,
  "Loutre Mafieuse": 3,
  //"Loutre Naissante": 2
};

const loadCommands = require('./Loader/loadCommands');
const loadEvents = require('./Loader/loadEvents');
const loadDatabase = require('./Loader/loadDatabase');

const loadSlashCommands = require('./Loader/loadSlashCommands');

const timestamp = new Date().toISOString();

bot.color = "#95A5A6" // Set bot color

bot.commands = new Discord.Collection(); // Create collection of commands

console.log(timestamp + ': Connexion à Discord...')
bot.login(process.env.DISCORD_TOKEN); // Login to Discord
console.log('Connexion validée !')

bot.db = loadDatabase()
bot.settings = botSettings

// Fonction utilitaire pour savoir si une fonctionnalité est activée
bot.featureEnabled = (name) => {
  return bot.settings.features?.[name] !== false;
}

// Vérifie si une commande est activée
bot.commandEnabled = (name) => {
  return bot.settings.commandToggles?.[name] !== false;
}

loadCommands(bot); // Load all commands in collection, to the bot
loadEvents(bot); // Load all commands in collection, to the bot


// Configuration des flux RSS et des canaux
const { checkRSS } = require('./Helpers/rssHandler');
const RSS_FEEDS = [
  { url: 'https://fr.finalfantasyxiv.com/lodestone/news/news.xml' }, // Canal de maintenance
  { url: 'https://fr.finalfantasyxiv.com/lodestone/news/topics.xml' }  // Canal des annonces importantes
];

//Pour les best-of des quotes
const { createMonthlyBestOf } = require('@helpers/createMonthlyBestOf');

// Quand le bot est prêt et connecté
bot.on('ready', () => {
    console.log(`Bot opérationnel sous le nom: ${bot.user.tag}!`);
    if(process.env.GITHUB_BRANCH === 'main'){
    // Envoyer un message dans le serveur et le channel spécifiés
    const guild = bot.guilds.cache.get(bot.settings.mainGuildId);
    if (guild) {
        const channel = guild.channels.cache.get(bot.settings.channelId);
        if (channel) {
            channel.send('Je suis de nouveau là ! <:otter_pompom:747554032582787163>');
        } else {
            console.error('Channel non trouvé');
        }
    } else {
        console.error('Serveur non trouvé');
    }

    }
    bot.user.setActivity('GILLS', { type: 'WATCHING' });

    // Load slash commands
    loadSlashCommands(bot);

    // Vérifier les différents flux RSS Lodestone et le best-of mensuel
    setInterval(() => {
      if (bot.featureEnabled('rss')) {
        RSS_FEEDS.forEach(feed => {
          checkRSS(bot, feed.url);
        });
      }
      if (bot.featureEnabled('bestOfMonthly')) {
        createMonthlyBestOf(bot);
      }
    }, 15 * 60 * 1000); // Check toutes les 15m

    // Empêche le sleeping de Koyeb
    setInterval(() => {
      https.get("https://google.com", (res) => {
          //console.log("📡 Keep-alive ping envoyé ! Statut :", res.statusCode);
      }).on("error", (err) => {
          console.error("❌ Erreur Keep-Alive :");
      });
  }, 2 * 60 * 1000); // Toutes les 2 minutes
});

// SYSTEME DE CITATIONS
const saveQuote = require('./Helpers/quoteSystem');
// SYSTEME DE FEUR
const verifyWord = require('./Helpers/verifyWord')

bot.removeAllListeners('messageCreate');
// Avant d'ajouter le listener
//console.log(`Nombre de listeners pour 'messageCreate' avant ajout: ${bot.listenerCount('messageCreate')}`);
// Écouteur d'événements pour les nouveaux messages
bot.on('messageCreate', async (message) => {
  // Exceptions générales
  const exceptionsChannels = bot.settings.ids.exceptionsChannels;
  if (exceptionsChannels.includes(message.channel.id)) return; // Ne pas répondre aux messages de la Table ronde et de l'Antre mafieuse
  if (message.author.bot) return; // Ne pas répondre aux messages du bot lui-même
  if (message.mentions.everyone) return; // Ne pas traiter les messages qui mentionnent @everyone ou @here
  // Feature "feur" et "keen'v"
  // Appeler `verifyWord` quand un message est reçu
  const exceptionsUsers = bot.settings.ids.exceptionsUsers; // Sefa, Raziel, Velena
  if (bot.featureEnabled('verifyWord')) {
    if (!exceptionsUsers.includes(message.author.id)) await verifyWord(message, bot); // Ne pas répondre "feur" ou "keen'v" aux utilisateurs qui ont un totem d'immunité
  }
  // Feature "citation"
  // Appeler `saveQuote` quand un message est reçu
  if (bot.featureEnabled('quoteSystem')) {
    if(!message.mentions.has(bot.user)) return; // Ne pas traiter les messages qui ne mentionnent pas le bot

    await saveQuote(message, bot);
  }
});
// Après avoir ajouté le listener
//console.log(`Nombre de listeners pour 'messageCreate' après ajout: ${bot.listenerCount('messageCreate')}`);
 
// QUAND UN USER REJOINT LA GUILDE
const { welcomeMessage, assignRoles } = require('./Helpers/newMember');

bot.on('guildMemberAdd', async (member) => {
    try {
        // Appeler la fonction pour gérer le message de bienvenue
        if (bot.featureEnabled('welcomeMessage')) {
            await welcomeMessage(member, bot);
        }
        // Lui assigner ses rôles
        if (bot.featureEnabled('assignRoles')) {
            await assignRoles(member, bot);
        }
    } catch (error) {
        console.error('Erreur lors de l’accueil du nouveau membre :', error);
    }
});

// MESSAGE DE AU REVOIR
const goodbyeMessage = require('./Helpers/goodbyeMessage');
const { analyzeGame } = require('./GillSystem/kaazino');
bot.on('guildMemberRemove', async (member) => {
  console.log(`${member.displayName} a quitté le serveur ${member.guild.name}.`);
  if (bot.featureEnabled('goodbyeMessage')) {
    await goodbyeMessage(member, bot); // Appel de la fonction goodbyeMessage
  }
});


//When bot join a guild
bot.on('guildCreate', async (guild) => {
    await bot.function.linkGuildDB(bot, guild);
});

// Supprimer les écouteurs d'événements existants avant de vérifier le nombre de listeners, pour prévenir de certains bugs.
bot.removeAllListeners('interactionCreate');
// Avant d'ajouter le listener
//console.log(`Nombre de listeners pour 'interactionCreate' avant ajout: ${bot.listenerCount('interactionCreate')}`);
bot.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    //await interaction.deferReply({ ephemeral: true });

  if(interaction.type === Discord.InteractionType.ApplicationCommand) {
      if (!bot.commandEnabled(interaction.commandName)) {
        await interaction.reply({ content: 'Cette commande est désactivée.', ephemeral: true });
        return;
      }

      // Then take the command name
      let command = require(`./Commands/${interaction.commandName}`);
      console.log(await dateFormatLog() +  '- Commande: ' + command.name + ' par: ' + interaction.user.username);
      //Run the command
      command.run(bot, interaction, command.options);
  }
  };
  bot.hasInteractionCreateListener = true; // Marque que l'écouteur a été ajouté
})
// Après avoir ajouté le listener
//console.log(`Nombre de listeners pour 'interactionCreate' après ajout: ${bot.listenerCount('interactionCreate')}`);



// Pour les tests, auto update au lancement
//const updateMemberDAO = require('@websiteUtils/updateMemberDAO');
//updateMemberDAO(bot)


