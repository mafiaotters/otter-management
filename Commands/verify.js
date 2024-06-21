const Discord = require('discord.js');
const db = require('../Loader/loadDatabase'); // Assurez-vous que le chemin est correct
const nodestone = require('@xivapi/nodestone');

// Initialize nodestone instance

async function getLodestoneProfileDescription(lodestoneId) {
    try {
        // Utiliser ns.Character pour récupérer les informations du personnage
        const character = await nodestone.Character(lodestoneId);
        // Retourner la description du profil, accessible via la propriété Bio
        console.log(character.Bio)
        return character.Bio;
    } catch (error) {
        console.error("Erreur lors de la récupération du profil Lodestone: ", error);
        return null; // Gérer l'erreur comme vous le souhaitez
    }
}

module.exports = {
    name: "verify",
    description: "Liez votre compte Discord à votre personnage FFXIV.",
    permission: "Aucune",
    dm: true,
    category: "User",

    async run(bot, interaction, args) {
        const discordId = interaction.user.id; // Récupérer l'ID Discord de l'utilisateur

        // Accéder à Firestore pour récupérer l'ID Lodestone
        const profilesRef = db.collection('profiles');
        const userDocRef = profilesRef.doc(discordId);

        

        try {
            const doc = await userDocRef.get();
            if (doc.exists) {
                const lodestoneId = doc.data().lodestoneId; // Récupérer l'ID Lodestone
                const keyUser = doc.data().keyUser; // Récupérer la clé utilisateur

                const character = await nodestone.Character(lodestoneId);
                console.log(character)
                
                // Vérification de l'ID lodestone sur le profil de l'utilisateur
                // Utiliser Nodestone pour obtenir la description du profil Lodestone
                const description = await getLodestoneProfileDescription(lodestoneId);
                if (description) {
                    // Faites ce que vous voulez avec la description, par exemple l'envoyer à l'utilisateur
                    await interaction.reply(`Description du profil Lodestone: ${description}`);
                } else {
                    await interaction.reply("Impossible de récupérer la description du profil Lodestone.");
                }


                // Voir si c'est okay
                if (keyValidation) {
                    // La clé utilisateur a été trouvée sur la page du profil Lodestone
                    await interaction.reply(`La clé utilisateur a été vérifiée avec succès sur votre profil Lodestone.`);
                } else {
                    // La clé utilisateur n'a pas été trouvée sur la page
                    await interaction.reply(`La clé utilisateur n'a pas été trouvée sur votre profil Lodestone. Assurez-vous de l'avoir ajoutée correctement.`);
                }

                // Par exemple, envoyer un message de confirmation
                await interaction.reply(`Votre ID Lodestone enregistré est: ${lodestoneId}`);
            } else {
                // Si l'utilisateur n'a pas de profil enregistré
                await interaction.reply("Aucun ID Lodestone enregistré pour votre compte. /link pour enregistrer votre ID.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID Lodestone", error);
            await interaction.reply("Une erreur est survenue lors de la vérification de votre ID Lodestone.");
        }
    }
}