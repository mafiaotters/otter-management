const {dateFormatLog} = require('./logTools');


/**
 * Envoie un message lorsqu'un membre quitte le serveur
 * @param {GuildMember} member - Le membre qui a quitté le serveur
 */
async function goodbyeMessage(member, bot) {
    try {
        const channelId = bot.settings.ids.goodbyeChannel;

        // Récupérer le canal
        const channel = member.guild.channels.cache.get(channelId);

        if (!channel) {
            console.error(`${await dateFormatLog()}Le canal d'au revoir n'a pas été trouvé dans la guilde : ${member.guild.name}`);
            console.log(
                member.guild.channels.cache.map(ch => `${ch.id}: ${ch.name} (${ch.type})`)
            );
            return; // Arrêter si aucun canal trouvé
        }

        // Vérifier si le canal est textuel
        if (!channel.isTextBased()) {
            console.error(`${await dateFormatLog()}Le canal spécifié (${channel.name}) n'est pas textuel. Type : ${channel.type}`);
            return;
        }

        // Vérifier les permissions du bot
        const botPermissions = channel.permissionsFor(member.guild.members.me);
        if (!botPermissions.has('ViewChannel') || !botPermissions.has('SendMessages')) {
            console.error(`${await dateFormatLog()}Le bot n'a pas les permissions nécessaires pour envoyer un message dans le canal : ${channel.name}`);
            return;
        }

        // Envoyer un message dans le canal
        await channel.send(`**${member.displayName}** s'envole vers d'autres cieux.`);

        console.log(`${await dateFormatLog()} Message d'au revoir envoyé pour ${member.displayName} dans ${channel.name}.`);
    } catch (error) {
        console.error(await dateFormatLog() + 'Erreur dans goodbyeMessage :', error);
    }
}

module.exports = goodbyeMessage;
