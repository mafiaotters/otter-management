const Discord = require('discord.js');
const pourquoi = require('../GillSystem/pourquoi');
const collecte = require('../GillSystem/collecte');
const classement = require('../GillSystem/classement');
const {kaazino} = require('../GillSystem/kaazino');

module.exports = {
    name: "gill",
    description: "La nourriture des loutres : les gills !",
    permission: "Aucune",
    dm: false,
    category: "Economie",
    options: [
        {
            type: "SUB_COMMAND",
            name: "collecte",
            description: "Pêchez vos gills journaliers.",
        },
        {
            type: "SUB_COMMAND",
            name: "classement",
            description: "Affiche le TOP classement des détenteurs de gill.",
        },
        {
            type: "SUB_COMMAND",
            name: "kaazino",
            description: "Pariez vos petits poissons pour en avoir plus !",
        },
        {
            type: "SUB_COMMAND",
            name: "pourquoi",
            description: "Pourquoi des gills ?",
        }
    ],
    async run(bot, interaction, args) {
        const subCommand = interaction.options.getSubcommand();

        if (!interaction.deferred && !interaction.replied) {
            await interaction.deferReply({ ephemeral: true });
        }
    
        switch(subCommand) {
            case "collecte":
                collecte(bot, interaction);
                break;
            case "classement":
                classement(bot, interaction);
                break;
            case "kaazino":
                kaazino(bot, interaction);
                break;
            case "pourquoi":
                pourquoi(bot, interaction);
                break;
            default:
                await interaction.followUp({ content: "Option non reconnue.", ephemeral: true });
        }
    }
}