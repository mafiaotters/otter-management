const { dateFormatLog } = require('@helpers/logTools');
const { EmbedBuilder } = require('discord.js');

/**
 * Vérifie si un message avec le même titre d'embed existe déjà dans les 10 derniers messages.
 * @param {TextChannel} channel - Le channel Discord où vérifier les messages.
 * @param {string} title - Le titre du message à publier.
 * @returns {Promise<boolean>} - Retourne true si un doublon est trouvé, sinon false.
 */

function isCorrectTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const hour = now.getHours();

    // Vérifie le 30 du mois ou le 27 en février
    const isLastDay = (day === 30 || (month === 1 && day === 28));

    // Vérifie que l'heure est 18h
    return isLastDay && hour === 18;
}

async function isDuplicateMessage(channel, title) {
    try {
        const messages = await channel.messages.fetch({ limit: 95 }); // Récupère les 10 derniers messages
        for (const [, message] of messages) {
            if (message.embeds.length > 0) {
                const embed = message.embeds[0];
                if (embed.title === title) {
                    return true; // Doublon trouvé
                }
            }
        }
        return false; // Aucun doublon trouvé
    } catch (error) {
        console.error(await dateFormatLog() + '[BestOf] Erreur lors de la vérification des doublons :', error);
        return false; // Par sécurité, on considère qu'il n'y a pas de doublon
    }
}

/**
 * Crée un best-of mensuel des nouvelles citations.
 * @param {Client} bot - L'instance du bot Discord.
 */
async function createMonthlyBestOf(bot) {
    try {
        if (!isCorrectTime()) {
            return;
        }
        
        const db = require('@loader/loadDatabase');
        const date = new Date();

        // Définition des channels
        const bestOfChannelID = bot.settings.ids.bestOfChannel;

        const notificationChannelID = bot.settings.ids.notificationChannel;

        // Récupérer les channels
        const bestOfChannel = bot.channels.cache.get(bestOfChannelID);
        const notificationChannel = bot.channels.cache.get(notificationChannelID);

        if (!bestOfChannel || !notificationChannel) {
            console.error(await dateFormatLog() + '[BestOf] Erreur : Un des channels est introuvable.');
            return;
        }

        // Créer le titre avec une majuscule pour le mois
        const title = `🎉 Best-of Mensuel - ${date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())}`;

        // Vérifier les doublons avant d'aller plus loin
        if (await isDuplicateMessage(bestOfChannel, title)) {
            return console.log(await dateFormatLog() + '[BestOf] Le best-of a déjà été publié ce mois-ci.');
        }

        // Calculer la période pour filtrer les citations du mois courant
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const citationsRef = db.collection('profiles');
        const snapshot = await citationsRef.get();

        let newCitations = [];

        for (const doc of snapshot.docs) {
            const userCitations = await doc.ref.collection('citations').get();
            userCitations.forEach(citation => {
                const data = citation.data();
                if (data.date && data.date.toDate() >= firstDayOfMonth && data.date.toDate() <= lastDayOfMonth) {
                    newCitations.push({
                        userId: doc.id,
                        text: data.quote,
                        date: data.date.toDate(),
                    });
                }
            });
        }

        // Fonction pour récupérer le nom (Prenom > displayName > 'Utilisateur inconnu')
        async function getUserDisplayName(userId) {
            try {
                // Récupération via Firestore
                const userDoc = await db.collection('profiles').doc(userId).get();
                if (userDoc.exists && userDoc.data().Prenom) {
                    return userDoc.data().Prenom;
                }

                // Récupération via Discord
                const member = await bot.guilds.cache.first().members.fetch(userId);
                return member.displayName || member.user.username;
            } catch {
                return 'Utilisateur inconnu'; // Si tout échoue
            }
        }

        // Ajouter les noms aux citations récentes
        for (const citation of newCitations) {
            citation.userName = await getUserDisplayName(citation.userId);
        }

        // Créer un embed pour le best-of
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor('#00aaff')
            .setTimestamp();

        if (newCitations.length <= 2) {
            let allCitations = [];

            for (const doc of snapshot.docs) {
                const userCitations = await doc.ref.collection('citations').get();
                userCitations.forEach(citation => {
                    const data = citation.data();
                    allCitations.push({
                        userId: doc.id,
                        text: data.quote,
                        date: data.date ? data.date.toDate() : new Date(0),
                    });
                });
            }

            if (allCitations.length <= 2) {
                embed.setDescription('📋 Aucun best-of n\'est disponible. Revenez le mois prochain !');
            } else {
                allCitations = allCitations.sort(() => Math.random() - 0.5).slice(0, 5);

                embed.setDescription('📋 Ce mois-ci, voici quelques citations sélectionnées aléatoirement :');

                for (const [index, citation] of allCitations.entries()) {
                    citation.userName = await getUserDisplayName(citation.userId);

                    embed.addFields({
                        name: `#${index + 1} - ${citation.userName}`,
                        value: citation.text,
                        inline: false,
                    });
                }
            }
        } else {
            // Limiter à 5 citations aléatoires
            if (newCitations.length > 5) {
                newCitations = newCitations.sort(() => 0.5 - Math.random()).slice(0, 5);
            }

            embed.setDescription('Voici les meilleures citations du mois !');

            newCitations.forEach((citation, index) => {
                embed.addFields({
                    name: `#${index + 1} - ${citation.userName}`,
                    value: citation.text,
                    inline: false,
                });
            });
        }

        // Envoyer le best-of et récupérer le message envoyé
        const bestOfMessage = await bestOfChannel.send({ embeds: [embed] });
        
        // Envoyer le lien du message dans le channel de notifications
        const messageLink = `https://discord.com/channels/${bestOfMessage.guild.id}/${bestOfMessage.channel.id}/${bestOfMessage.id}`;
        await notificationChannel.send(`📢 Le best-of des citations du mois vient d'être publié ! Cliquez ici : ${messageLink}`);

        console.log(await dateFormatLog() + '[BestOf] Best-of mensuel envoyé et notification postée.');
    } catch (error) {
        console.error(await dateFormatLog() + '[BestOf] Erreur lors de la création du best-of mensuel :', error);
    }
}

module.exports = { createMonthlyBestOf };
