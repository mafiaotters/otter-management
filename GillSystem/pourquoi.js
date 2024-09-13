
async function pourquoi(bot, interaction){
    await interaction.editReply({content: "Pourquoi on mange des gills ? \n- Le gill est un poisson, \n- Il ressemble aux gils de FF \n- Dans Nemo, c'est le parrain d'un gang \n\nBref, on en raffole ! ", ephemeral: true});
}

module.exports = pourquoi;