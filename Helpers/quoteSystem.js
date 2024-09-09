const e = require('express');
const db = require('../Loader/loadDatabase');
require('dotenv').config();


async function saveQuote(message, bot) {

const alreadySave = ["Je sais déjà qu'il a dis ça !",

]

const saveDone = ["C'est dans la boîte !",

]

const onlyMention = ["Tu veux quoi ? _(feur)_",

]

  // Vérifier si le bot est mentionné
  if (message.mentions.has(bot.user)) {
    // Vérifier si le message est une réponse à un autre message
    if (message.reference && message.reference.messageId) {
      const originalMessage = await message.channel.messages.fetch(message.reference.messageId);
      const discordUsername = originalMessage.author.username;
      const quoteContent = originalMessage.content;
      const quoteDate = originalMessage.createdAt;

      // Accéder à Firestore pour créer ou mettre à jour le document
      const profilesRef = db.collection('profiles');
      const userDocRef = profilesRef.doc(discordUsername);

      // Vérifier si le profil existe déjà
      const doc = await userDocRef.get();
      if (!doc.exists) {
          console.warn(`quoteSystem : Le profil de ${discordUsername} n'existe pas.`); // Met une indication dans la console (pq pas au channel admin)
        if(process.env.GITHUB_BRANCH === "main"){
          const channel = await bot.channels.fetch("1282684525259919462"); // Met une indication dans le channel admin MAIN
          await channel.send(`quoteSystem : Le profil pour ${discordUsername} n'existait pas et a été créé.`);    
        } else{
          const channel = await bot.channels.fetch("1252901298798460978"); // Met une indication dans le channel admin DEV
          await channel.send(`quoteSystem : Le profil pour ${discordUsername} n'existait pas et a été créé.`);    
        }
      }

      const quotesRef = userDocRef.collection('citations');

      // Vérifier si la citation existe déjà
      const existingQuotes = await quotesRef.where('quote', '==', quoteContent).get();
      if(!existingQuotes.empty) {
        const randomAlreadySave = alreadySave[Math.floor(Math.random() * alreadySave.length)]; // Phrase aléatoire de la liste alreadySave
        message.reply(randomAlreadySave);
        return;
      }

      // Sauvegarder la citation
      await quotesRef.add({
        quote: quoteContent,
        date: quoteDate
      });
      const randomSaveDone = saveDone[Math.floor(Math.random() * saveDone.length)]; // Phrase aléatoire de la liste saveDone
      message.reply(randomSaveDone);
      

    } else {
      // Si le bot est mentionné sans message de réponse
      const mentionedUsers = message.mentions.users.filter(user => user.id !== bot.user.id);
      if (mentionedUsers.size > 0) {
          // Prendre le premier utilisateur mentionné
        const mentionedUser = mentionedUsers.first();
        const discordUsername = mentionedUser.username;
        // Accéder à Firestore pour récupérer les citations de l'utilisateur mentionné
        const profilesRef = db.collection('profiles');
        const userDocRef = profilesRef.doc(discordUsername);
        const quotesRef = userDocRef.collection('citations');
        const quotesSnapshot = await quotesRef.get();

        if (!quotesSnapshot.empty) {
          // Convertir les documents en un tableau de citations
          const quotes = quotesSnapshot.docs.map(doc => doc.data().quote);
          // Sélectionner une citation aléatoire
          const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
          // Envoyer la citation aléatoire dans le canal
          message.reply(`"${randomQuote}" - ${discordUsername}`);
        } else {
          // Gérer le cas où l'utilisateur mentionné n'a pas de citations sauvegardées
          message.reply(`Aucune citation trouvée pour ${discordUsername}.`);
        }
      } else {
        // Gérer le cas où aucun utilisateur n'est mentionné avec le bot
        const randomOnlyMention = onlyMention[Math.floor(Math.random() * onlyMention.length)];
        message.channel.reply(randomOnlyMention);
      }
    }
  }
}

module.exports = saveQuote;