const { dateFormatLog } = require('@helpers/logTools');
const { EmbedBuilder } = require('discord.js');
const admin = require('firebase-admin');

// Détermine si on est à l'heure de publication
// Dernier jour du mois, à 18h (heure serveur)
function isCorrectTime() {
  const now = new Date();
  const day = now.getDate();
  const hour = now.getHours();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const isLastDay = day === lastDayOfMonth;
  return isLastDay && hour === 18;
}

// Vérifie si un embed avec même titre existe déjà récemment (pare-feu visuel)
async function isDuplicateMessage(channel, title) {
  try {
    const messages = await channel.messages.fetch({ limit: 50 });
    for (const [, message] of messages) {
      if (message.embeds.length > 0) {
        const embed = message.embeds[0];
        if (embed.title === title) return true;
      }
    }
    return false;
  } catch (error) {
    console.error(await dateFormatLog() + '[MonthlyReport] Erreur check doublon :', error);
    return false;
  }
}

async function createMonthlyReport(bot) {
  try {
    if (!isCorrectTime()) return; // Ne pas déclencher hors créneau

    const db = require('@loader/loadDatabase');
    const date = new Date();

    // === Verrou atomique & métadonnées de période ===
    // - Catégorie dédiée: collection Firestore `monthlyReports`
    // - Un document par mois: ID `YYYY-MM` (ex: 2025-08)
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 1-12
    const currentMonthKey = `${year}-${String(month).padStart(2, '0')}`;
    const periodStart = new Date(year, month - 1, 1, 0, 0, 0, 0); // 1er jour du mois
    const periodEnd = new Date(year, month, 0, 23, 59, 59, 999);   // Dernier jour du mois
    // TTL optionnel: nécessite une règle TTL Firestore (ici 13 mois après le début)
    const ttlAt = new Date(year, month - 1 + 13, 1, 0, 0, 0, 0);

    const monthlyReportDoc = db.collection('monthlyReports').doc(currentMonthKey);
    try {
      await monthlyReportDoc.create({
        status: 'pending',                        // verrou posé
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        year,
        month,
        periodStart,                              // Firestore stockera en Timestamp
        periodEnd,
        ttlAt,
      });
    } catch (err) {
      // 'already-exists' (string) ou 6 (gRPC) => déjà verrouillé/publié
      if (err.code === 'already-exists' || err.code === 6) {
        console.log(await dateFormatLog() + '[LoutroNews] Rapport déjà publié (verrou existant), annulation.');
        return;
      }
      throw err; // autre erreur => remonter
    }

    // === Récupération des salons ===
    const bestOfChannelID = bot.settings.ids.bestOfChannel;
    const notificationChannelID = bot.settings.ids.notificationChannel;
    const bestOfChannel = bot.channels.cache.get(bestOfChannelID);
    const notificationChannel = bot.channels.cache.get(notificationChannelID);

    if (!bestOfChannel || !notificationChannel) {
      // Statut d'échec si les salons ne sont pas trouvés
      await monthlyReportDoc.update({
        status: 'failed',
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
        error: 'Channel introuvable',
      }).catch(() => {});
      console.error(await dateFormatLog() + '[LoutroNews] Erreur : Channel introuvable.');
      return;
    }

    // === Construction du titre ===
    const title = `Loutro'news - ${date
      .toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, (c) => c.toUpperCase())}`;

    // Pare-feu visuel (normalement inutile avec le verrou, mais conservé pour sûreté)
    if (await isDuplicateMessage(bestOfChannel, title)) {
      await monthlyReportDoc.update({
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        skippedBecauseDuplicate: true,
        title,
      }).catch(() => {});
      console.log(await dateFormatLog() + '[LoutroNews] Rapport déjà présent visuellement, annulation.');
      return;
    }

    // === Préparation de l'embed ===
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setColor('#ffcc00')
      .setTimestamp();

    // --- Récupérer le top 5 des messages ---
    const profilesRef = db.collection('profiles');
    const snapshot = await profilesRef.get();
    let stats = [];
    let batch = db.batch();

    for (const doc of snapshot.docs) {
      const counterRef = doc.ref.collection('messages').doc('counter');
      const counterDoc = await counterRef.get();
      if (counterDoc.exists && counterDoc.data().totalMessages) {
        stats.push({ userId: doc.id, count: counterDoc.data().totalMessages });
        // Prépare le reset
        batch.set(
          counterRef,
          { totalMessages: 0, lastReset: new Date() },
          { merge: true }
        );
      }
    }

    stats.sort((a, b) => b.count - a.count);
    const topStats = stats.slice(0, 5);

    let messageSection = '📌 **Top 5 des gros flooders :**\n';
    if (topStats.length === 0) {
      messageSection += "_Aucun message enregistré ce mois-ci._\n";
    } else {
      for (let i = 0; i < topStats.length; i++) {
        let displayName = 'Utilisateur inconnu';
        try {
          const member = await bot.guilds.cache.first().members.fetch(topStats[i].userId);
          displayName = member.displayName || member.user.username;
        } catch {}
        messageSection += `#${i + 1} - ${displayName} - ${topStats[i].count} messages\n`;
      }
    }

    embed.setDescription(messageSection + '\n---\n📌 **Quelques citations du mois :**\n');

    // --- Récupérer les citations du mois ---
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    let newCitations = [];
    for (const doc of snapshot.docs) {
      const userCitations = await doc.ref.collection('citations').get();
      userCitations.forEach((citation) => {
        const data = citation.data();
        if (data.date && data.date.toDate() >= firstDayOfMonth && data.date.toDate() <= lastDayOfMonth) {
          newCitations.push({ userId: doc.id, text: data.quote, date: data.date.toDate() });
        }
      });
    }

    async function getUserDisplayName(userId) {
      try {
        const userDoc = await db.collection('profiles').doc(userId).get();
        if (userDoc.exists && userDoc.data().Prenom) return userDoc.data().Prenom;
        const member = await bot.guilds.cache.first().members.fetch(userId);
        return member.displayName || member.user.username;
      } catch {
        return 'Utilisateur inconnu';
      }
    }

    for (const citation of newCitations) {
      citation.userName = await getUserDisplayName(citation.userId);
    }

    if (newCitations.length <= 1) {
      embed.addFields({
        name: 'Citations du mois',
        value: "📋 Pas assez de citations ce mois-ci pour un best-of ! Vous avez été sympa ce mois-ci.",
        inline: false,
      });
    } else {
      let limited = newCitations.length > 5 ? newCitations.sort(() => 0.5 - Math.random()).slice(0, 5) : newCitations;
      limited.forEach((citation) => {
        embed.addFields({ name: `${citation.userName}`, value: citation.text, inline: false });
      });
    }

    // === Envoi ===
    const reportMessage = await bestOfChannel.send({ embeds: [embed] });
    const messageLink = `https://discord.com/channels/${reportMessage.guild.id}/${reportMessage.channel.id}/${reportMessage.id}`;
    await notificationChannel.send(`📢 L'actualité des loutres du mois est sortie ! Cliquez ici: ${messageLink}`);

    // Commit des resets + MAJ du doc du mois => 'sent'
    await batch.commit();
    await monthlyReportDoc.update({
      status: 'sent',
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      guildId: reportMessage.guild.id,
      channelId: reportMessage.channel.id,
      messageId: reportMessage.id,
      messageLink,
      title,
    });

    console.log(await dateFormatLog() + "[LoutroNews] Rapport mensuel envoyé et compteurs remis à 0.");
  } catch (error) {
    // Si le verrou a été posé, marquer l'échec
    try {
      const now = new Date();
      const failKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const db = require('@loader/loadDatabase');
      await db.collection('monthlyReports').doc(failKey).update({
        status: 'failed',
        failedAt: admin.firestore.FieldValue.serverTimestamp(),
        error: String(error?.message || error),
      });
    } catch (_) {}

    console.error(await dateFormatLog() + '[LoutroNews] Erreur :', error);
  }
}

module.exports = { createMonthlyReport };

