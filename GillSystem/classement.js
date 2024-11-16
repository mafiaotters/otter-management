const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const db = require('../Loader/loadDatabase');

const {dateFormatLog} = require('../Helpers/logTools');


async function getDisplayName(discordId) {
    const profilesRef = db.collection('profiles');
    const userDocRef = profilesRef.doc(discordId);
    try {
      const doc = await userDocRef.get();
      if (doc.exists) {
        const userData = doc.data();
        const prenom = userData.Prenom || "";
        const nom = userData.Nom || "";
        const displayName = `${prenom} ${nom}`;
        return displayName;
      } else {
        console.log(`${await dateFormatLog()}Aucun document trouvé pour l'ID: ${discordId}`);
        return null;
      }
    } catch (error) {
      console.error(await dateFormatLog() + "Erreur lors de la récupération du displayName", error);
      return null;
    }
  }

  async function classement(bot, interaction) {
    const gillSystemRef = db.collection('gillSystem');
    const querySnapshot = await gillSystemRef.orderBy('gills', 'desc').limit(15).get();

    let embedDescription = '';
    for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const displayName = await getDisplayName(doc.id); // Utilise getDisplayName pour récupérer le nom d'affichage
        embedDescription += `${displayName || data.displayName} : ${data.gills} :fish:\n`; // Utilise displayName ou data.displayName comme fallback
    }

    const embed = new EmbedBuilder()
        .setTitle('Classement des Gills <:otter_pompom:747554032582787163>')
        .setDescription(embedDescription)
        .setColor('#0099ff');

    await interaction.channel.send({ embeds: [embed], ephemeral: false });
    await interaction.deleteReply();
    
}

module.exports = classement;