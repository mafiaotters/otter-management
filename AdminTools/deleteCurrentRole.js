// A mettre dans bot.js si besoin
// Supprime la variable "currentRole" de tout les profils:
// Besoin si on doit faire un recheck complet de 0, plus puissant que le scan de départ.

const db = require('../Loader/loadDatabase'); // Assurez-vous que cette importation est correcte
const admin = require('firebase-admin');


async function removeCurrentRoleFromProfiles() {
  const profilesCollectionRef = db.collection('profiles');
  const profilesSnapshot = await profilesCollectionRef.get();

  for (const profileDoc of profilesSnapshot.docs) {
    console.log(`Suppression de currentRole pour ${profileDoc.id}`);
    await profileDoc.ref.update({
      currentRole: admin.firestore.FieldValue.delete() // Utilisez FieldValue.delete() pour supprimer le champ
    });
  }

  console.log('Suppression de currentRole terminée pour tous les profils.');
}

module.exports = removeCurrentRoleFromProfiles;