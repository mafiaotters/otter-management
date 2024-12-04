const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('@loader/loadDatabase')

/**
 * Fonction pour afficher les citations d'un joueur avec pagination
 * @param {Object} interaction - L'interaction Discord
 * @param {Array} quotes - La liste des citations du joueur
 * @param {String} username - Le nom du joueur
 */
async function displayQuotes(interaction, quotes, username) {
    let currentPage = 1;
    const itemsPerPage = 3;
    const totalPages = Math.ceil(quotes.length / itemsPerPage);

    /**
     * Crée un embed pour une page donnée.
     */
    const createEmbed = (page) => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageQuotes = quotes.slice(start, end);

        return new EmbedBuilder()
            .setTitle(`Citations de ${username}`)
            .setDescription(
                pageQuotes
                    .map((quote, index) => `${start + index + 1}. ${quote}`)
                    .join('\n')
            )
            .setFooter({ text: `Page ${page} sur ${totalPages} - Cliquez sur la citation à supprimer` })
            .setColor('#0099ff');
    };

    /**
     * Crée les boutons de navigation et de suppression.
     */
    const createButtons = (page) => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageQuotes = quotes.slice(start, end);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous')
                    .setLabel('Précédent')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === 1),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Suivant')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(page === totalPages)
            );

        pageQuotes.forEach((_, index) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`delete_${start + index}`)
                    .setLabel(`${start + index + 1}`)
                    .setStyle(ButtonStyle.Danger)
            );
        });

        return row;
    };

    // Envoyer le premier embed
    const embedMessage = await interaction.reply({
        embeds: [createEmbed(currentPage)],
        components: [createButtons(currentPage)],
        ephemeral: true,
    });

    // Créer le collecteur de boutons
    const collector = embedMessage.createMessageComponentCollector({
        time: 5 * 60 * 1000, // 5 minutes
    });

    collector.on('collect', async (btnInteraction) => {
        if (btnInteraction.user.id !== interaction.user.id) {
            return btnInteraction.reply({
                content: "Vous ne pouvez pas interagir avec ce menu.",
                ephemeral: true,
            });
        }

        if (btnInteraction.customId === 'previous') {
            currentPage--;
        } else if (btnInteraction.customId === 'next') {
            currentPage++;
        } else if (btnInteraction.customId.startsWith('delete_')) {
            const indexToDelete = parseInt(btnInteraction.customId.split('_')[1], 10);
            const quoteToDelete = quotes[indexToDelete];

            try {
                // Supprimer la citation de Firestore
                const userId = interaction.user.id;
                const quotesRef = db.collection('profiles').doc(userId).collection('citations');

                // Rechercher et supprimer la citation
                const snapshot = await quotesRef.where('quote', '==', quoteToDelete).get();
                if (!snapshot.empty) {
                    snapshot.forEach((doc) => doc.ref.delete());
                }

                // Retirer la citation du tableau local
                quotes.splice(indexToDelete, 1);

                // Répondre à l'utilisateur
                await btnInteraction.reply({
                    content: `Citation supprimée : "${quoteToDelete}"`,
                    ephemeral: true,
                });

                // Mettre à jour les boutons et l'embed
                currentPage = Math.min(currentPage, Math.ceil(quotes.length / itemsPerPage));
                await embedMessage.edit({
                    embeds: [createEmbed(currentPage)],
                    components: [createButtons(currentPage)],
                });
            } catch (error) {
                console.error('Erreur lors de la suppression de la citation :', error);
                await btnInteraction.reply({
                    content: 'Une erreur est survenue lors de la suppression de la citation.',
                    ephemeral: true,
                });
            }
            return;
        }

        // Mettre à jour l'embed et les boutons
        await btnInteraction.update({
            embeds: [createEmbed(currentPage)],
            components: [createButtons(currentPage)],
        });
    });

    collector.on('end', async () => {
        await embedMessage.edit({ components: [] });
    });
}


async function fetchAndDisplayQuotes(interaction) {
    try {
        const userId = interaction.user.id;
        const username = interaction.user.displayName;

        const quotesRef = db.collection('profiles').doc(userId).collection('citations');
        const quotesSnapshot = await quotesRef.get();

        if (quotesSnapshot.empty) {
            return await interaction.reply({
                content: `Aucune citation trouvée pour ${username}.`,
                ephemeral: true,
            });
        }

        // Extraire les citations sous forme de tableau
        const quotes = [];
        quotesSnapshot.forEach((doc) => quotes.push(doc.data().quote));

        console.log(`Citations trouvées pour ${username} :`, quotes);

        // Afficher les citations avec pagination
        await displayQuotes(interaction, quotes, username);
    } catch (error) {
        console.error('Erreur lors de la récupération des citations :', error);
        await interaction.reply({
            content: 'Une erreur est survenue lors de la récupération des citations.',
            ephemeral: true,
        });
    }
}


module.exports = { fetchAndDisplayQuotes };
