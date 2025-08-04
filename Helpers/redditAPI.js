const Snoowrap = require('snoowrap');
const settings = require('../settings');

const reddit = new Snoowrap({
  userAgent: settings.redditUserAgent,
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

const rateLimit = settings.redditRateLimit || 100;
const requestDelay = Math.ceil(60000 / rateLimit);
reddit.config({ requestDelay, continueAfterRatelimitError: true });

if (settings.debug?.reddit) {
  console.log(`Reddit config - User-Agent: ${settings.redditUserAgent}, Limite: ${rateLimit} req/min, Délai: ${requestDelay}ms`);
}

module.exports = reddit;
