async function dateFormatLog() {
    const date = new Date();

    // Décalage UTC+2
    const offset = 2; // heures
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const localDate = new Date(utc + (offset * 3600000));

    let formattedDate = `${localDate.getDate().toString().padStart(2, '0')}/${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${localDate.getHours().toString().padStart(2, '0')}h${localDate.getMinutes().toString().padStart(2, '0')}`;
    formattedDate = `[${formattedDate}] `;

    return formattedDate;
}

function debugLog(bot, feature, ...args) {
  if (bot?.settings?.debug?.[feature]) {
    console.log(...args);
  }
}

module.exports = {
    dateFormatLog,
    debugLog
};
