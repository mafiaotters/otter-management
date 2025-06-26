const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "listerole",
    description: "Affiche la liste des membres possédant un rôle.",
    permission: "Aucune",
    dm: false,
    options: [
        {
            type: "ROLE",
            name: "role",
            description: "Rôle à afficher",
            required: true,
        }
    ],
    async run(bot, interaction) {
        const role = interaction.options.getRole('role');

        await interaction.deferReply({ ephemeral: true });
        await interaction.guild.members.fetch();

        const members = role.members.map(m => `• <@${m.id}>`);

        const embed = new EmbedBuilder()
            .setTitle(`Rôle : <@&${role.id}>`)
            .addFields(
                { name: 'Nom du rôle', value: `• <@&${role.id}>`},
                { name: 'Nombre de membres', value: `${members.length}`},
                { name: 'Pseudo des membres', value: members.length > 0 ? members.join('\n') : 'Aucun membre.' },
                { name: 'Date du rôle', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>` }
            )
            .setColor(role.color || '#0099ff')
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    }
};
