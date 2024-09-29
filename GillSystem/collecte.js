const Discord = require('discord.js');
const updateUserGills = require('./updateUserGills');
const db = require('../Loader/loadDatabase'); 

async function collecte(bot, interaction) {
    const userRef = db.collection('gillSystem').doc(interaction.user.id);
    const doc = await userRef.get();

    if (doc.exists && doc.data().isCollecting) {
        // L'utilisateur est déjà en train de collecter, refusez la nouvelle tentative
        return interaction.editReply({ content: "Veuillez attendre la fin de votre collecte précédente.", ephemeral: true });
    }
    // Marquez l'utilisateur comme étant en train de collecter
    await userRef.update({ isCollecting: true });


    const now = new Date();

    const lastCollected = doc.data().lastCollected.toDate(); // Convertit Firestore Timestamp en objet Date


    // Vérifie si la dernière collecte a été faite après 2h du matin aujourd'hui
    const resetTime = new Date(now);
    resetTime.setHours(2, 0, 0, 0); // Heure de réinitialisation à 2h du matin

    try {
        if (lastCollected && lastCollected > resetTime) {
            // L'utilisateur a déjà collecté ses gills aujourd'hui
            return interaction.editReply({ content: "Vous avez déjà collecté vos gills aujourd'hui. Revenez demain !", ephemeral: true });
        }
        // Générer un nombre aléatoire de gills entre 15 et 22
        const gills = Math.floor(Math.random() * (22 - 15 + 1)) + 15;

        // Mettre à jour le solde de gills de l'utilisateur ici
        updateUserGills(interaction.user, gills);

        // Informer l'utilisateur du nombre de gills collectés
        await interaction.editReply({ content: `Vous avez collecté ${gills} gills ! :fish:`, ephemeral: false });
    } catch (error) {
        console.error("Erreur lors de la collecte des gills :", error);
        await interaction.editReply({ content: "Une erreur est survenue lors de la collecte des gills. Veuillez réessayer plus tard.", ephemeral: true });
    } finally {
        // Marquez l'utilisateur comme ayant terminé la collecte
        await userRef.update({ isCollecting: false });  
    }
}

module.exports = collecte;


