const Discord = require('discord.js');
const db = require('../Loader/loadDatabase'); // Assurez-vous que le chemin est correct
const nodestone = require('@xivapi/nodestone');
const getLodestoneInfo = require('../Helpers/getLodestoneInfo');

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

    await interaction.deferReply(); // Répondre à l'interaction pour éviter les erreurs de délai
    
    try {
        const doc = await userDocRef.get();
        if (doc.exists) {
            const lodestoneId = doc.data().lodestoneId; // Récupérer l'ID Lodestone
            const keyUser = doc.data().keyUser; // Récupérer la clé utilisateur
            // Obtient la description du profil Lodestone
            const characterDesc = await getLodestoneInfo(`https://eu.finalfantasyxiv.com/lodestone/character/${lodestoneId}/`, '.character__selfintroduction'); // Récupérer la description du personnage
            
            // Vérification de l'ID lodestone sur le profil de l'utilisateur
            if (characterDesc && characterDesc.includes(keyUser)) {                
                // Ajouter la donnée "check" avec la valeur "1" dans Firestore, utile dans d'autres script pour vérifier si le compte est lié et non encore en attente.
                await userDocRef.update({ check: 1 });
                console.log(`Lien lodestone et discord validé pour: ${interaction.user.username} (${discordId})`);
                await interaction.editReply("Votre compte Discord a été lié à votre profil lodestone FFXIV avec succès !")
            } else {
                await interaction.editReply({content: "La clé utilisateur n'a pas été trouvée sur votre profil Lodestone. Assurez-vous de l'avoir ajoutée correctement.", ephemeral: true});
            }
        } else {
            await interaction.editReply({content: "Impossible de récupérer la description du profil Lodestone.", ephemeral: true});
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de la clé utilisateur pour " + discordId, error);
    }
}
}