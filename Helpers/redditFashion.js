const RSSParser = require('rss-parser');
const { decode } = require('html-entities');
const { EmbedBuilder } = require('discord.js');
const parser = new RSSParser({
    headers: { 'User-Agent': 'Mozilla/5.0 (OtterBot RSS Reader)' },
    customFields: { item: ['media:thumbnail', 'media:content'] }
});
const { dateFormatLog } = require('./logTools');

function decodeHtmlEntities(text) {
    return text ? decode(text) : text;
}

function cleanImageUrl(url) {
    if (!url) return null;
    return decodeHtmlEntities(url).replace(/&amp;/g, '&');
}

function extractImage(html) {
    if (!html) return null;
    const match = html.match(/<img[^>]+src="([^">]+)"/i);
    return match ? cleanImageUrl(match[1]) : null;
}

function getOriginalImage(html, mediaContent) {
    let url = extractImage(html);
    if (!url && mediaContent) {
        if (typeof mediaContent === 'string') {
            url = mediaContent;
        } else if (mediaContent.$?.url) {
            url = mediaContent.$.url;
        } else if (mediaContent.url) {
            url = mediaContent.url;
        }
        url = cleanImageUrl(url);
    }
    if (url) {
        url = url.replace(/preview\.redd\.it/, 'i.redd.it').split('?')[0];
    }
    return url || null;
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

        for (const item of feed.items) {
            const pubDate = new Date(item.pubDate || item.isoDate).getTime();
            if (isNaN(pubDate)) {
                console.error(await dateFormatLog() + `Impossible de déterminer la date pour l'article : ${item.title}`);
                continue;
            }

            if (now - pubDate > 5 * 60 * 60 * 1000) {
                continue;
            }

            if (await isDuplicateMessage(channel, item.title)) {
                console.log(await dateFormatLog() + `Post déjà publié, passage : ${item.title}`);
                continue;
            }

            const imageUrl = getOriginalImage(item.content, item['media:content']);

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
