const Discord = require('discord.js');
const updateUserGills = require('./updateUserGills');
const db = require('../Loader/loadDatabase'); 

async function collecte(bot, interaction) {
    const userRef = db.collection('profiles').doc(interaction.user.username);
    const doc = await userRef.get();
    const now = new Date();

    const docData = doc.data();
    const gillSystem = docData ? docData.gillSystem : null;
    const lastCollected = gillSystem && gillSystem.lastCollected ? new Date(gillSystem.lastCollected.toDate()) : null;  
    // Vérifie si la dernière collecte a été faite après 2h du matin aujourd'hui
    const resetTime = new Date(now);
    resetTime.setHours(2, 0, 0, 0); // Heure de réinitialisation à 2h du matin

    if (lastCollected && lastCollected > resetTime) {
        // L'utilisateur a déjà collecté ses gills aujourd'hui
        return interaction.editReply({ content: "Vous avez déjà collecté vos gills aujourd'hui. Revenez demain !", ephemeral: true });
    }

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


