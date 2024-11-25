const { fetchAndDisplayQuotes } = require('@helpers/deleteQuote')

module.exports = {
    name: "quote",
    description: "système de quote",
    permission: "Aucune",
    dm: false,
    options: [
        {
            type: "SUB_COMMAND",
            name: "delete",
            description: "Choisissez une de vos quotes à supprimer.",
        }
    ],
    async run(bot, interaction, args) {
        const subCommand = interaction.options.getSubcommand();
    
        switch(subCommand) {
            case "delete":
                fetchAndDisplayQuotes(interaction);
                break;
            default:
                await interaction.reply({ content: "Option non reconnue.", ephemeral: true });
        }
    }
}