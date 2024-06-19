const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides information about the bot commands.'),
    async execute(interaction) {
        await interaction.reply('Here is a list of commands...');
    },
};
