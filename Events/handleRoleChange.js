const db = require('../Loader/loadDatabase'); // Assurez-vous que cette importation est correcte et que la fonction est appelée pour obtenir l'instance de la base de données

const rolePermissions = {
  "Le Parrain": 6,
  "Sottocapo": 5,
  "Loutre Mafieuse": 4,
  "Loutre Naissante": 3,
  "Loutre Retraitée": 2,
  "Copains des loutres": 1
};

module.exports = async (bot, oldMember, newMember) => {
  const timestamp = new Date().toISOString();
  const guildIds = ["675543520425148416", "653689680906420235"];
  const guildId = newMember.guild.id;

  if (!guildIds.includes(guildId)) return;

  const oldRoles = oldMember.roles.cache;
  const newRoles = newMember.roles.cache;

  const lostRoles = oldRoles.filter(role => !newRoles.has(role.id));
  const gainedRoles = newRoles.filter(role => !oldRoles.has(role.id));

  const discordId = newMember.id;
  const profilesRef = db.collection('profiles');
  const userDocRef = profilesRef.doc(discordId);



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
        });
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
      });
    } else {
      console.log(`[${timestamp}] Rôle ajouté à ${newMember.displayName}: ${gainedRole.name}; aucun rôle significatif gagné`);
    }
  }
});

;}