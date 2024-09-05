const db = require('../Loader/loadDatabase'); 
const updateFunction = require('../Helpers/updateFunction');

const lastUsed = {};

module.exports = {
    name: "update",
    description: "Mise à jour du site web des loutres.",
    permission: "Aucune",
    dm: true,
    category: "User",

  

    async run(bot, interaction, args) {
        const userId = interaction.user.id;
        const timestamp = new Date().getTime();
        const cooldownPeriod = 60000; // Délai en millisecondes, ici 60 secondes

        try{ 

        await interaction.deferReply({ ephemeral: true });
    
        // Vérifie si l'utilisateur a déjà utilisé la commande récemment
        if (lastUsed[userId] && timestamp - lastUsed[userId] < cooldownPeriod) {
            const timeLeft = ((cooldownPeriod - (timestamp - lastUsed[userId])) / 1000).toFixed(0);
            return interaction.followUp({ content: `Veuillez attendre ${timeLeft} secondes avant de réutiliser cette commande.`, ephemeral: true });
        }
    
        // Met à jour le timestamp de la dernière utilisation pour cet utilisateur
        lastUsed[userId] = timestamp;

        // Liste des ID des utilisateurs autorisés
        const allowedUsers = ['207992750988197889', '173439968381894656', '239407042182381588']; // Jungso, Sefa, Kaaz, compte test sefa
        const isAllowedUser = allowedUsers.includes(interaction.user.id);
    
        // Vérifie l'autorisation d'executer la commande
        if (!isAllowedUser) {
            // Si l'utilisateur n'est ni admin ni dans la liste, on refuse l'exécution de la commande
            return interaction.followUp({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        console.log(` Mise à jour du site web...`);

        await updateFunction();

        await interaction.followUp({ content: "Mise à jour du site web effectuée avec succès." });
    } catch (error) { 
    if (!interaction.deferred && !interaction.replied) {
        await interaction.followUp({ content: "Une erreur est survenue lors de l'exécution de la commande.", ephemeral: true }).catch(console.error);

    }}
    }
}