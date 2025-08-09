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

module.exports = { isDuplicateMessage };
