// Initialise le client Snoowrap pour communiquer avec l'API Reddit
const Snoowrap = require('snoowrap');
const redditConfig = require('../config/reddit.js');
const isDev = process.env.DEV_MODE === 'true';
const appConfig = (require(isDev ? '../settings-dev.js' : '../settings.js').reddit) || {};

/**
 * Identifiants Reddit fournis via les variables d'environnement.
 */
const {
  REDDIT_CLIENT_ID: clientId,
  REDDIT_CLIENT_SECRET: clientSecret,
  REDDIT_USERNAME: username,
  REDDIT_PASSWORD: password,
} = process.env;

/**
 * Instance Snoowrap utilisée pour toutes les requêtes Reddit.
 */
const reddit = new Snoowrap({
  userAgent: redditConfig.userAgent,
  clientId,
  clientSecret,
  username,
  password,
});

// Paramètres de gestion du quota
const rateLimit = redditConfig.rateLimit || 100;
const rateWindow = redditConfig.rateWindow || 600;
const totalLimit = rateLimit * (rateWindow / 60);
const requestDelay = Math.ceil(60000 / rateLimit);

// Petit logger pour tracer Snoowrap
function getTimestamp() {
  return new Date().toLocaleString('fr-FR');
}

const logger = {
  debug: (...args) => console.log('[Reddit]', getTimestamp(), ...args),
  warn: (...args) => console.warn('[Reddit]', getTimestamp(), ...args),
};

reddit.config({
  requestDelay,
  continueAfterRatelimitError: true,
  debug: !!appConfig.debug,
  logger,
});

// Valeurs par défaut pour éviter des null au démarrage
reddit.ratelimitRemaining = totalLimit;
reddit.ratelimitUsed = 0;
reddit.ratelimitExpiration = Date.now() + rateWindow * 1000;

if (appConfig.debug) {
  console.log(
    `[Reddit] Config - User-Agent: ${redditConfig.userAgent}, Limite: ${rateLimit} req/min, Fenêtre: ${rateWindow}s, Délai: ${requestDelay}ms`
  );
}

module.exports = reddit;
