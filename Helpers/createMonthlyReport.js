const { dateFormatLog } = require('@helpers/logTools');
const { EmbedBuilder } = require('discord.js');
const admin = require('firebase-admin');

function isCorrectTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const hour = now.getHours();
    const isLastDay = (day === 30 || (month === 1 && day === 28));
    return isLastDay && hour === 18;
}

// 🔍 Vérifie si un rapport avec le même titre existe déjà dans les derniers messages
async function isDuplicateMessage(channel, title) {
    try {
        const messages = await channel.messages.fetch({ limit: 50 }); // check 50 derniers
        for (const [, message] of messages) {
            if (message.embeds.length > 0) {
                const embed = message.embeds[0];
                if (embed.title === title) {
                    return true; // Déjà posté
                }
            }
        }
        return false;
    } catch (error) {
        console.error(await dateFormatLog() + '[MonthlyReport] Erreur check doublon :', error);
        return false;
    }
}

async function createMonthlyReport(bot) {
    try {
        if (!isCorrectTime()) return;

        const db = require('@loader/loadDatabase');
        const date = new Date();

        const bestOfChannelID = bot.settings.ids.bestOfChannel;
        const notificationChannelID = bot.settings.ids.notificationChannel;

        const bestOfChannel = bot.channels.cache.get(bestOfChannelID);
        const notificationChannel = bot.channels.cache.get(notificationChannelID);

        if (!bestOfChannel || !notificationChannel) {
            console.error(await dateFormatLog() + '[LoutroNews] Erreur : Channel introuvable.');
            return;
        }

        const title = `Loutro'news - ${date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())} `;

        // ✅ Vérifie si le rapport est déjà posté
        if (await isDuplicateMessage(bestOfChannel, title)) {
            console.log(await dateFormatLog() + '[LoutroNews] Rapport déjà publié ce mois-ci, annulation.');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor('#ffcc00')
            .setTimestamp();

        // --- Récupérer le top 5 des messages ---
        const profilesRef = db.collection('profiles');
        const snapshot = await profilesRef.get();
        let stats = [];
        let batch = db.batch();

        for (const doc of snapshot.docs) {
            const counterRef = doc.ref.collection('messages').doc('counter');
            const counterDoc = await counterRef.get();

            if (counterDoc.exists && counterDoc.data().totalMessages) {
                stats.push({
                    userId: doc.id,
                    count: counterDoc.data().totalMessages
                });

                // Prépare le reset
                batch.set(counterRef, {
                    totalMessages: 0,
                    lastReset: new Date()
                }, { merge: true });
            }
        }

        stats.sort((a, b) => b.count - a.count);
        const topStats = stats.slice(0, 5);

        let messageSection = '📌 **Top 5 des gros flooders :**\n';
        if (topStats.length === 0) {
            messageSection += '_Aucun message enregistré ce mois-ci._\n';
        } else {
            for (let i = 0; i < topStats.length; i++) {
                let displayName = 'Utilisateur inconnu';
                try {
                    const member = await bot.guilds.cache.first().members.fetch(topStats[i].userId);
                    displayName = member.displayName || member.user.username;
                } catch {}

                messageSection += `#${i + 1} - ${displayName} - ${topStats[i].count} messages\n`;
            }
        }

        embed.setDescription(messageSection + '\n---\n📌 **Quelques citations du mois :**\n');

        // --- Récupérer les citations du mois ---
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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

        async function getUserDisplayName(userId) {
            try {
                const userDoc = await db.collection('profiles').doc(userId).get();
                if (userDoc.exists && userDoc.data().Prenom) {
                    return userDoc.data().Prenom;
                }
                const member = await bot.guilds.cache.first().members.fetch(userId);
                return member.displayName || member.user.username;
            } catch {
                return 'Utilisateur inconnu';
            }
        }

        for (const citation of newCitations) {
            citation.userName = await getUserDisplayName(citation.userId);
        }

        if (newCitations.length <= 1) {
            embed.addFields({
                name: 'Citations du mois',
                value: '📋 Pas assez de citations ce mois-ci pour un best-of ! Vous avez été sympa ce mois-ci.',
                inline: false
            });
        } else {
            let limited = newCitations.length > 5 ? newCitations.sort(() => 0.5 - Math.random()).slice(0, 5) : newCitations;

            limited.forEach((citation, index) => {
                embed.addFields({
                    name: `${citation.userName}`,
                    value: citation.text,
                    inline: false,
                });
            });
        }

        // --- Envoyer le rapport et reset ---
        const reportMessage = await bestOfChannel.send({ embeds: [embed] });
        const messageLink = `https://discord.com/channels/${reportMessage.guild.id}/${reportMessage.channel.id}/${reportMessage.id}`;
        await notificationChannel.send(`📢 L'actualité des loutres du mois est sorti ! **Cliquez ici:** ${messageLink}`);

        await batch.commit();
        console.log(await dateFormatLog() + '[LoutroNews] Rapport mensuel envoyé et compteurs remis à 0.');

    } catch (error) {
        console.error(await dateFormatLog() + '[LoutroNews] Erreur :', error);
    }
}

module.exports = { createMonthlyReport };
