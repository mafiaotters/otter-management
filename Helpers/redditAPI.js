const Snoowrap = require('snoowrap');

const reddit = new Snoowrap({
  userAgent: 'OtterChantal-bot/1.0 (Discord relay bot)',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

module.exports = reddit;
