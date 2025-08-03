const reddit = require('./redditAPI');
const { EmbedBuilder } = require('discord.js');
const { isDuplicateMessage } = require('./duplicateChecker');

async function checkRedditFashion(client) {
  try {
    const results = await reddit.getSubreddit('ffxiv').search({
      query: 'author:Gottesstrafe Fashion Report - Full Details - For Week of',
      sort: 'new',
      time: 'week'
    });

    if (!results.length) return;

    const post = results[0];
    const title = post.title;
    const link = `https://redd.it/${post.id}`;
    const channel = client.channels.cache.get(client.settings.ids.redditFashionChannel);
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

    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error("Erreur Reddit:", err);
  }
}

module.exports = { checkRedditFashion };
