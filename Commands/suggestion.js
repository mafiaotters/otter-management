module.exports = {
    name: "suggestion",
    description: "Pour soumettre une idée sur le site ou Chantal",
    permission: "Aucune",
    dm: true,
    category: "User",


    async run(bot, interaction, args) {
        return interaction.reply({ content: "Lien pour faire des suggestions du site ou Chantal : https://forms.gle/bDPFqH9btrb6QFhi6", ephemeral: true });
       
    }
}