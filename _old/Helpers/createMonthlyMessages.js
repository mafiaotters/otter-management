const { dateFormatLog } = require('@helpers/logTools');
const { EmbedBuilder } = require('discord.js');
const admin = require('firebase-admin');

function isCorrectTime() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();
    const hour = now.getHours();

    const isLastDay = (day === 30 || (month === 1 && day === 28));
    return isLastDay && hour === 11;
}

async function createMonthlyMessages(bot) {
    try {
        if (!isCorrectTime()) return;

        const db = require('@loader/loadDatabase');
        const date = new Date();

        const bestOfChannelID = bot.settings.ids.bestOfChannel;
        const notificationChannelID = bot.settings.ids.notificationChannel;

        const bestOfChannel = bot.channels.cache.get(bestOfChannelID);
        const notificationChannel = bot.channels.cache.get(notificationChannelID);

        if (!bestOfChannel || !notificationChannel) {
            console.error(await dateFormatLog() + '[Messages] Erreur : Channel introuvable.');
            return;
        }

        const title = `QUI SPAM LE PLUS ? Top 5 - ${date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }).replace(/^\w/, (c) => c.toUpperCase())}`;

        const profilesRef = db.collection('profiles');
        const snapshot = await profilesRef.get();

        let stats = [];
        let batch = db.batch(); // Batch pour reset après

        for (const doc of snapshot.docs) {
            const counterRef = doc.ref.collection('messages').doc('counter');
            const counterDoc = await counterRef.get();

            if (counterDoc.exists && counterDoc.data().totalMessages) {
                stats.push({
                    userId: doc.id,
                    count: counterDoc.data().totalMessages
                });

                // Prépare le reset du compteur
                batch.set(counterRef, {
                    totalMessages: 0,
                    lastReset: new Date()
                }, { merge: true });
            }
        }

        stats.sort((a, b) => b.count - a.count);
        const topStats = stats.slice(0, 5);

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor('#ffcc00')
            .setTimestamp();

        if (topStats.length === 0) {
            embed.setDescription('📋 Aucun message enregistré ce mois-ci.');
        } else {
            embed.setDescription('Voici les membres les plus actifs ce mois-ci :');

            for (let i = 0; i < topStats.length; i++) {
                const userId = topStats[i].userId;
                const count = topStats[i].count;
                let displayName = 'Utilisateur inconnu';

                try {
                    const member = await bot.guilds.cache.first().members.fetch(userId);
                    displayName = member.displayName || member.user.username;
                } catch {}

                embed.addFields({
                    name: `#${i + 1} - ${displayName}`,
                    value: `${count} messages`,
                    inline: false
                });
            }
        }

        const statsMessage = await bestOfChannel.send({ embeds: [embed] });
        const messageLink = `https://discord.com/channels/${statsMessage.guild.id}/${statsMessage.channel.id}/${statsMessage.id}`;
        await notificationChannel.send(`📢 Les stats mensuelles des messages sont dispo ! ${messageLink}`);

        console.log(await dateFormatLog() + '[Messages] Statistiques mensuelles envoyées.');

        // ✅ Commit du reset des compteurs après publication
        await batch.commit();
        console.log(await dateFormatLog() + '[Messages] Tous les compteurs ont été remis à 0.');

    } catch (error) {
        console.error(await dateFormatLog() + '[Messages] Erreur lors de la création du rapport mensuel :', error);
    }
}

module.exports = { createMonthlyMessages };
