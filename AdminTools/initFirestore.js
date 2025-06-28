const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Chargement de la config Firebase en fonction de l'environnement
const isDev = process.env.DEV_MODE === 'true';
const firebaseFile = isDev ? '../firebase-dev.json' : '../firebase.json';
const serviceAccountPath = path.resolve(__dirname, firebaseFile);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

// Initialisation Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const DRY_RUN = process.argv.includes('--dry-run');
const INSERT = process.argv.includes('--insert');

// Charger les paramètres d'initialisation depuis le fichier JSON
const settingsPath = path.resolve(__dirname, 'initSettings.json');
const { realMember, fakeMembers } = JSON.parse(
  fs.readFileSync(settingsPath, 'utf-8')
);

// Déterminer dynamiquement la liste des rôles à partir des membres
const roles = Array.from(
  new Set([realMember.role, ...fakeMembers.map(m => m.role)])
);

async function checkOrCreateDoc(docRef, initialData = {}) {
  console.log(`📂 Création forcée du document : ${docRef.path}`);
  if (!DRY_RUN) {
    await docRef.set(initialData);
    console.log(`✅ Document créé : ${docRef.path}`);
  } else {
    console.log(`📝 [DRY RUN] Simulation création pour ${docRef.path}`);
  }
}

async function init() {
  console.log(DRY_RUN ? '[DRY RUN MODE]' : '[INSERT MODE]');
  console.log(`📝 Rôles attendus : ${roles.join(', ')}`);

  for (const role of roles) {
    const docRef = db.collection('activeMembers').doc(role);
    const initialData = { membersCount: 0 };

    try {
      await checkOrCreateDoc(docRef, initialData);
    } catch (err) {
      console.error(`❌ Erreur lors de la création du document ${docRef.path} :`, err);
      continue;
    }

    // Rassembler les membres à insérer pour ce rôle
    const membersToAdd = [];

    if (realMember.role === role) {
      membersToAdd.push(realMember);
    }

    fakeMembers.forEach(m => {
      if (m.role === role) {
        membersToAdd.push(m);
      }
    });

    if (membersToAdd.length === 0) {
      console.log(`   Aucun membre à insérer pour "${role}"`);
      continue;
    }

    // Ajout membres dans sous-collection 'members'
    for (const member of membersToAdd) {
      const memberDoc = docRef.collection('members').doc(member.discordId);
      const memberData = {
        pseudo: member.pseudo,
        role: member.role,
        discordId: member.discordId,
        createdAt: new Date(),
      };
      try {
        if (!DRY_RUN) {
          await memberDoc.set(memberData);
          console.log(`   ➕ Membre inséré: [${member.discordId}] ${member.pseudo} (${member.role})`);
        } else {
          console.log(`   📝 [DRY RUN] Membre simulé: [${member.discordId}] ${member.pseudo} (${member.role})`);
        }
      } catch (err) {
        console.error(`   ❌ Erreur insertion membre ${member.discordId} :`, err);
      }
    }

    // Mettre à jour le compteur membersCount
    if (!DRY_RUN) {
      try {
        await docRef.update({ membersCount: membersToAdd.length });
        console.log(`   📊 Compteur 'membersCount' mis à jour pour "${role}"`);
      } catch (err) {
        console.error(`   ❌ Erreur mise à jour compteur pour "${role}" :`, err);
      }
    } else {
      console.log(`   📝 [DRY RUN] Simulation mise à jour compteur 'membersCount' pour "${role}"`);
    }
  }

  // Exemple: création vide pour autres collections
  const otherCollections = ['gillSystem', 'profiles'];
  for (const colName of otherCollections) {
    const colRef = db.collection(colName).doc('initDoc');
    try {
      await checkOrCreateDoc(colRef, { initializedAt: new Date() });
    } catch (err) {
      console.error(`❌ Erreur création document ${colRef.path} :`, err);
    }
  }

  console.log('🎉 Initialisation terminée.');
}

init().then(() => process.exit(0)).catch(err => {
  console.error('Erreur fatale durant l\'initialisation:', err);
  process.exit(1);
});
