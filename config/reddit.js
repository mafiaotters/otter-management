module.exports = {
  // ------------------- Limitations de rate limit -------------------
  // ⚠️ 100 QPM maximum selon la politique Reddit
  rateLimit: 100,

  // ⚠️ Arrête les requêtes quand il reste ce nombre pour éviter de dépasser la limite
  rateReserve: 10,

  // Fenêtre de ratelimit en secondes (politique actuelle : 10 minutes)
  rateWindow: 600,

  // ------------------- Identification du client -------------------
  // ⚠️ User-Agent obligatoire pour respecter les règles Reddit
  userAgent: 'web:otter-management-bot:1.0.0 (by /u/OtterChantal-bot)',
};

