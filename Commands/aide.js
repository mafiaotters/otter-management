const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "aide",
    description: "Liste les commandes de Chantal",
    permission: "Aucune",
    dm: false,

    async run(bot, interaction, args) {
        try {
            // Créer l'embed
            const embed = new EmbedBuilder()
                .setTitle("📖 Liste des commandes")
                .setDescription("Voici la liste des commandes disponibles pour **Chantal**." +
                    `\nBesoin de plus d'aide ? Contactez : <@${bot.settings.commands.helpContacts[0]}> ou <@${bot.settings.commands.helpContacts[1]}> !`
                )
                .addFields(
                    { name: "/gill", value: "Affiche les commandes de notre économie fun : les Gills ! :fish:" },
                    { name: "/quote", value: "Affiche vos citations et vous permet de les supprimer si besoin." },
                    { name: "/suggestion", value: "Donne le lien du forms pour toutes vos suggestions ! <:otter_pompom:747554032582787163>" },
                    { name: "/aide", value: "Affiche cette liste." }
                )
                .setColor("#00BFFF")
                .setThumbnail(bot.user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: "Chantal, la loutre IA qui dépassera ChatGPT." })
                //.setImage(bot.user.displayAvatarURL({ size: 512 }));

            // Envoyer l'embed
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error("Erreur lors de l'exécution de la commande /help :", error);
            await interaction.reply({
                content: "Une erreur est survenue lors de l'exécution de la commande d'aide.",
                ephemeral: true
            });
        }
    }
};
