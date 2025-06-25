const RSSParser = require('rss-parser');
const parser = new RSSParser();
const { dateFormatLog } = require('./logTools');

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

            const embed = {
                title: item.title || 'Reddit Fashion',
                url: item.link,
                footer: { text: `Reddit • ${new Date(pubDate).toLocaleString('fr-FR')}` },
            };

            await channel.send({ embeds: [embed] });
            console.log(await dateFormatLog() + `Publication d'un post Reddit Fashion : ${item.title}`);
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du flux Reddit Fashion :', error);
    }
}

module.exports = { checkRedditFashion };
