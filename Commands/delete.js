const Discord = require('discord.js');
const db = require('@loader/loadDatabase'); 
const deleteMember = require('@websiteUtils/deleteMember');


module.exports = {
    name: "delete",
    description: "Supprime un membre du site.",
    options: [
        {
            type: "USER",
            name: "membre",
            description: "Membre à retirer de la BDD.",
            required: true,
            autocomplete: true,
        }
    ],
    async run(bot, interaction) {
        // Liste des ID des utilisateurs autorisés
        const allowedUsers = bot.settings.commands.allowedUsers; // Jungso, Sefa, Kaaz
        // Vérifie si l'utilisateur est un administrateur ou s'il est dans la liste des utilisateurs autorisés
        const isAllowedUser = allowedUsers.includes(interaction.user.id);

        // Vérifie l'autorisation
        if (!isAllowedUser) {
            // Si l'utilisateur n'est ni admin ni dans la liste, on refuse l'exécution de la commande
            console.log( `[Delete] Utilisateur non autorisé: ${interaction.user.username}`);
            return interaction.followUp({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

     // Supposons que args[0] est l'ID Discord du membre à ajouter
        const discordUser = interaction.options.getUser('membre');
        const discordName = discordUser.username; // Récupérer le nom d'utilisateur Discord
        const discordId = discordUser.id
        console.log(`[Delete] Suppression du membre ${discordName} en cours...`);
        await deleteMember(discordId, interaction, bot);
    }
}