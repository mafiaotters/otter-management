
async function pourquoi(bot, interaction){
    await interaction.editReply({content: "Pourquoi les Loutres mangent des gills ? \n- Le gill est un poisson, \n- Il ressemble aux gils de FF \n- Dans Nemo, c'est le parrain d'un gang \n\nBref, on en raffole ! ", ephemeral: false});
}

module.exports = pourquoi;