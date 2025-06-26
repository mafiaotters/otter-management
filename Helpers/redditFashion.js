const RSSParser = require('rss-parser');
const { EmbedBuilder } = require('discord.js');
const parser = new RSSParser({
    headers: { 'User-Agent': 'Mozilla/5.0 (OtterBot RSS Reader)' },
    customFields: { item: ['media:thumbnail', 'media:content'] }
});
const { dateFormatLog } = require('./logTools');

function decodeHtmlEntities(str) {
    return str
        ? str
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
        : str;
}

function cleanImageUrl(url) {
    return url ? decodeHtmlEntities(url) : url;
}

function extractImage(content) {
    const imgMatch = content && content.match(/<img[^>]+src="([^"]+)"/);
    return imgMatch ? decodeHtmlEntities(imgMatch[1]) : null;
}

function getOriginalImage(content, thumbnailUrl) {
    const linkMatch =
        content &&
        content.match(/<a[^>]+href="(https:\/\/(?:i\.redd\.it|i\.imgur\.com)[^"]+)"/);
    if (linkMatch) {
        return decodeHtmlEntities(linkMatch[1]);
    }

    if (thumbnailUrl && thumbnailUrl.includes('preview.redd.it')) {
        let url = thumbnailUrl.split('?')[0];
        url = url.replace('external-preview.redd.it', 'i.redd.it');
        url = url.replace('preview.redd.it', 'i.redd.it');
        return cleanImageUrl(url);
    }
    return cleanImageUrl(thumbnailUrl);
}

async function isDuplicateMessage(channel, title) {
    try {
        const messages = await channel.messages.fetch({ limit: 40 });
        for (const [, message] of messages) {
            if (message.embeds.length > 0) {
                const embed = message.embeds[0];
                if (embed.title === title) {
                    return true;
                }
            }
        }
        return false;
    } catch (error) {
        console.error(await dateFormatLog() + 'Erreur lors de la vérification des messages existants :', error);
        return false;
    }
}

async function checkRedditFashion(bot, rssUrl, channelId) {
    try {
        const feed = await parser.parseURL(rssUrl);
        const channel = bot.channels.cache.get(channelId);
        if (!channel) {
            console.error(`${await dateFormatLog()}Le canal avec l'ID ${channelId} n'existe pas.`);
            return;
        }

        const now = Date.now();
        const freshnessHours = bot.settings.rssFreshnessHours || 5;

        for (const item of feed.items) {
            const pubDate = new Date(item.pubDate || item.isoDate).getTime();
            if (isNaN(pubDate)) {
                console.error(await dateFormatLog() + `Impossible de déterminer la date pour l'article : ${item.title}`);
                continue;
            }

            if (now - pubDate > freshnessHours * 60 * 60 * 1000) {
                continue;
            }

            if (await isDuplicateMessage(channel, item.title)) {
                console.log(await dateFormatLog() + `Post déjà publié, passage : ${item.title}`);
                continue;
            }

            const htmlContent = item['content:encoded'] || item.content;

            const mediaContent =
                item['media:content']?.$.url ||
                item['media:content']?.url ||
                item['media:thumbnail']?.$.url ||
                item['media:thumbnail'];
            const imageUrl = getOriginalImage(htmlContent, mediaContent);
            if (imageUrl) {
                console.log(await dateFormatLog() + `Image détectée : ${imageUrl}`);
            } else {
                console.log(await dateFormatLog() + `Aucune image trouvée pour : ${item.link}`);
            }

            const embed = new EmbedBuilder()
                .setTitle(item.title || 'Reddit Fashion')
                .setURL(item.link)
                .setFooter({ text: `Reddit • ${new Date(pubDate).toLocaleString('fr-FR')}` });

            if (imageUrl) {
                embed.setImage(imageUrl);
            }

            await channel.send({ embeds: [embed] });
            console.log(await dateFormatLog() + `Publication d'un post Reddit Fashion : ${item.title}`);
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du flux Reddit Fashion :', error);
    }
}

module.exports = { checkRedditFashion };
