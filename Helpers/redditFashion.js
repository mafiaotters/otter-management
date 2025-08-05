const reddit = require('./redditAPI');
const { EmbedBuilder } = require('discord.js');
const { isDuplicateMessage } = require('./duplicateChecker');
const { debugLog } = require('./logTools');
const { getRateLimitInfo } = require('./redditRateLimit');

async function checkRedditFashion(client) {
  try {
    debugLog(client, 'reddit', 'Recherche Fashion Report sur r/ffxiv');
    const results = await reddit.getSubreddit('ffxiv').search({
      query: 'author:Gottesstrafe Fashion Report - Full Details - For Week of',
      sort: 'new',
      time: 'week'
    });

    const rateLimit = client.reddit?.rateLimit || 100;
    const rateWindow = client.reddit?.rateWindow || 600;
    const rateReserve = client.reddit?.rateReserve || 10;
    const { used, remaining, reset } = getRateLimitInfo(reddit, rateLimit, rateWindow);
    debugLog(client, 'reddit', `Reddit rate limit - Used: ${used}, Remaining: ${remaining}, Reset: ${reset}s`);
    if (remaining <= rateReserve) {
      console.warn('Ratelimit restant faible, temporisation des appels futurs.');
      if (reset > 0) {
        await new Promise(resolve => setTimeout(resolve, reset * 1000));
      }
    }

    if (!results.length) return;

    const post = results[0];
    const title = post.title;
    const link = `https://redd.it/${post.id}`;
    const channel = client.channels.cache.get(client.reddit.fashionChannelId);
    if (!channel) return;

    if (await isDuplicateMessage(channel, title)) return;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setURL(link)
      .setFooter({ text: `Reddit • ${new Date(post.created_utc * 1000).toLocaleString('fr-FR')}` });

    if (post.url && post.url.match(/\.(png|jpe?g|gif)$/)) {
      embed.setImage(post.url);
    } else if (post.preview?.images?.[0]) {
      embed.setImage(post.preview.images[0].source.url.replace(/&amp;/g, '&'));
    }

    const message = await channel.send({ embeds: [embed] });

    // Enregistre l'association message Discord / post Reddit si la base est disponible
    if (client.db) {
      try {
        await client.db.collection('redditPosts').doc(post.id).set({
          messageId: message.id,
          channelId: channel.id
        });
      } catch (saveErr) {
        console.error('Erreur enregistrement Reddit:', saveErr);
      }
    } else {
      console.warn('Base de données indisponible, enregistrement du post Reddit ignoré.');
    }
  } catch (err) {
    console.error("Erreur Reddit:", err);
  }
}

module.exports = { checkRedditFashion };
