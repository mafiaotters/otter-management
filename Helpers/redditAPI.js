const Snoowrap = require('snoowrap');
const redditConfig = require('../config/reddit.js');
const isDev = process.env.DEV_MODE === 'true';
const appConfig = (require(isDev ? '../settings-dev.js' : '../settings.js').reddit) || {};

const reddit = new Snoowrap({
  userAgent: redditConfig.userAgent,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

const rateLimit = redditConfig.rateLimit || 100;
const rateWindow = redditConfig.rateWindow || 600;
const totalLimit = rateLimit * (rateWindow / 60);
const requestDelay = Math.ceil(60000 / rateLimit);
const logger = {
  debug: (...args) => console.log('[Reddit]', ...args),
  warn: (...args) => console.warn('[Reddit]', ...args)
};

reddit.config({
  requestDelay,
  continueAfterRatelimitError: true,
  debug: !!appConfig.debug,
  logger
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
