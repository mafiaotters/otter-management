const Discord = require('discord.js');
const db = require('../Loader/loadDatabase'); 
const deleteMember = require('../Helpers/deleteMember');


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
     // Supposons que args[0] est l'ID Discord du membre à ajouter
        const discordUser = interaction.options.getUser('membre');
        const discordName = discordUser.username; // Récupérer le nom d'utilisateur Discord

        await deleteMember(discordName, interaction, bot);

    }
}