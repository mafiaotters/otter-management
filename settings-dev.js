/**
 * Configuration pour le serveur principal (développement)
 * mainGuildId : identifiant du serveur Discord principal
 * channelId : canal d'annonce au démarrage du bot
 */

module.exports = {
  // Identifiant du serveur principal
  mainGuildId: '653689680906420235',
  // Canal d'annonce au démarrage
  channelId: '1400038897991422032',

  // Durée maximale d'ancienneté des posts RSS (en heures)
  rssFreshnessHours: 24,
  
  // Intervalle de vérification des flux RSS (en minutes)
  rssCheckInterval: 15,
  ids: {
    // Canal où sont envoyés les messages de bienvenue
    welcomeChannel: '675910340936204288',
    // Canal pour les messages d'au revoir
    goodbyeChannel: '747143537048682558',
    // Canal dédié au flux RSS Lodestone
    lodestoneRSSChannel: '1400038897991422032',
    // Canal pour le best-of mensuel
    bestOfChannel: '1400038897991422032',
    // Canal utilisé pour certaines notifications
    notificationChannel: '1400038897991422032',
    // Canal réservé aux messages d'administration
    adminChannel: '1311350221619597455',
    // Rôle attribué aux visiteurs
    roleVisitor: '675691652349689856',
    // Rôle pour les nouvelles potentielles loutres
    rolePotential: '879754348727509052',
    // ID du bot principal
    botMainId: '1106850900682747974',
    // ID du bot de développement
    botDevId: '1110950106842284072',
    // Guildes reconnues : principale et serveur de test
    recognizedGuildIds: ['675543520425148416', '653689680906420235'],
    // Canaux où le bot ne réagit pas
    exceptionsChannels: ['704404247445373029', '791052204823281714'],
    // Utilisateurs exemptés des réponses automatiques
    exceptionsUsers: ['173439968381894656', '143762806574022656', '143762806574022656'],
  },
  commands: {
    // Utilisateurs autorisés à modifier la base de données
    aallowedUsers: ['239407042182381588', '173439968381894656', '207992750988197889'],
    // Contacts à mentionner pour obtenir de l'aide
    helpContacts: ['207992750988197889', '239407042182381588'],
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

  // Paramètres généraux pour Reddit
  reddit: {
    fashionInterval: 60, // Vérifie le subreddit Reddit Fashion toutes les 60 minutes
    postCheckInterval: 60, // Vérifie les posts existants toutes les 60 minutes
    fashionSubreddit: 'ffxiv', // Subreddit ciblé
    fashionQuery: 'author:Gottesstrafe Fashion Report - Full Details - For Week of', // Requête de recherche
    fashionSort: 'new', // Tri des résultats
    fashionTime: 'week', // Période de recherche
    fashionChannelId: '1400038897991422032', // Canal pour le flux Fashion
    debug: false,
  },

  // Configuration des logs de debug par fonctionnalité
  debug: {
    rss: false,   // Logs pour le flux RSS
  },
};
