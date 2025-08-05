const config = require('../config/reddit.js');

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

module.exports = { getRateLimitInfo };
