// Outils pour lire et extraire les informations de ratelimit Reddit
const config = require('../config/reddit.js');

/**
 * Extrait la configuration Reddit en combinant les valeurs globales
 * et celles éventuellement définies dans le client.
 * @param {object} client - Instance du bot contenant la clé `reddit`.
 * @returns {{rateLimit:number, rateWindow:number, rateReserve:number}}
 */
function getRateConfig(client = {}) {
  return {
    rateLimit: client.reddit?.rateLimit || config.rateLimit || 100,
    rateWindow: client.reddit?.rateWindow || config.rateWindow || 600,
    rateReserve: client.reddit?.rateReserve || config.rateReserve || 10,
  };
}

/**
 * Calcule l'état courant du quota Reddit à partir des informations Snoowrap.
 * @param {object} reddit - Instance Snoowrap configurée.
 * @param {number} rateLimit - Limite totale de requêtes dans la fenêtre.
 * @param {number} rateWindow - Durée de la fenêtre de ratelimit en secondes.
 * @returns {{used:number, remaining:number, reset:number}} Informations de quota.
 */
function getRateLimitInfo(reddit, rateLimit = config.rateLimit || 100, rateWindow = config.rateWindow || 600) {
  const totalLimit = rateLimit * (rateWindow / 60);
  const remaining = typeof reddit.ratelimitRemaining === 'number'
    ? reddit.ratelimitRemaining
    : totalLimit;
  const used = typeof reddit.ratelimitUsed === 'number'
    ? reddit.ratelimitUsed
    : totalLimit - remaining;
  const reset = typeof reddit.ratelimitExpiration === 'number'
    ? Math.max(0, Math.ceil((reddit.ratelimitExpiration - Date.now()) / 1000))
    : rateWindow;
  return { used: Math.max(0, used), remaining: Math.max(0, remaining), reset };
}

module.exports = { getRateLimitInfo, getRateConfig };
