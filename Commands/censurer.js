const Discord = require('discord.js');

module.exports = {
    name: "Censurer",
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
        const member = targetMessage.member;
        const pseudo = member ? member.displayName : author.username;

        const files = targetMessage.attachments.map(att => {
            const file = new Discord.AttachmentBuilder(att.url);
            file.setSpoiler(true);
            return file;
        });

        const modal = new Discord.ModalBuilder()
            .setCustomId("censurer-reason")
            .setTitle("Raison de la censure (optionnel)");

        const input = new Discord.TextInputBuilder()
            .setCustomId("note")
            .setLabel("Note")
            .setStyle(Discord.TextInputStyle.Paragraph)
            .setRequired(false)
            .setMaxLength(666);

        const row = new Discord.ActionRowBuilder().addComponents(input);
        modal.addComponents(row);

        await interaction.showModal(modal);

        try {
            const submitted = await interaction.awaitModalSubmit({
                time: 60_000,
                filter: i => i.customId === "censurer-reason" && i.user.id === interaction.user.id,
            });

            const note = submitted.fields.getTextInputValue("note")?.trim().slice(0, 666);
            const maskedContent = content ? ` ||${content}||` : '';

            await targetMessage.delete().catch(() => {});

            const descriptionParts = [];
            if (maskedContent) descriptionParts.push(maskedContent);
            if (note) descriptionParts.push(`**Raison :** ${note}`);

            const embed = new Discord.EmbedBuilder()
                .setColor(0xff0000)
                .setAuthor({ name: `Message de ${pseudo}`, iconURL: author.displayAvatarURL({ dynamic: true }) })
                .setDescription(descriptionParts.join('\n\n'));

            await interaction.channel.send({ embeds: [embed], files });

            await submitted.reply({ content: "Message censuré.", ephemeral: true });
        } catch (e) {
            await interaction.followUp({ content: "Commande annulée.", ephemeral: true }).catch(() => {});
        }
    }
};
