async function collecte(bot, interaction){
    // Logique de collecte ici
    await interaction.editReply({content: "Casino effectuée.", ephemeral: true});
}
module.exports = collecte;