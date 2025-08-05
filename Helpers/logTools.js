async function dateFormatLog() {
    const date = new Date();

    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;
    return `[${formattedDate}] `;
}

async function debugLog(bot, feature, ...args) {
  if (bot?.settings?.debug?.[feature]) {
    console.log(await dateFormatLog(), ...args);
  }
}

module.exports = {
    dateFormatLog,
    debugLog
};
