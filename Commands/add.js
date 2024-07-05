const db = require('../Loader/loadDatabase'); 

module.exports = {
    name: "add",
    description: "Ajoute un membre dans la BDD.",
    permission: "Aucune",
    dm: true,
    category: "User",
    options: [
        {
            type: "USER",
            name: "membre",
            description: "Membre à ajouter dans la BDD.",
            required: true,
        }
    ],

    async run(bot, interaction, args) {
        const timestamp = new Date().toISOString();
        // Liste des ID des utilisateurs autorisés
        const allowedUsers = ['207992750988197889', '173439968381894656']; // Jungso, Sefa
        // Vérifie si l'utilisateur est un administrateur ou s'il est dans la liste des utilisateurs autorisés
        const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');// Les admins
        const isAllowedUser = allowedUsers.includes(interaction.user.id);
    
        // Vérifie l'autorisation
        if (!isAdmin || !isAllowedUser) {
            // Si l'utilisateur n'est ni admin ni dans la liste, on refuse l'exécution de la commande
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }
        
        // La fonction
        // Supposons que args[0] est l'ID Discord du membre à ajouter
        const discordUser = interaction.options.getUser('membre');
        const discordId = discordUser.id;
        const discordName = discordUser.displayName; // Récupérer le nom d'utilisateur Discord

        // Accéder à Firestore pour créer ou mettre à jour le document
        const profilesRef = db.collection('profiles');
        const userDocRef = profilesRef.doc(discordName);

        try {
            await userDocRef.set({
                discordName: discordName,
                lodestoneId: " ",
                mainCharacter: " ",
                verified: false,
                discordId: discordId
            });
            await interaction.reply({ content: `Le membre ${discordName} a été ajouté avec succès.`, ephemeral: true });
            console.log(`${timestamp}: Membre ajouté avec succès: ${discordName}`)
        } catch (error) {
            console.error(timestamp + ": Erreur lors de l'ajout du membre " + discordName, error);
            await interaction.reply({ content: "Une erreur est survenue lors de l'ajout du membre.", ephemeral: true });
        }

        
    }
}