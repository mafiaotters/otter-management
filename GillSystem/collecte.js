const Discord = require('discord.js');
const updateUserGills = require('./updateUserGills');
const db = require('../Loader/loadDatabase'); 

async function collecte(bot, interaction) {
    const userRef = db.collection('gillSystem').doc(interaction.user.id);
    const doc = await userRef.get();
    
    if (!doc.exists) {
        // Si le document n'existe pas, créez-le avec isCollecting à true
        await userRef.set({ isCollecting: true, gills: 0, lastCollected: new Date() });
    } else if (doc.exists && doc.data().isCollecting) {
        // L'utilisateur est déjà en train de collecter, refusez la nouvelle tentative
        return interaction.editReply({ content: "Attends la fin de ta collecte précédente, petit gourmand !", ephemeral: true });
    }
    // Si le document existe et que l'utilisateur n'est pas en train de collecter, marquez-le comme tel
    if (doc.exists) {
        await userRef.update({ isCollecting: true });
    }

    const lastCollectedData = doc.data() ? doc.data().lastCollected : undefined;
    const lastCollected = lastCollectedData ? lastCollectedData.toDate() : new Date().setFullYear(1970);

    const now = new Date();

    // Vérifie si la dernière collecte a été faite après 2h du matin aujourd'hui
    const resetTime = new Date(now);
    resetTime.setHours(2, 0, 0, 0); // Heure de réinitialisation à 2h du matin

    try {
        if (lastCollected && lastCollected > resetTime) {
            // L'utilisateur a déjà collecté ses gills aujourd'hui
            return interaction.editReply({ content: "Tu as déjà collecté vos gills aujourd'hui. Reviens demain !", ephemeral: true });
        }
        // Générer un nombre aléatoire de gills entre 15 et 22
        const gills = Math.floor(Math.random() * (22 - 15 + 1)) + 15;

        // Mettre à jour le solde de gills de l'utilisateur ici
        updateUserGills(interaction.user, gills);

        // Informer l'utilisateur du nombre de gills collectés
        await interaction.deleteReply();
        await interaction.channel.send({ content: `<@${interaction.user.id}> a collecté ${gills} gills ! :fish:`, ephemeral: false });
    } catch (error) {
        console.error("Erreur lors de la collecte des gills :", error);
        await interaction.editReply({ content: "Une erreur est survenue lors de la collecte des gills. Veuillez réessayer plus tard, ou contact Jungso", ephemeral: true });
    } finally {
        // Marquez l'utilisateur comme ayant terminé la collecte
        await userRef.update({ isCollecting: false });  
    }
}

module.exports = collecte;


