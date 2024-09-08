const db = require('../Loader/loadDatabase'); 

module.exports = async (bot, member) => {
  const discordName = member.user.username;
  const activeRef = db.collection('activeMembers');

  try {
    // Parcourir chaque rôle dans rolePermissions pour supprimer l'utilisateur si nécessaire
    for (const roleName of Object.keys(bot.rolePermissions)) {
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