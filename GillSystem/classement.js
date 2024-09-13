async function collecte(bot, interaction){
    // Logique de collecte ici
    await interaction.editReply({content: "Classement effectuée.", ephemeral: true});
}
module.exports = collecte;