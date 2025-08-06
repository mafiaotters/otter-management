const Discord = require('discord.js');

module.exports = {
    name: "spoiler",
    description: "Remplace un message par une version masquée en cas de spoil.",
    type: "MESSAGE",
    dm: false,
    permission: Discord.PermissionFlagsBits.ManageMessages,
    async run(bot, interaction) {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        const targetMessage = interaction.targetMessage;
        if (!targetMessage) {
            return interaction.reply({ content: "Message introuvable.", ephemeral: true });
        }

        const content = targetMessage.content || "";
        const author = targetMessage.author;

        const files = targetMessage.attachments.map(att => {
            const file = new Discord.AttachmentBuilder(att.url);
            file.setSpoiler(true);
            return file;
        });

        const modal = new Discord.ModalBuilder()
            .setCustomId("spoiler-reason")
            .setTitle("Raison de la censure (optionnel)");

        const input = new Discord.TextInputBuilder()
            .setCustomId("note")
            .setLabel("Note")
            .setStyle(Discord.TextInputStyle.Paragraph)
            .setRequired(false);

        const row = new Discord.ActionRowBuilder().addComponents(input);
        modal.addComponents(row);

        await interaction.showModal(modal);

        try {
            const submitted = await interaction.awaitModalSubmit({
                time: 60_000,
                filter: i => i.customId === "spoiler-reason" && i.user.id === interaction.user.id,
            });

            const note = submitted.fields.getTextInputValue("note")?.trim();
            const maskedContent = content ? ` ||${content}||` : '';

            await targetMessage.delete().catch(() => {});
            await interaction.channel.send({
                content: `Message de ${author}:${maskedContent}${note ? `\nRaison : ${note}` : ''}`,
                files
            });

            await submitted.reply({ content: "Message masqué.", ephemeral: true });
        } catch (e) {
            await interaction.followUp({ content: "Commande annulée.", ephemeral: true }).catch(() => {});
        }
    }
};
