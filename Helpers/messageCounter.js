// Helpers/messageCounter.js
const admin = require('firebase-admin');
const { dateFormatLog } = require('@helpers/logTools');

let messageCounts = {}; // Cache local pour les compteurs

/**
 * Incrémente le compteur de messages pour un utilisateur.
 * @param {string} userId
 */
function incrementMessageCount(userId) {
    if (!messageCounts[userId]) {
        messageCounts[userId] = 0;
    }
    messageCounts[userId]++;
}

/**
 * Push toutes les données en cache vers Firebase et reset le cache.
 */
async function flushMessageCounts() {
    const db = admin.firestore();
    const batch = db.batch();

    for (const [userId, count] of Object.entries(messageCounts)) {
        const profileRef = db.collection('profiles').doc(userId);
        const profileDoc = await profileRef.get();

        // ✅ Si le profil n'existe pas, on skip
        if (!profileDoc.exists) {
            continue;
        }

        const ref = profileRef.collection('messages').doc('counter');

        batch.set(ref, {
            totalMessages: admin.firestore.FieldValue.increment(count),
            lastUpdate: new Date()
        }, { merge: true });
    }

    await batch.commit();
    console.log(await dateFormatLog() + `Message counts pushed to Firebase : ${Object.keys(messageCounts).length} users`);

    messageCounts = {}; // Reset local
}

module.exports = {
    incrementMessageCount,
    flushMessageCounts
};
