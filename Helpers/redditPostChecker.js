const reddit = require('./redditAPI');
const { debugLog } = require('./logTools');

async function checkRedditPosts(client) {
  if (!client.db) return;
  try {
    const snapshot = await client.db.collection('redditPosts').get();
    let processed = 0;
    const rateLimit = client.settings?.redditRateLimit || 100;
    const rateReserve = client.settings?.redditRateReserve || 10;
    for (const doc of snapshot.docs) {
      if (processed >= rateLimit - rateReserve) {
        console.warn('Quota Reddit atteint, arrêt de la vérification des posts.');
        break;
      }

      const remaining = typeof reddit.ratelimitRemaining === 'number' ? reddit.ratelimitRemaining : null;
      const used = typeof reddit.ratelimitUsed === 'number'
        ? reddit.ratelimitUsed
        : (typeof remaining === 'number' ? rateLimit - remaining : null);
      const reset = typeof reddit.ratelimitExpiration === 'number'
        ? Math.ceil((reddit.ratelimitExpiration - Date.now()) / 1000)
        : null;
      debugLog(client, 'reddit', `Reddit rate limit - Used: ${used}, Remaining: ${remaining}, Reset: ${reset}s`);
      if (remaining !== null && remaining <= rateReserve) {
        console.warn('Ratelimit Reddit faible, arrêt de la vérification des posts.');
        break;
      }

      const postId = doc.id;
      const { messageId, channelId } = doc.data();
      try {
        debugLog(client, 'reddit', `Vérification du post ${postId}`);
        await reddit.getSubmission(postId).fetch();
      } catch (err) {
        if (err.statusCode === 404) {
          const channel = client.channels.cache.get(channelId);
          if (channel) {
            try {
              const message = await channel.messages.fetch(messageId);
              await message.delete();
            } catch (discordErr) {
              console.error('Erreur suppression message Discord:', discordErr);
            }
          }
          await client.db.collection('redditPosts').doc(postId).delete();
        } else {
          console.error('Erreur vérification post Reddit:', err);
        }
      } finally {
        const remaining = typeof reddit.ratelimitRemaining === 'number' ? reddit.ratelimitRemaining : null;
        const used = typeof reddit.ratelimitUsed === 'number'
          ? reddit.ratelimitUsed
          : (typeof remaining === 'number' ? rateLimit - remaining : null);
        const reset = typeof reddit.ratelimitExpiration === 'number'
          ? Math.ceil((reddit.ratelimitExpiration - Date.now()) / 1000)
          : null;
        debugLog(client, 'reddit', `Reddit rate limit - Used: ${used}, Remaining: ${remaining}, Reset: ${reset}s`);
        if (remaining !== null && remaining < rateReserve) {
          console.warn('Quota bas, pause des requêtes.');
          if (reset !== null && reset > 0) {
            await new Promise(r => setTimeout(r, reset * 1000));
          }
        }
      }

      processed++;
    }
  } catch (err) {
    console.error('Erreur récupération redditPosts:', err);
  }
}

module.exports = { checkRedditPosts };
