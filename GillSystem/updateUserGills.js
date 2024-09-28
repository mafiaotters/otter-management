const db = require('../Loader/loadDatabase'); 

async function updateUserGills(user, gillsToAdd) {
  const profilesGillSystemRef = db.collection('gillSystem').doc(user.id)

  const discordName = user.username
  const profileRef = db.collection('profiles').doc(discordName);



  try {    
    // Update in gillSystem collection
    updateGillFirestore(profilesGillSystemRef, gillsToAdd);
    // Update in profiles collection
    updateGillFirestore(profileRef, gillsToAdd);

    }catch (error) {
    console.error("Erreur lors de la mise à jour des gills pour " + discordName, error);
  }
}

async function updateGillFirestore(location, gillsToAdd) {
    const doc = await location.get();

    if (!doc.exists) {
        // Si le document de l'utilisateur n'existe pas, créez-le avec les gills initiaux
        await location.set({ gillSystem: {gills: gillsToAdd }});
    } else {
        // Si le document existe, vérifiez d'abord si les gills actuels + gillsToAdd sont supérieurs à 0
        const currentGills = doc.data().gills;
        const newGills = currentGills + gillsToAdd;
        if (currentGills > 0) {
            // Si oui, mettez à jour les gills de l'utilisateur
            await location.update({ gillSystem: {gills: newGills, lastCollected: await new Date()}});
        } else {
            // Si non, définissez les gills à 0 avec set, car update ne peut pas être utilisé pour créer des champs
            await location.update({ gillSystem: {gills: gillsToAdd, lastCollected: await new Date()}});
        }
    }
}


module.exports = updateUserGills;