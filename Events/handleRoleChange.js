const db = require('../Loader/loadDatabase'); // Assurez-vous que cette importation est correcte et que la fonction est appelée pour obtenir l'instance de la base de données

const timestamp = new Date().toISOString();

const rolePermissions = {
  "Copains des loutres": 1,
  "Loutre Retraitée": 2,
  "Loutre Naissante": 3,
  "Loutre Mafieuse": 4,
  "Sottocapo": 5,
  "Le Parrain": 6
};

module.exports = async (bot, oldMember, newMember) => {
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



  // Prendre la liste des rôles du type, et prendre le rôle le plus élevé

  lostRoles.forEach(async lostRole => {
    if (rolePermissions[lostRole.name]) {
      const highestRemainingRole = newRoles
        .filter(role => rolePermissions[role.name])
        .sort((a, b) => rolePermissions[b.name] - rolePermissions[a.name])
        .first();

      if (highestRemainingRole) {
        console.log(`[${timestamp}] Rôle retiré à ${newMember.displayName}: haut rôle restant: ${highestRemainingRole.name}`);
      }else{
        console.log(`[${timestamp}] Rôle retiré à ${newMember.displayName}: aucun rôle restant`);
      }
    }
  });



  gainedRoles.forEach(async gainedRole => {
    console.log('ROLE GAGNE: ' + gainedRole)
    if (rolePermissions[gainedRole.name]) {
      // Récupérer la priorité la plus élevée parmi les rôles existants
      const highestExistingRolePriority = newMember.roles.cache
        .filter(role => rolePermissions[role.name])
        .reduce((max, role) => Math.max(max, rolePermissions[role.name]), 0);
      console.log('ROLE PRIORIETE EXISTANTE: ' + highestExistingRolePriority)
      console.log('ROLE PRIORIETE NOUVEAU: ' + rolePermissions[gainedRole.name])
      // Vérifier si le nouveau rôle a une priorité supérieure
      if (rolePermissions[gainedRole.name] > highestExistingRolePriority) {
        console.log('ROLE PRIORIETE SUPERIEURE')
        try {
          const doc = await userDocRef.get();
          if (doc.exists && doc.data().verified) {
            // Actions pour un utilisateur vérifié avec un nouveau rôle de priorité supérieure
            console.log(`[${timestamp}] Rôle ajouté à ${newMember.displayName}(lodestone vérifié): priorité supérieure à un rôle existant`)
          } else {
            // Actions pour un utilisateur non vérifié ou sans profil avec un nouveau rôle de priorité supérieure
            console.log(`[${timestamp}] Rôle ajouté à ${newMember.displayName}(lodestone non vérifié): priorité supérieure à un rôle existant`)
          }
        } catch (error) {
          console.error(`[${timestamp}] Erreur lors de la vérification du profil de l'utilisateur ${newMember.displayName}`, error);
        }
      } else {
        // Le nouveau rôle n'a pas une priorité supérieure, vous pouvez choisir de ne rien faire ou de gérer ce cas spécifiquement
        console.log(`[${timestamp}] Rôle ajouté à ${newMember.displayName}: priorité inférieure ou égale à un rôle existant`)
      }
    }
    newMember.roles.cache.clear();
    oldMember.roles.cache.clear();
  });}