const Snoowrap = require('snoowrap');
const config = require('../config/reddit.js');

const reddit = new Snoowrap({
  userAgent: config.userAgent,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

const rateLimit = config.rateLimit || 100;
const rateWindow = config.rateWindow || 600;
const totalLimit = rateLimit * (rateWindow / 60);
const requestDelay = Math.ceil(60000 / rateLimit);
const logger = {
  debug: (...args) => console.log('[Reddit]', ...args),
  warn: (...args) => console.warn('[Reddit]', ...args)
};

reddit.config({
  requestDelay,
  continueAfterRatelimitError: true,
  debug: !!config.debug,
  logger
});

// Valeurs par défaut pour éviter des null au démarrage
reddit.ratelimitRemaining = totalLimit;
reddit.ratelimitUsed = 0;
reddit.ratelimitExpiration = Date.now() + rateWindow * 1000;

if (config.debug) {
  console.log(
    `[Reddit] Config - User-Agent: ${config.userAgent}, Limite: ${rateLimit} req/min, Fenêtre: ${rateWindow}s, Délai: ${requestDelay}ms`
  );
}

module.exports = reddit;
