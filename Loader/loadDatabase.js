const admin = require('firebase-admin');
require('dotenv').config();

console.log('Initialisation de Firestore..');

// Lire le fichier JSON et le convertir en objet
const serviceAccount = JSON.parse(process.env.KEYSFIREBASE);

// Initialiser l'application Firebase Admin si nécessaire
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

console.log('Firestore chargé !');

// Exporter directement l'instance pour simplifier son utilisation
module.exports = db;
