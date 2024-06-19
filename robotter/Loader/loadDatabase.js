const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

const loadDatabase = () => {
  // Vérifie si Firebase Admin SDK est déjà initialisé
  if (!admin.apps.length) {
    // Initialise Firebase Admin SDK avec le fichier JSON de clé de service
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECTID}.firebaseio.com`
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

module.exports = loadDatabase;
