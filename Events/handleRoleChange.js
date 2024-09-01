const db = require('../Loader/loadDatabase'); // Assurez-vous que cette importation est correcte et que la fonction est appelée pour obtenir l'instance de la base de données

const rolePermissions = {
  "Le Parrain": 6,
  "Sottocapo": 5,
  "Enroloutre": 4,
  "Loutre Mafieuse": 3,
  "Loutre Naissante": 2
};

async function updateActiveMembers(newMember, highestGainedRoleName) {
  try{
  const discordName = newMember.user.username;
  const profilesRef = db.collection('profiles');
  const userDocRef = profilesRef.doc(discordName);
  const activeRef = db.collection('activeMembers');

  // Récupérer le pseudo principal de l'utilisateur depuis la collection profiles
  const profileDoc = await userDocRef.get();
  let mainCharacterName = "";
  if (profileDoc.exists && profileDoc.data().mainCharacter) {
    mainCharacterName = profileDoc.data().mainCharacter;
  } else {
    console.log(`Profil ou mainCharacter non défini pour l'utilisateur: ${discordName}`);
    return; // Sortir de la fonction si le pseudo principal n'est pas trouvé
  }

  // Parcourir chaque rôle dans rolePermissions pour retirer l'utilisateur si nécessaire
  for (const roleName of Object.keys(rolePermissions)) {
    const roleRef = activeRef.doc(roleName).collection('members');
    const memberDoc = await roleRef.doc(discordName).get();

    if (memberDoc.exists) {
      await roleRef.doc(discordName).delete();
      console.log(`Retiré de la collection ${roleName} pour ${discordName}`);
    }
  }

  // Ajouter le discordId dans la collection du grade le plus élevé avec le pseudo principal
  const highestRoleRef = activeRef.doc(highestGainedRoleName).collection('members');
  await highestRoleRef.doc(discordName).set({pseudo: mainCharacterName}); 
  console.log(`Ajouté à la collection ${highestGainedRoleName} pour ${discordName} avec le pseudo: ${mainCharacterName}`);

} catch (error) {
  console.error('Erreur lors de la mise à jour des membres actifs:', error);
}
}
module.exports = async (bot, oldMember, newMember) => {
try{
  const timestamp = new Date().toISOString();
  const guildIds = ["675543520425148416", "653689680906420235"];
  const guildId = newMember.guild.id;

  if (!guildIds.includes(guildId)) return;

  const oldRoles = oldMember.roles.cache;
  const newRoles = newMember.roles.cache;

  const lostRoles = oldRoles.filter(role => !newRoles.has(role.id));
  const gainedRoles = newRoles.filter(role => !oldRoles.has(role.id));

  const discordName = newMember.user.username;
  const profilesRef = db.collection('profiles');
  const userDocRef = profilesRef.doc(discordName);

  // Prendre la liste des rôles du gars, et prendre le rôle le plus élevé

  lostRoles.forEach(async lostRole => {
    if (rolePermissions[lostRole.name]) {
      const highestRemainingRole = newRoles
        .filter(role => rolePermissions[role.name])
        .sort((a, b) => rolePermissions[b.name] - rolePermissions[a.name])
        .first();

      if (highestRemainingRole) {
        console.log(`[${timestamp}] Rôle retiré à ${newMember.displayName}: ${lostRole.name}; haut rôle restant: ${highestRemainingRole.name}`);
        // Update statut membre dans Firestore (Oui cette update servira parfois à rien. Vérificaiton utilité update plus tard)
        await userDocRef.update({
          currentRole: highestRemainingRole.name
        })
        updateActiveMembers(newMember, highestRemainingRole.name)
        ;
      }else{
        console.log(`[${timestamp}] Rôle retiré à ${newMember.displayName}: ${lostRole.name}; aucun rôle important restant`);
      }
    }
  });

gainedRoles.forEach(async gainedRole => {
  if (rolePermissions[gainedRole.name]) {
    const highestGainedRole = newRoles
      .filter(role => rolePermissions[role.name])
      .sort((a, b) => rolePermissions[b.name] - rolePermissions[a.name])
      .first();

    if (highestGainedRole) {
      console.log(`[${timestamp}] Rôle ajouté à ${newMember.displayName}: ${gainedRole.name}; haut rôle actuel: ${highestGainedRole.name}`);
      await userDocRef.update({
        currentRole: highestGainedRole.name
      })
      updateActiveMembers(newMember, highestGainedRole.name)
      ;
    } else {
      console.log(`[${timestamp}] Rôle ajouté à ${newMember.displayName}: ${gainedRole.name}; aucun rôle significatif gagné`);
    }
  }
});

} catch (error) {
  console.error('Erreur lors de la gestion des rôles:', error);
}
}