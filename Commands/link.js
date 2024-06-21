const Discord = require('discord.js');
const crypto = require('crypto');
const saveProfileKey = require('../Helpers/saveProfileKey');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');


function generateKey() {
    // Utilisez 8 pour obtenir 16 caractères après la conversion en hexadécimal
    return crypto.randomBytes(8).toString('hex');
  }

module.exports = {
    
    name: "link",
    description: "Link your ID",
    permission: "Aucune",
    dm: true,
    category: "User",
    options: [
        {
            type: "STRING",
            name: "lodestone-id",
            description: "Votre ID Lodestone",
            required: true,
            autocomplete: false,
        }
    ],

    async run(bot, interaction, args){
        const lodestoneId = interaction.options.getString('lodestone-id');
        const discordId = interaction.user.id;

        let command;
        console.log('Lodestone ID en vérification: ' + interaction.options.getString("lodestone-id"))

        // Vérifier si lodestoneId est un nombre et est compris entre 1,000,000 et 999,999,999 (plage des ID Lodestone valides)
        const lodestoneIdInt = parseInt(lodestoneId, 10); // Convertir en nombre
    if(isNaN(lodestoneIdInt) || lodestoneIdInt < 1000000 || lodestoneIdInt > 999999999) {
        console.log('ID Lodestone invalide : ' + lodestoneIdInt)
        return interaction.reply({content:"Saisissez un ID Lodestone valide.", ephemeral: true});
    }

    // Générer une clé d'autorisation unique pour le profil
    // Message de génération
    const embed = new EmbedBuilder()
      .setTitle("Génération d'une clé...")
      .setDescription("Vous devrez la rentrer sur votre profil lodestone.")
      .setColor("#00b0f4")
      .setTimestamp();

      const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
        .setURL('https://eu.finalfantasyxiv.com/lodestone/character/' + lodestoneIdInt + '/')
        .setLabel('Aller sur votre profil Lodestone')
        .setStyle(ButtonStyle.Link)
      );

      await interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
      
      // GENERATION DE LA CLE
      const keyGenerated = 'otterVerify-' + generateKey();
      console.log('Clé générée: ' + keyGenerated)

      // Sauvegarde de la clé dans la base de données Firestore associé au discordID
      await saveProfileKey(discordId, keyGenerated, lodestoneIdInt, interaction.user.username);


      // Update message avec la clé générée
      embed.setTitle('Clé générée: ' + keyGenerated)
      embed.setDescription('Rentrez la dans votre description lodestone')
      await interaction.editReply({ embeds: [embed], ephemeral: true});

    }
}