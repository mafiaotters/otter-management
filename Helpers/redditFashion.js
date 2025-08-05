// Recherche et publie le Fashion Report depuis Reddit
const reddit = require('./redditAPI');
const { EmbedBuilder } = require('discord.js');
const { isDuplicateMessage } = require('./duplicateChecker');
const { debugLog } = require('./logTools');
const { getRateLimitInfo, getRateConfig } = require('./redditRateLimit');

/**
 * Cherche le dernier Fashion Report sur Reddit et le publie sur Discord.
 * @param {object} client - Instance du bot Discord.
 */
async function checkRedditFashion(client) {
  try {
    const { rateLimit, rateWindow, rateReserve } = getRateConfig(client);

    // Vérification du quota avant la requête
    let { used, remaining, reset } = getRateLimitInfo(reddit, rateLimit, rateWindow);
    debugLog(client, 'reddit', `Reddit rate limit - Used: ${used}, Remaining: ${remaining}, Reset: ${reset}s`);
    if (remaining <= rateReserve) {
      console.warn('Ratelimit restant faible, temporisation des appels futurs.');
      if (reset > 0) {
        await new Promise(resolve => setTimeout(resolve, reset * 1000));
      }
      ({ used, remaining, reset } = getRateLimitInfo(reddit, rateLimit, rateWindow));
      debugLog(client, 'reddit', `Reddit rate limit - Used: ${used}, Remaining: ${remaining}, Reset: ${reset}s`);
      if (remaining <= rateReserve) return; // Toujours insuffisant après attente
    }

    const subreddit = client.reddit?.fashionSubreddit || 'ffxiv';
    const query = client.reddit?.fashionQuery || 'author:Gottesstrafe Fashion Report - Full Details - For Week of';
    const sort = client.reddit?.fashionSort || 'new';
    const time = client.reddit?.fashionTime || 'week';

    debugLog(client, 'reddit', `Recherche Fashion Report sur r/${subreddit}`);
    const results = await reddit.getSubreddit(subreddit).search({ query, sort, time });

    ({ used, remaining, reset } = getRateLimitInfo(reddit, rateLimit, rateWindow));
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

    if (await isDuplicateMessage(channel, title)) return; // Évite les doublons

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
    console.error('Erreur Reddit:', err);
  }
}

module.exports = { checkRedditFashion };
