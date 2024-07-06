const db = require('../Loader/loadDatabase'); 
const updateMemberDAO = require('../Helpers/updateMemberDAO');
const downloadUpdateWebsite = require('../Helpers/downloadUpdateWebsite');
const backupWebsite = require('../Helpers/backupWebsite');

module.exports = {
    name: "update",
    description: "Mise à jour du site web des loutres.",
    permission: "Aucune",
    dm: true,
    category: "User",

    async run(bot, interaction, args) {
        const timestamp = new Date().toISOString();
        // Liste des ID des utilisateurs autorisés
        const allowedUsers = ['207992750988197889', '173439968381894656']; // Jungso, Sefa
        // Vérifie si l'utilisateur est un administrateur ou s'il est dans la liste des utilisateurs autorisés
        const isAdmin = interaction.member.permissions.has('ADMINISTRATOR');// Les admins
        const isAllowedUser = allowedUsers.includes(interaction.user.id);
    
        // Vérifie l'autorisation d'executer la commande
        if (!isAdmin || !isAllowedUser) {
            // Si l'utilisateur n'est ni admin ni dans la liste, on refuse l'exécution de la commande
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        console.log(`[${timestamp}]: Mise à jour du site web...`);


        // TELECHARGER LE SITE ACTUEL
        await downloadUpdateWebsite('https://github.com/Satalis/LOUTRES_SITE/', './PublicWebsite')

        // Créer une backup du site
        await backupWebsite();
        
        // Edit le fichier MemberDAO
        updateMemberDAO(); 
        
    }
}