module.exports = {
  // Intervalle de vérification du Reddit Fashion (en minutes)
  fashionInterval: 60,

  // Intervalle de vérification des posts Reddit existants (en minutes)
  postCheckInterval: 60,

  // Limite de requêtes Reddit par minute (100 QPM maximum selon la politique Reddit)
  rateLimit: 100,

  // Marge de sécurité pour les requêtes Reddit (arrêt quand il reste ce nombre de requêtes)
  rateReserve: 10,

  // Durée de la fenêtre de ratelimit Reddit en secondes (politique actuelle : 10 minutes)
  rateWindow: 600,

  // User-Agent utilisé pour les requêtes Reddit
  userAgent: 'web:otter-management-bot:1.0.0 (by /u/OtterChantal-bot)',

  // Canal pour le flux Reddit Fashion
  fashionChannelId: '000000000000000000',

  // Logs de debug pour les interactions Reddit
  debug: false,
};
