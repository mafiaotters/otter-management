const Discord = require('discord.js');
const updateUserGills = require('./updateUserGills');

async function collecte(bot, interaction) {
    try {
        // Générer un nombre aléatoire de gills entre 15 et 22
        const gills = Math.floor(Math.random() * (22 - 15 + 1)) + 15;

        // Mettre à jour le solde de gills de l'utilisateur ici
        updateUserGills(interaction.user, gills);

        // Informer l'utilisateur du nombre de gills collectés
        await interaction.editReply({ content: `Vous avez collecté ${gills} gills ! :fish:`, ephemeral: false });
    } catch (error) {
        console.error("Erreur lors de la collecte des gills :", error);
        await interaction.editReply({ content: "Une erreur est survenue lors de la collecte des gills. Veuillez réessayer plus tard.", ephemeral: true });
    }
}

module.exports = collecte;


