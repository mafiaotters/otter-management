const RSSParser = require('rss-parser');
const { dateFormatLog } = require('./logTools');

/**
 * Convertit une date UTC en fuseau horaire français.
 * @param {string} utcDateStr - La date au format UTC.
 * @returns {string} - La date convertie au fuseau horaire français.
 */
function convertToFrenchTime(utcDateStr) {
    const utcDate = new Date(utcDateStr);

    // Vérifier si la date est valide
    if (isNaN(utcDate.getTime())) {
        throw new Error(`Date invalide : ${utcDateStr}`);
    }

    // Convertir en fuseau horaire français
    const options = { 
        timeZone: 'Europe/Paris', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    };

    const formatter = new Intl.DateTimeFormat('fr-FR', options);
    return formatter.format(utcDate);
}

/**
 * Vérifie si un message avec le même titre d'embed existe déjà dans les 10 derniers messages.
 * @param {TextChannel} channel - Le channel Discord où vérifier les messages.
 * @param {string} title - Le titre du message à publier.
 * @returns {Promise<boolean>} - Retourne true si un doublon est trouvé, sinon false.
 */
async function isDuplicateMessage(channel, title) {
    try {
        const messages = await channel.messages.fetch({ limit: 40 }); // Récupère les 40 derniers messages
        for (const [, message] of messages) {
            if (message.embeds.length > 0) {
                const embed = message.embeds[0];
                if (embed.title === title) {
                    return true; // Doublon trouvé
                }
            }
        }
        return false; // Aucun doublon trouvé
    } catch (error) {
        console.error(await dateFormatLog() + 'Erreur lors de la vérification des messages existants :', error);
        return false; // Par sécurité, on considère qu'il n'y a pas de doublon
    }
}

/**
 * Fonction pour extraire l'image depuis le contenu HTML.
 * @param {string} content - Contenu HTML de la balise <content>.
 * @returns {string|null} - URL de l'image ou null si aucune image.
 */
function extractImage(content) {
    const imgTagMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgTagMatch ? imgTagMatch[1] : null;
}

/**
 * Fonction pour vérifier et envoyer les mises à jour des flux RSS.
 * @param {Client} bot - L'instance du bot Discord.
 * @param {string} rssUrl - L'URL du flux RSS à surveiller.
 */
async function checkRSS(bot, rssUrl) {
    try {
        console.log(await dateFormatLog() + `Début vérification du flux RSS : ${rssUrl}`);
        // Définir un user-agent personnalisé pour respecter la politique d'accès de Reddit
        const userAgent = bot.settings.rssUserAgent || 'otter-management-bot/1.0 (by u/OtterChantal-bot)';
        const parser = new RSSParser({
            headers: { 'User-Agent': userAgent }
        });

        // Récupérer le flux RSS
        const feed = await parser.parseURL(rssUrl);

        // Récupérer l'heure actuelle
        const now = Date.now();
        const freshnessHours = bot.settings.rssFreshnessHours || 5;

        // Lire les items du flux
        for (const item of feed.items) {
            // Déterminer la date de publication
            const pubDate = new Date(item.published || item.updated || item.isoDate).getTime();
            if (isNaN(pubDate)) {
                console.error(await dateFormatLog() + `Impossible de déterminer la date pour l'article : ${item.title}`);
                continue; // Ignorer cet article
            }

            const timeDiff = now - pubDate; // Différence en millisecondes

            if (timeDiff > freshnessHours * 60 * 60 * 1000) {
                console.log(
                    await dateFormatLog() +
                    `Article ignoré (trop ancien: ${Math.round(timeDiff / 60000)} min) : ${item.title}`
                );
                continue; // Ignorer les articles trop anciens
            }

            // Image pour "topics" uniquement
            const imageUrl = rssUrl.includes('topics') && item.content ? extractImage(item.content) : null;
            
            // Convertir la date au fuseau horaire français
            const frenchTime = convertToFrenchTime(pubDate);

            // Définir le footer en fonction du flux RSS
            const footer = rssUrl.includes('topics')
                ? {
                    text: `News • ${frenchTime}`,
                    icon_url: 'https://images-ext-1.discordapp.net/external/NheZoeKn7Hh0UmSee9FFkErt6E41HVgAAO0dCTvW6wQ/https/lodestonenews.com/images/topics.png',
                }
                : {
                    text: `Maintenance • ${frenchTime}`,
                    icon_url: 'https://images-ext-1.discordapp.net/external/A3w4m6Zwzdgp1KLRcwvw41QlRInTHE1HyeCKLRhADTo/https/lodestonenews.com/images/maintenance.png',
                };

            // Utiliser la description uniquement si c'est un flux "topics"
            const description = rssUrl.includes('topics')
                ? item.summary
                    .replace(/<br\s*\/?>/gi, '\n') // Remplace les balises <br> par des sauts de ligne
                    .replace(/<\/?[^>]+(>|$)/g, '') // Nettoie les autres balises HTML
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&apos;/g, "'")
                    .replace(/&lt;/g, '<')     
                    .trim() // Supprime les espaces superflus au début et à la fin
                : ''; // Pas de description pour le flux "news"

            // Construction de l'embed
            const embed = {
                title: item.title || 'Nouvelle actualité',
                url: item.link,
                description, // Utilise la variable définie ci-dessus
                image: rssUrl.includes('topics') && item.enclosure?.url ? { url: item.enclosure.url } : undefined, // Image uniquement pour "topics"
                footer,
            };

            // Ajouter l'image si elle est présente
            if (imageUrl) {
                embed.image = { url: imageUrl };
            }

            // Définir le canal Discord où envoyer les messages
            const lodestoneRSSChannelID = bot.settings.ids.lodestoneRSSChannel;

            const lodestoneRSSChannel = bot.channels.cache.get(lodestoneRSSChannelID);
            if (!lodestoneRSSChannel) {
                console.error(await dateFormatLog() + `Le canal avec l'ID ${lodestoneRSSChannelID} n'existe pas.`);
                return;
            }

            if (await isDuplicateMessage(lodestoneRSSChannel, item.title)) {
                //console.log(await dateFormatLog() + `Article déjà publié, passage : ${item.title}`);
                continue; // Passe à l'article suivant si un doublon est détecté
            }

            // Envoyer l'embed sur Discord
            await lodestoneRSSChannel.send({ embeds: [embed] });
            console.log(await dateFormatLog() + `Publication d'une news lodestone: ${item.title}`)
        }
        console.log(await dateFormatLog() + `Fin vérification du flux RSS : ${rssUrl}`);
    } catch (error) {
        console.error('Erreur lors de la vérification du flux RSS :', error);
    }
}

module.exports = { checkRSS };
