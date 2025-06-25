/**
 * Configuration pour le serveur principal
 * mainGuildId : identifiant du serveur Discord principal
 * channelId : canal d'annonce au démarrage du bot
 */
module.exports = {
  // Identifiant du serveur principal
  mainGuildId: '675543520425148416',
  // Canal d'annonce au démarrage
  channelId: '1311350221619597455',
  // URL du flux RSS Reddit Fashion
  redditFashionRSS: 'https://www.reddit.com/r/ffxiv/search.rss?restrict_sr=on&sort=new&q=author%3AGottesstrafe+Fashion+Report+-+Full+Details+-+For+Week+of&t=week',

  // Intervalle de vérification du flux Reddit Fashion (en minutes)
  redditFashionInterval: 60,

  ids: {
    // Canal où sont envoyés les messages de bienvenue
    welcomeChannel: '675910340936204288',
    // Canal pour les messages d'au revoir
    goodbyeChannel: '747143537048682558',
    // Canal dédié au flux RSS Lodestone
    lodestoneRSSChannel: '675682104327012382',
    // Canal pour le flux Reddit Fashion
    redditFashionChannel: '675682104327012382',
    // Canal pour le best-of mensuel
    bestOfChannel: '675910340936204288',
    // Canal utilisé pour certaines notifications
    notificationChannel: '675682104327012382',
    // Canal réservé aux messages d'administration
    adminChannel: '1282684525259919462',
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
    exceptionsUsers: ['173439968381894656', '143762806574022656', '72405181253287936'],
  },
  commands: {
    // Utilisateurs autorisés à modifier la base de données
    allowedUsers: ['207992750988197889', '173439968381894656', '239407042182381588'],
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
    help: false,
    link: false,
    verify: false,
  },

  // Activer ou non certaines fonctionnalités du bot
  features: {
    verifyWord: true, // Répond "feur" ou "keen'v" selon le message
    quoteSystem: true, // Enregistre les citations et gère le best-of
    rss: true, // Vérifie les flux RSS Lodestone
    bestOfMonthly: true, // Génère le best-of mensuel
    redditFashion: true, // Récupère les posts du subreddit fashion
    welcomeMessage: true, // Envoie un message de bienvenue aux nouveaux
    assignRoles: true, // Attribue les rôles de base lors de l'arrivée
    goodbyeMessage: true, // Indique quand un membre quitte le serveur
  },
};
