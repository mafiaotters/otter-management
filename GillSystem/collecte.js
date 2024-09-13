async function collecte(bot, interaction){
    // Logique de collecte ici
    await interaction.editReply({content: "Collecte effectuée.", ephemeral: true});
}
module.exports = collecte;