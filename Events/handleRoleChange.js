const db = require('../Loader/loadDatabase');

const timestamp = new Date().toISOString();

module.exports = async (bot, oldMember, newMember) => {
  const guildIds = ["675543520425148416", "653689680906420235"];
  const guildId = newMember.guild.id;

  // Vérifier si le changement de rôle s'est produit dans une des guildes spécifiées
  if (!guildIds.includes(guildId)) return;

  // Trouver les nouveaux rôles qui n'étaient pas présents avant
  const newRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
  // Trouver les anciens rôles qui ne sont plus présents
  const lostRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
  const roleNames = ["Loutre Mafieuse", "Copains des loutres", "Sottocapo"];

  // Vérifier si le nouveau rôle correspond à un des noms spécifiés
  const hasTargetRole = newRoles.some(role => roleNames.includes(role.name));
  // Vérifier si l'ancien rôle correspond à un des noms spécifiés
  const hasLostTargetRole = lostRoles.some(role => roleNames.includes(role.name));


  if (!hasTargetRole && !hasLostTargetRole) return; // Aucun des rôles ciblés n'a été ajouté/perdu

  const discordId = newMember.id;
  const profilesRef = db.collection('profiles');
  const userDocRef = profilesRef.doc(discordId);

  try {
    const doc = await userDocRef.get();
    if (doc.exists && doc.data().verified) {
      // L'utilisateur est vérifié et a RECU un des rôles ciblés
      if(hasTargetRole){
        const newRoleName = newRoles.first().name; // Prendre le nom du premier nouveau rôle
        console.log(`[${timestamp}] Nouveau rôle pour ${newMember.displayName}, rôle: ${newRoleName}`);
        await userDocRef.update({ lastRole: newRoleName }); // Mettre à jour le document avec le nouveau rôle      
      await newMember.user.send("Bonjour ! \nVous avez reçu le rôle **" + newRoles.first().name + "** sur le serveur **" + newMember.guild.name + "**. \n\nAvec ce rôle vous êtes apparu sur le site de la Mafia des Loutres ! N'hésitez pas à allez voir: \nhttps://ffxiv-lamafiadesloutres.fr \n\nSi vous souhaitez modifier votre profil sur le site, tapez ```/profile``` dans le channel mechaloutres: \nhttps://discord.com/channels/675543520425148416/677208300504219669");
    }
      if(hasLostTargetRole){
        console.log(`[${timestamp}] Rôle retiré à ${newMember.displayName}, rôle: ${lostRoles.first().name}`);
        //await newMember.user.send("Bonjour ! \nVous avez perdu le rôle **" + newRoles.first().name + "** sur le serveur **" + newMember.guild.name + "**.");
      } 
  }else {
        // Envoie un message privé à l'utilisateur pour l'inviter à se lier à son profil
        await newMember.user.send("Bonjour ! \nVous avez reçu le rôle **" + newRoles.first().name + "** sur le serveur **" + newMember.guild.name + "**. \n\nAvec ce rôle vous êtes apparu sur le site ! Je vous invite à vous enregistrer par la commande ```/link``` sur le serveur pour modifier votre profil. Cliquez ici:\nhttps://discord.com/channels/675543520425148416/677208300504219669");
      console.log(`[${timestamp}] L'utilisateur ${newMember.displayName} n'est pas vérifié ou n'a pas de profil.`);
  }
  } catch (error) {
    console.error(timestamp + " Erreur lors de la vérification du profil de l'utilisateur", error);
  }
};