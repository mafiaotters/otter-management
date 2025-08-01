const { EmbedBuilder } = require('discord.js');
const admin = require('firebase-admin');

module.exports = {
    name: "flooders",
    description: "Tu vois les 15 plus gros spammers du mois de la CL.",
    permission: "Aucune",
    dm: false,

    async run(bot, interaction, args) {
        try {
            await interaction.deferReply(); // Au cas où ça prenne un peu de temps

            const db = admin.firestore();
            const profilesRef = db.collection('profiles');
            const snapshot = await profilesRef.get();

            let stats = [];

            for (const doc of snapshot.docs) {
                const counterRef = doc.ref.collection('messages').doc('counter');
                const counterDoc = await counterRef.get();

                if (counterDoc.exists && counterDoc.data().totalMessages) {
                    stats.push({
                        userId: doc.id,
                        count: counterDoc.data().totalMessages
                    });
                }
            }

            if (stats.length === 0) {
                return await interaction.editReply("📋 Aucun message enregistré pour ce mois-ci.");
            }

            stats.sort((a, b) => b.count - a.count);
            const topStats = stats.slice(0, 15);

            let desc = '';
            for (let i = 0; i < topStats.length; i++) {
                let displayName = 'Utilisateur inconnu';
                try {
                    const member = await bot.guilds.cache.first().members.fetch(topStats[i].userId);
                    displayName = member.displayName || member.user.username;
                } catch {}

                desc += `#${i + 1} - ${displayName} - ${topStats[i].count} messages\n`;
            }

            const embed = new EmbedBuilder()
                .setTitle("Top 15 des gros flooders du mois, pour l'instant..")
                .setDescription(desc)
                .setColor("#ff6600")
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: "Chantal voit TOUT ! :eyes:" });

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error("Erreur lors de l'exécution de la commande /flooder :", error);
            await interaction.reply({
                content: "❌ Une erreur est survenue lors de l'exécution de la commande /flooder.",
                ephemeral: true
            });
        }
    }
};
