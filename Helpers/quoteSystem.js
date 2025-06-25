const e = require('express');
const db = require('@loader/loadDatabase');
require('dotenv').config();

const {dateFormatLog} = require('./logTools');

async function saveQuote(message, bot) {

  const botDevId = bot.settings.ids.botDevId;
  const botMainId = bot.settings.ids.botMainId;

const alreadySave = ["Je sais déjà qu'il a dis ça !",
  "C’est déjà dans les annales de la Mafia des Loutres ! ",
  "Pas besoin de l’ajouter deux fois, même si c’est brillant.",
  "Ça, c’est un écho du passé… déjà sauvegardé !",
  "Tu veux vraiment qu’on la sauvegarde deux fois ? Elle est bien, mais pas à ce point !",
  "Déjà archivé dans le grand tome des loutres, c’est du réchauffé.",
  "Encore cette phrase ? T’as un problème avec le spam ?",
  "Tu veux vraiment que je double ça ? Même Hydaelyn a une limite.",
  "La magie des loutres ne fait pas de doublons, désolé !",
  "Cette phrase est déjà dans notre cristal mémoriel, passe à autre chose.",
  "Une fois suffit, pas la peine de nous spammer avec ce chef-d'œuvre.",
  "Elle est bien, mais pas besoin de la voir deux fois, si ?",
  "Cette phrase est déjà un classique, inutile d’insister.",
  "Répéter, c’est bien… mais on est pas dans une quête FedEx, merci.",
  "Eh, même un mog pourrait se souvenir que c’est déjà noté. ",
  "Cette phrase est tellement vieille qu’elle est presque pré-Heavensward.",
  "Déjà enregistré, même si t’insistes, ce n’est pas une macro spammable."

]

const saveDone = ["Allez hop, j'enregistre sa phrase on la ressortira plus tard !",
  "Mission accomplie, l’écho est sauvegardé.",
  "Le message rejoint la grande tapisserie de la Mafia.",
  "Voilà, gravé dans le livre à Lavandière (22-36) !",
  "Une phrase de plus pour le Hall des Loutres. Merci ! ",
  "Le message est prêt à être ressorti dans une bonne vanne.",
  "Voilà qui est inscrit dans le grimoire des loutres ! ",
  "Une sauvegarde de plus pour le musée des phrases épiques. ",
  "Sauvegardé avec la bénédiction des douze (surtout Nymeia, évidemment).",
  "Enregistré ! Même un Lalafell pourrait s’en souvenir maintenant.",
  "C’est noté dans le registre des loutres… juste à côté de la recette du ragoût de chocobo.",
  "Gravé avec plus de précision qu’un bonus critique d’Astromancien. ",
  "C’est noté ! Et promis, aucun Lalafell ne l’utilisera pour du RP bizarre.",
  "Ajouté dans le musée des phrases, là où les Lalafells ne peuvent pas atteindre."
]

const onlyMention = ["Tu veux quoi ? _(feur)_",
  "Oui, noble aventurier ? Vous avez invoqué une loutre légendaire ?",
  "J’étais en train de farmer des alexandrites, tu veux quoi ? _feur_ ",
  "Tu as prononcé mon nom, et hop, me voici ! Mais t'as besoin d'un truc ?",
  "Tu m’appelles toujours pour rien, toi, hein ?",
  "Encore toi ? J’espère que c’est important cette fois. Ah... Bah non.",
  "Oh, une invocation ! Et moi qui pensais qu’on m’oubliait.",
  "T’es sûr que tu veux déranger une loutre occupée à pêcher ?",
  "Arrête de m’invoquer pour des bêtises, ou je vais pêcher ailleurs.",
  "Encore toi ? T’as pas un raid à faire ?",
  "Moi, invoqué ? J’espère que c’est une mission importante.",
  "Quoi ? Si tu veux juste parler, va trouver un mog.",
  "T’es sûr que c’était nécessaire de m'appeler ? Je n’ai pas signé pour être ton servant mog. ",
  "Tu me déranges… encore ? T’es pire qu’un heal qui spam Medica II.",
  "T’as pas un Lalafell à embêter plutôt ? ",
  "Tu fais ça souvent, d’appeler les loutres sans raison ? T’as des gils à gaspiller ? ORWEN, JUNGSO ! ",
  "Une mention pour quoi ? Si c’est pour un praeto, je passe mon tour. Vas voir Zedo si j'y suis",
  "J’espère que c’est urgent, sinon je te mets en file d’attente comme un DPS.",
  "Une loutre invoquée sans raison, c’est comme un wipe en raid : ça fait mal à l’ego. "
]

const noCitations = [
  "Rien d’enregistré ? Elle est aussi vide que le carnet de notes de Tataru.",
  "Pas de traces de sagesse ? Peut-être qu’elle attend encore un loot d’inspiration.",
  "Rien ? Elle est aussi discrète qu’un Lalafell qui veut passer inaperçu.",
  "Rien sur elle dans mes archives. Peut-être qu’elle parle en langage primal qu’on n’a pas capté ",
  "Hmm. j’ai fouillé mes archives, mais rien sur elle n’a été sauvegardé. Une stratégie pour rester mystérieuse, peut-être ? ",
  "Pas de chance, elle n’a laissé aucune trace mémorable. Peut-être qu’elle garde tout pour la prochaine extension ?",
  "Pas une seule citation. Elle est aussi vide qu’un coffre après le passage d'Orwen. ",
  "Désolé, mais elle n’a pas encore gravé son nom dans l’histoire des Loutres.",
  "Pas de citation. Elle doit être en train de méditer à la guilde des érudits.",
  "Hmm… rien à dire. Elle doit être comme ces joueurs AFK à Gridania."
]

  // Vérifier si le bot est mentionné
  if (message.mentions.has(bot.user)) {
    // Vérifier si le message est une réponse à un autre message
    if (message.reference && message.reference.messageId) {
      const originalMessage = await message.channel.messages.fetch(message.reference.messageId);
      const discordId = originalMessage.author.id;

      // Vérifier si l'ID de l'auteur est celui du bot de dev ou du bot principal
      if (discordId === botDevId || discordId === botMainId) {
        return //await message.reply("Pas besoin de toi pour retenir ce que je dis. :ko:");
      }
      const messageId = originalMessage.id;
      const discordUsername = originalMessage.author.username;
      const quoteContent = originalMessage.content;
      const quoteDate = originalMessage.createdAt;

      if(!quoteContent.length || quoteContent.length < 2) {
        return message.reply("Mais c'est pas une phrase ça ! <:ko:870697965201805433>");
      }
      // Vérifier que le contenu est inférieur à 2000 caractères
      if (quoteContent.length > 1980) {
        return message.reply("C'est trop long ! Je m'en souviendrai JA.MAIS ! <:ko:870697965201805433>");
      }
      // Vérifier si le message contient une image

      

      // Accéder à Firestore pour créer ou mettre à jour le document
      const profilesRef = db.collection('profiles');
      const userDocRef = profilesRef.doc(discordId);
      const quotesRef = userDocRef.collection('citations');
      const quoteDocRef = quotesRef.doc(messageId); // Utiliser l'ID du message comme référence du document

      // Vérifier si le profil existe déjà
      const doc = await userDocRef.get();
      if (!doc.exists) {
          console.warn(`${await dateFormatLog()}quoteSystem : Le profil de ${discordUsername} n'existe pas.`); // Met une indication dans la console (pq pas au channel admin)
        const channel = await bot.channels.fetch(bot.settings.ids.adminChannel);
        await channel.send(`quoteSystem : Le profil pour ${discordUsername} n'existait pas et a été créé.`);
        console.warn(`${await dateFormatLog()}quoteSystem : Le profil pour ${discordUsername} n'existait pas et a été créé.`); // Met une indication dans la console
      }


      // Vérifier si la citation existe déjà
      const quoteExists = await quoteDocRef.get();
      if(quoteExists.exists) { // Si la citation existe déjà
        const randomAlreadySave = alreadySave[Math.floor(Math.random() * alreadySave.length)]; // Phrase aléatoire de la liste alreadySave
        message.reply(randomAlreadySave);
        return;
      }

      // Sauvegarder la citation
      await quoteDocRef.set({
        quote: quoteContent,
        date: quoteDate,
      });
      console.log(`${await dateFormatLog()}[quoteSystem] Enregistrement : ${discordUsername} a dit "${quoteContent}" dans ${message.channel.name} le ${quoteDate}.`); // Met une indication dans la console (pq pas au channel admin)
      const randomSaveDone = saveDone[Math.floor(Math.random() * saveDone.length)]; // Phrase aléatoire de la liste saveDone
      message.reply(randomSaveDone);
      

    } else {
      // Si le bot est mentionné sans message de réponse, c'est donc qu'un utilisateur veut montrer la citation de quelqu'un
      const mentionedUsers = message.mentions.users.filter(user => user.id !== bot.user.id);
      if (mentionedUsers.size > 0) {
         // Prendre le premier utilisateur mentionné
        let mentionedUser = mentionedUsers.first();  
        // Vérifier si l'ID du premier utilisateur mentionné correspond à celui du bot dev ou main
        if (mentionedUser.id === botDevId || mentionedUser.id === botMainId) {
          // Essayer de prendre le second utilisateur mentionné, si disponible
          const mentionedUsersArray = mentionedUsers.array(); // Convertir en tableau si nécessaire
          if (mentionedUsersArray.length > 1) {
            mentionedUser = mentionedUsersArray[1]; // Prendre le second utilisateur mentionné
          }
        }

        const discordId = mentionedUser.id;
      // Utiliser discordId comme nécessaire
        // Accéder à Firestore pour récupérer les citations de l'utilisateur mentionné
        const profilesRef = db.collection('profiles');
        const userDocRef = profilesRef.doc(discordId);
        const quotesRef = userDocRef.collection('citations');
        const quotesSnapshot = await quotesRef.get();

        if (!quotesSnapshot.empty) {
          // Sélectionner une citation au hasard pour cet utilisateur
          const quotes = [];
          quotesSnapshot.forEach(doc => quotes.push(doc.data()));

          // On rentre dans une boucle pour voir toutes les citations
          while (quotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const randomQuote = quotes[randomIndex];
            try {
              const originalQuoteMessage = await message.channel.messages.fetch(randomQuote.messageId);
              if (originalQuoteMessage) {
                const dataUser = (await userDocRef.get()).data();
                const prenom = dataUser.Prenom || mentionedUser.displayName;
                const quoteContent = randomQuote.quote;
                const quoteDate = randomQuote.date;
                await message.reply(`" ${quoteContent} " — ${prenom}, le ${quoteDate.toDate().toLocaleDateString()}`);
                console.log(await dateFormatLog() + '[quoteSystem] Citation de', prenom ,' affichée dans salon :', message.channel.name, " contenu: " ,randomQuote.quote);
                break; // Si on a une citation valide, on sort de la boucle
              }
              else{ // Citation non trouvée
                await quotesRef.doc(randomQuote.messageId).delete();
                quotes.splice(randomIndex, 1);
                console.log(`${await dateFormatLog()}[quoteSystem] Citation non trouvée de ${mentionedUser.displayName}, suppression de la base de données`);
              }
              // Si le message original n'existe pas, on supprime la citation de la base de données
            } catch (error) {
              if (error.code === 10008) { // Message not found
                await quotesRef.doc(randomQuote.messageId).delete();
                quotes.splice(randomIndex, 1);
              } else {
                throw error;
              }
            }
        }
      
      } else {
          // Gérer le cas où l'utilisateur mentionné n'a pas de citations sauvegardées
          const randomNoCitations = noCitations[Math.floor(Math.random() * noCitations.length)];
          message.reply(randomNoCitations);  
        }
      } else {
        // Gérer le cas où aucun utilisateur n'est mentionné avec le bot
        const randomOnlyMention = onlyMention[Math.floor(Math.random() * onlyMention.length)];
        message.reply(randomOnlyMention);
      }
    }
  }
}


module.exports = saveQuote;