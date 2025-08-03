const Snoowrap = require('snoowrap');

const reddit = new Snoowrap({
  userAgent: 'web:otter-management-bot:1.0.0 (by /u/OtterChantal-bot)',
  clientId: process.env.REDDIT_CLIENT_ID,
  clientSecret: process.env.REDDIT_CLIENT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

module.exports = reddit;
