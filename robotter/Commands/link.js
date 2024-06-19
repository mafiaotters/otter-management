const { SlashCommandBuilder } = require('@discordjs/builders');
const { link_profile } = require('./database');  // Assurez-vous d'importer la fonction de votre module database

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Links your Discord profile with Lodestone.')
        .addStringOption(option =>
            option.setName('lodestoneid')
                .setDescription('Your Lodestone ID')
                .setRequired(true)),
    async execute(interaction) {
        const lodestoneId = interaction.options.getString('lodestoneid');
        const discordId = interaction.user.id;

        // Appeler la fonction de lien ici
        link_profile(discordId, lodestoneId);

        await interaction.reply(`Linked your Discord ID with Lodestone ID: ${lodestoneId}`);
    },
};
