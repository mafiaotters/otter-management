const db = require('../Loader/loadDatabase'); 

const rolePermissions = {
  "Le Parrain": 6,
  "Sottocapo": 5,
  "Enroloutre": 4,
  "Loutre Mafieuse": 3,
  "Loutre Naissante": 2
};

module.exports = async (bot, member) => {
  const discordName = member.user.username;
  const activeRef = db.collection('activeMembers');

  try {
    // Parcourir chaque rôle dans rolePermissions pour supprimer l'utilisateur si nécessaire
    for (const roleName of Object.keys(rolePermissions)) {
      const roleRef = activeRef.doc(roleName).collection('members');
      const memberDoc = await roleRef.doc(discordName).get();

      if (memberDoc.exists) {
        await roleRef.doc(discordName).delete();
        console.log(`Membre actif retiré : ${discordName} dans le rôle ${roleName}.`);
      }
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la collection d\'un membre:', error);
  }
};