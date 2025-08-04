/**
 * Configuration pour le serveur principal (développement)
 * mainGuildId : identifiant du serveur Discord principal
 * channelId : canal d'annonce au démarrage du bot
 */
module.exports = {
  // Identifiant du serveur principal
  mainGuildId: '000000000000000000',
  // Canal d'annonce au démarrage
  channelId: '000000000000000000',

  // Intervalle de vérification du Reddit Fashion (en minutes)
  redditFashionInterval: 60,

  // Intervalle de vérification des posts Reddit existants (en minutes)
  redditPostCheckInterval: 60,

  // Durée maximale d'ancienneté des posts RSS (en heures)
  rssFreshnessHours: 24,
  
  // Intervalle de vérification des flux RSS (en minutes)
  rssCheckInterval: 15,

  // User-Agent utilisé pour les requêtes RSS
  rssUserAgent: 'web:otter-management-bot:1.0.0 (by /u/OtterChantal-bot)',
  ids: {
    // Canal où sont envoyés les messages de bienvenue
    welcomeChannel: '000000000000000000',
    // Canal pour les messages d'au revoir
    goodbyeChannel: '000000000000000000',
    // Canal dédié au flux RSS Lodestone
    lodestoneRSSChannel: '000000000000000000',
    // Canal pour le flux Reddit Fashion
    redditFashionChannel: '000000000000000000',
    // Canal pour le best-of mensuel
    bestOfChannel: '000000000000000000',
    // Canal utilisé pour certaines notifications
    notificationChannel: '000000000000000000',
    // Canal réservé aux messages d'administration
    adminChannel: '000000000000000000',
    // Rôle attribué aux visiteurs
    roleVisitor: '000000000000000000',
    // Rôle pour les nouvelles potentielles loutres
    rolePotential: '000000000000000000',
    // ID du bot principal
    botMainId: '000000000000000000',
    // ID du bot de développement
    botDevId: '000000000000000000',
    // Guildes reconnues : principale et serveur de test
    recognizedGuildIds: ['000000000000000000', '000000000000000000'],
    // Canaux où le bot ne réagit pas
    exceptionsChannels: ['000000000000000000', '000000000000000000'],
    // Utilisateurs exemptés des réponses automatiques
    exceptionsUsers: ['000000000000000000', '000000000000000000', '000000000000000000'],
  },
  commands: {
    // Utilisateurs autorisés à modifier la base de données
    allowedUsers: ['000000000000000000', '000000000000000000', '000000000000000000'],
    // Contacts à mentionner pour obtenir de l'aide
    helpContacts: ['000000000000000000', '000000000000000000'],
  },

  // Activer ou désactiver des commandes spécifiques
  // Toutes les commandes sont listées ci-dessous et activées par défaut
  commandToggles: {
    add: true,
    aide: true,
    delete: true,
    gill: true,
    quote: true,
    suggestion: true,
    update: true,
    listerole: true,
    help: false,
    link: false,
    verify: false,
  },

  // Activer ou non certaines fonctionnalités du bot
  features: {
    verifyWord: true, // Répond "feur" ou "keen'v" selon le message
    quoteSystem: true, // Enregistre les citations et gère le best-of en fin de mois
    rss: true, // Vérifie les flux RSS Lodestone
    bestOfMonthly: true, // Génère le best-of mensuel
    redditFashion: true, // Récupère les posts du subreddit fashion
    welcomeMessage: true, // Envoie un message de bienvenue aux nouveaux
    assignRoles: true, // Attribue les rôles de base lors de l'arrivée
    goodbyeMessage: true, // Indique quand un membre quitte le serveur
    comptMessage: true, // Compteur de message avec best-of en fin de mois
  },

  // Configuration des logs de debug par fonctionnalité
  debug: {
    reddit: true, // Logs pour les interactions Reddit
    rss: false,   // Logs pour le flux RSS
  },
};
