/**
 * Configuration pour le serveur de développement
 * mainGuildId : identifiant du serveur Discord de test
 * channelId : canal d'annonce au démarrage du bot
 */
module.exports = {
  // Identifiant du serveur de développement
  mainGuildId: '653689680906420235',
  // Canal d'annonce au démarrage
  channelId: '1252901298798460978',
  // URL du flux RSS Reddit Fashion
  redditFashionRSS: 'https://www.reddit.com/r/ffxiv/search.rss?restrict_sr=on&sort=new&q=author%3AGottesstrafe+Fashion+Report+-+Full+Details+-+For+Week+of&t=week',

  // Intervalle de vérification du flux Reddit Fashion (en minutes)
  redditFashionInterval: 60,

  // Durée maximale d'ancienneté des posts RSS (en heures)
  rssFreshnessHours: 5,

  ids: {
    // Canal de bienvenue
    welcomeChannel: '653689680906420238',
    // Canal pour les messages d'au revoir
    goodbyeChannel: '653689680906420238',
    // Canal pour le flux RSS de test
    lodestoneRSSChannel: '1252901298798460978',
    // Canal pour le flux Reddit Fashion
    redditFashionChannel: '1252901298798460978',
    // Canal pour le best-of en environnement dev
    bestOfChannel: '1252901298798460978',
    // Canal de notification
    notificationChannel: '653689680906420238',
    // Canal réservé à l'administration
    adminChannel: '1252901298798460978',
    // Rôle visiteur en dev
    roleVisitor: '1312043806023221268',
    // Rôle potentiel en dev
    rolePotential: '1312043774246912081',
    // ID du bot principal
    botMainId: '1106850900682747974',
    // ID du bot de développement
    botDevId: '1110950106842284072',
    // Guildes reconnues : principale et serveur de test
    recognizedGuildIds: ['675543520425148416', '653689680906420235'],
    // Canaux exclus des réponses automatiques
    exceptionsChannels: ['704404247445373029', '791052204823281714'],
    // Utilisateurs pour lesquels le bot se tait
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
    verifyWord: true, // Répond "feur" ou "keen'v" en fonction du message
    quoteSystem: true, // Enregistre les citations et gère le best-of
    rss: true, // Vérifie les flux RSS de la Lodestone
    bestOfMonthly: true, // Génère le best-of mensuel
    redditFashion: true, // Récupère les posts du subreddit fashion
    welcomeMessage: true, // Envoie un message de bienvenue aux nouveaux
    assignRoles: true, // Attribue les rôles de base lors de l'arrivée
    goodbyeMessage: true, // Indique quand un membre quitte le serveur
  },
};
