const db = require('../Loader/loadDatabase');

async function updateUserGills(user, gillsToAdd) {
  // Référence au premier emplacement : "profiles" > "discord.username" > "gillSystem" > gill
  const firstLocationRef = db.collection('profiles').doc(user.username).collection('gillSystem').doc('gill');

  // Référence au deuxième emplacement : "gillSystem" > "discord.id" > gill
  const secondLocationRef = db.collection('gillSystem').doc(user.id);

  try {
    // Mise à jour au premier emplacement
    await updateGills(firstLocationRef, gillsToAdd, user.username);
    // Mise à jour au deuxième emplacement
    await updateGills(secondLocationRef, gillsToAdd, user.id);
  } catch (error) {
    console.error("Erreur lors de la mise à jour des gills pour " + user.username, error);
  }
}

async function updateGills(docRef, gillsToAdd, identifier) {
  const doc = await docRef.get();
  if (!doc.exists) {
    await docRef.set({ gills: gillsToAdd });
    console.log(`Gills initialisés à ${gillsToAdd} G pour ${identifier}`);
  } else {
    const currentGills = doc.data().gills;
    const newGills = currentGills + gillsToAdd;
    await docRef.update({ gills: newGills });
    console.log(`Gills mis à jour à ${newGills} G pour ${identifier}`);
  }
}

module.exports = updateUserGills;