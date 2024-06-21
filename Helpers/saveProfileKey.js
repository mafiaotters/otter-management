const db = require('../Loader/loadDatabase');

async function saveProfileKey(discordId, keyGenerated, lodestoneId, discordName) {
  const profilesRef = db.collection('profiles');
  const userDocRef = profilesRef.doc(discordId);

  try {
    const doc = await userDocRef.get();
    if (!doc.exists) {
      // La collection de l'utilisateur n'existe pas, la créer et sauvegarder la clé
      await userDocRef.set({ keyUser: keyGenerated, discordName: discordName, lodestoneId: lodestoneId});
      console.log(`Clé sauvegardée pour l'utilisateur ${discordName}`);
    } else {
      // La collection existe déjà, mettre à jour la clé
      await userDocRef.update({ keyUser: keyGenerated, discordName: discordName, lodestoneId: lodestoneId });
      console.log(`Clé mise à jour pour l'utilisateur: ${discordName}`);
    }
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la clé pour " + discordName, error);
  }
}

module.exports = saveProfileKey;