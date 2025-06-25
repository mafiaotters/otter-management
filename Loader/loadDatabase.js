const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();


console.log('Initialisation de Firestore..')

// Choix du fichier Firebase selon l'environnement
const isDev = process.env.DEV_MODE === 'true';
const firebaseFile = isDev ? '../firebase-dev.json' : '../firebase.json';
const serviceAccountPath = path.resolve(__dirname, firebaseFile);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath));

module.exports = function loadDatabase() {
  // Initialiser l'application Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

console.log('Firestore chargé !')
module.exports = db;
};



// OBSOLETE SUITE A LA MAJ D'INITIALIZATION. TOUT SE FAIT PAR FIRESTORE.JS DANS /HELPERS

/*const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const loadDatabase = () => {
  // Vérifie si Firebase Admin SDK est déjà initialisé
  if (!admin.apps.length) {
    // Initialise Firebase Admin SDK avec le fichier JSON de clé de service
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
  }

  let db;
  let isConnected = false;

  while (!isConnected) {
    try {
      db = admin.firestore();
      isConnected = true;
    } catch (error) {
      console.log('Error during connect to Firestore :', error);
      console.log('Try to connect...');
    }
  }
  return db;
};

module.exports = loadDatabase;*/
