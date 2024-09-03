const db = require('../Loader/loadDatabase'); 
const updateFunction = require('../Helpers/updateFunction');

module.exports = {
    name: "update",
    description: "Mise à jour du site web des loutres.",
    permission: "Aucune",
    dm: true,
    category: "User",

    async run(bot, interaction, args) {
        const timestamp = new Date().toISOString();
        // Liste des ID des utilisateurs autorisés
        const allowedUsers = ['207992750988197889', '173439968381894656', '239407042182381588']; // Jungso, Sefa, Kaaz
        const isAllowedUser = allowedUsers.includes(interaction.user.id);
    
        // Vérifie l'autorisation d'executer la commande
        if (!isAllowedUser) {
            // Si l'utilisateur n'est ni admin ni dans la liste, on refuse l'exécution de la commande
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        console.log(`[${timestamp}]: Mise à jour du site web...`);

        interaction.deferReply({ ephemeral: true });

        await updateFunction();

        interaction.editReply({ content: "Mise à jour du site web réalisée avec succès.", ephemeral: true });
        
    }
}