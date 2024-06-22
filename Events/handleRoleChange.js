const db = require('../Loader/loadDatabase');

const timestamp = new Date().toISOString();

module.exports = async (bot, oldMember, newMember) => {
  const guildIds = ["675543520425148416", "653689680906420235"];
  const guildId = newMember.guild.id;

  // Vérifier si le changement de rôle s'est produit dans une des guildes spécifiées
  if (!guildIds.includes(guildId)) return;

  // Trouver les nouveaux rôles qui n'étaient pas présents avant
  const newRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
  const roleNames = ["Loutre Mafieuse", "Copains des loutres", "Sottocapo"];

  // Vérifier si le nouveau rôle correspond à un des noms spécifiés
  const hasTargetRole = newRoles.some(role => roleNames.includes(role.name));

  if (!hasTargetRole) return; // Aucun des rôles ciblés n'a été ajouté

  const discordId = newMember.id;
  const profilesRef = db.collection('profiles');
  const userDocRef = profilesRef.doc(discordId);

  try {
    const doc = await userDocRef.get();
    if (doc.exists && doc.data().verified) {
      // L'utilisateur est vérifié et a reçu un des rôles ciblés, mettre à jour la BDD et le site
      console.log(`[${timestamp}] Action déclenchée pour l'utilisateur vérifié avec nouveau rôle: ${newMember.displayName}`);
      await newMember.user.send("Bonjour ! \nVous avez reçu le rôle **" + newRoles.first().name + "** sur le serveur **" + newMember.guild.name + "**. \n\nAvec ce rôle vous êtes apparu sur le site de la Mafia des Loutres ! N'hésitez pas à allez voir: \nhttps://ffxiv-lamafiadesloutres.fr \n\nSi vous souhaitez modifier votre profil sur le site, tapez ```/profile``` dans le channel mechaloutres: \nhttps://discord.com/channels/675543520425148416/677208300504219669");
    } else {
        // Envoyez
        await newMember.user.send("Bonjour ! \nVous avez reçu le rôle **" + newRoles.first().name + "** sur le serveur **" + newMember.guild.name + "**. \n\nAvec ce rôle vous êtes apparu sur le site ! Je vous invite à vous enregistrer par la commande ```/link``` sur le serveur pour modifier votre profil. Cliquez ici:\nhttps://discord.com/channels/675543520425148416/677208300504219669");
      console.log(`[${timestamp}] L'utilisateur ${newMember.displayName} n'est pas vérifié ou n'a pas de profil.`);
    }
  } catch (error) {
    console.error(timestamp + " Erreur lors de la vérification du profil de l'utilisateur", error);
  }
};