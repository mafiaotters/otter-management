const { EmbedBuilder } = require('discord.js');
const db = require('@loader/loadDatabase');

module.exports = {
    name: "citations",
    description: "Affiche toutes les citations de tous les membres.",
    permission: "Aucune",
    dm: false,

    async run(bot, interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const profilesSnapshot = await db.collection('profiles').get();
            let citations = [];

            for (const doc of profilesSnapshot.docs) {
                const profileData = doc.data();
                const prenom = profileData.Prenom || 'Inconnu';

                const citationSnapshot = await doc.ref.collection('citations').get();

                citationSnapshot.forEach((c) => {
                    const data = c.data();
                    if (data.quote) {
                        citations.push({
                            prenom,
                            quote: data.quote,
                            date: data.date?.toDate() || null,
                        });
                    }
                });
            }

            if (citations.length === 0) {
                return await interaction.editReply({
                    content: '❌ Aucune citation trouvée.',
                });
            }

            // Trier par date décroissante
            citations.sort((a, b) => (b.date || 0) - (a.date || 0));

            // Pagination par blocs de 10 citations
            const embeds = [];
            const chunkSize = 10;
            for (let i = 0; i < citations.length; i += chunkSize) {
                const chunk = citations.slice(i, i + chunkSize);
                const embed = new EmbedBuilder()
                    .setTitle("📚 Citations Globales")
                    .setColor("#00aaff")
                    .setTimestamp()
                    .setDescription(
                        chunk
                            .map((c, idx) => `**${c.prenom}** : _"${c.quote}"_`)
                            .join("\n\n")
                    );
                embeds.push(embed);
            }

            // Envoyer les embeds (via followUp car reply déjà utilisé)
            for (const embed of embeds) {
                await interaction.followUp({ embeds: [embed], ephemeral: true });
            }

        } catch (error) {
            console.error("[/citations-globales] Erreur :", error);
            await interaction.editReply({
                content: "❌ Une erreur est survenue lors de la récupération des citations.",
            });
        }
    }
};
