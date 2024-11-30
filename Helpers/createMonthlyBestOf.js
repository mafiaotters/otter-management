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
        const messages = await channel.messages.fetch({ limit: 10 }); // Récupère les 10 derniers messages
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
            console.log(await dateFormatLog() + '[BestOf] Ce n\'est pas le moment de générer le best-of mensuel.');
            return;
        }
        
        const db = require('@loader/loadDatabase');
        const date = new Date();

        const bestOfChannelID = process.env.GITHUB_BRANCH === 'main'
            ? '675682104327012382' // Channel pour la branche main
            : '1252901298798460978'; // Channel pour dev ou autre

        const channel = bot.channels.cache.get(bestOfChannelID);

        if (!channel) {
            console.error(await dateFormatLog() + '[BestOf] Le canal du best-of est introuvable.');
            return;
        }

        // Créer le titre avec une majuscule pour le mois
        const title = `🎉 Best-of Mensuel - ${date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())}`;

        // Vérifier les doublons avant d'aller plus loin
        if (await isDuplicateMessage(channel, title)) {
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

        // Ajouter les noms des utilisateurs
        for (const citation of newCitations) {
            try {
                // Récupérer le membre depuis Discord
                const member = await bot.guilds.cache
                    .first() // Assure que vous récupérez le bon serveur
                    .members.fetch(citation.userId);
                citation.userName = member.displayName || member.user.username;
            } catch {
                try {
                    // Récupérer "Prenom" depuis Firestore
                    const userDoc = await db.collection('profiles').doc(citation.userId).get();
                    if (userDoc.exists && userDoc.data().Prenom) {
                        citation.userName = userDoc.data().Prenom;
                    } else {
                        citation.userName = 'Utilisateur inconnu'; // Nom par défaut si tout échoue
                    }
                } catch (error) {
                    console.warn(`${await dateFormatLog()} Erreur lors de la récupération de "Prenom" pour l'utilisateur ID ${citation.userId}:`, error);
                    citation.userName = 'Utilisateur inconnu';
                }
            }
        }

        // Créer un embed pour le best-of
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor('#00aaff')
            .setTimestamp();

        if (newCitations.length === 0) {
            // Ajouter un message dans l'embed si aucune citation
            embed.setDescription('📋 Aucun nouveau best-of ce mois-ci. Revenez le mois prochain !');
        } else {
            // Limiter à 5 citations aléatoires
            if (newCitations.length > 5) {
                newCitations = newCitations.sort(() => 0.5 - Math.random()).slice(0, 5);
            }

            embed.setDescription('Voici les meilleures citations du mois !');

            newCitations.forEach((citation, index) => {
                embed.addFields({
                    name: `#${index + 1} - ${citation.userName}`, // Utilisation du nom prioritaire
                    value: citation.text,
                    inline: false,
                });
            });
        }

        // Envoyer le message avec l'embed
        await channel.send({ embeds: [embed] });
        console.log(await dateFormatLog() + '[BestOf] Best-of mensuel envoyé.');
    } catch (error) {
        console.error(await dateFormatLog() + '[BestOf] Erreur lors de la création du best-of mensuel :', error);
    }
}

module.exports = { createMonthlyBestOf };
