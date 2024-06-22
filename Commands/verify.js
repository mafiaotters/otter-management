const db = require('../Loader/loadDatabase'); // Assurez-vous que le chemin est correct
const getLodestonePage = require('../Helpers/getLodestonePage');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

// Classes actuelles lodestone  - DESCRIPTION       - NOM
const divClasses = ['.character__selfintroduction', '.frame__chara__name'];
const timestamp = new Date().toISOString();


// Création des boutons
const buttonLodestone = new ButtonBuilder()
.setURL(`https://eu.finalfantasyxiv.com/lodestone/my/setting/profile/`)
.setLabel('Changer description Lodestone')
.setStyle(ButtonStyle.Link);

// Ajout des boutons à une ligne d'action
const row = new ActionRowBuilder()
        .addComponents(buttonLodestone);

module.exports = {
    name: "verify",
    description: "Vérifie la clé sur votre lodestone et votre compte Discord, et valide le lien.",
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
        if (doc.exists) { // Si l'utilisateur a un profil
            const lodestoneId = doc.data().lodestoneId; // Récupérer l'ID Lodestone
            const keyUser = doc.data().keyUser; // Récupérer la clé utilisateur
            if(!doc.data().keyUser){ // Si aucune clé renseignée
                return interaction.editReply({content: "Vous n'avez pas de clé utilisateur. Veuillez en générer une avec /link", ephemeral: true});
            }
            // Obtient le profil lodestone, et les classes qu'on demande en haut du script
            const characterInfo = await getLodestonePage(`https://eu.finalfantasyxiv.com/lodestone/character/${lodestoneId}/`, divClasses);
            
            // Prends les valeur que l'on souhaite.
            const characterDesc = characterInfo['.character__selfintroduction'];
            const characterName = characterInfo['.frame__chara__name'];

            // Vérification de l'ID lodestone sur le profil de l'utilisateur
            if (characterDesc && characterDesc.includes(keyUser)) {                
                // Ajouter la donnée "check" avec la valeur "1" dans Firestore, utile dans d'autres script pour vérifier si le compte est lié et non encore en attente.
                await userDocRef.update({ verified : true, mainCharacter: characterName});
                console.log(`[${timestamp}] Lien lodestone et discord validé pour: ${interaction.user.username} (${discordId})`);
                await interaction.editReply("Votre compte Discord a été lié à votre profil lodestone FFXIV avec succès ! \nVous pouvez retirer la clé de votre description.")
            } else {
                await interaction.editReply({content: "La clé utilisateur n'a pas été trouvée sur votre profil Lodestone. Assurez-vous de l'avoir ajoutée correctement. \nVotre clé: " + keyUser, ephemeral: true, components: [row]});
            }
        } else {
            if(doc.data() && doc.data().lodestoneId){ 
            //Si un lodestone est déjà renseigné, mais pas validé

            await interaction.editReply({content: "Impossible de récupérer la clé sur votre profil Lodestone. Pensez à la générer via /link puis la mettre en description de votre profil Lodestone", ephemeral: true, components: [row]});
        } else{
            //Si aucun lodestone n'est renseigné
            await interaction.editReply({content: "Définissez votre ID lodestone par la commande: /link", ephemeral: true});
        }
    }
    } catch (error) {
        console.error(timestamp + " Erreur lors de la vérification de la clé utilisateur pour " + discordId, error);
    }
}
}