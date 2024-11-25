const collecte = require('../GillSystem/collecte');

module.exports = {
    name: "quote",
    description: "système de quote",
    permission: "Aucune",
    dm: false,
    options: [
        {
            type: "SUB_COMMAND",
            name: "suppr",
            description: "Choisissez une de vos quotes à supprimer.",
        }
    ],
    async run(bot, interaction, args) {
        const subCommand = interaction.options.getSubcommand();
    
        switch(subCommand) {
            case "suppr":
                collecte(bot, interaction);
                break;
            default:
                await interaction.reply({ content: "Option non reconnue.", ephemeral: true });
        }
    }
}