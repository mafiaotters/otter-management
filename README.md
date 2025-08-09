# Chantal - Bot Discord

Chantal est un bot Discord avancé conçu pour animer et gérer une communauté dynamique. Il offre des fonctionnalités variées allant du **Kaazino** (machine à sous) à la gestion de **citations**, en passant par un **système de succès** et des **best-of mensuels**.

---

## 📌 Fonctionnalités

### 🔹 Jeux et animations
- 🎰 **Kaazino** : Une machine à sous avec des probabilités ajustées et un jackpot progressif.
- 🎟️ **Loterie** : Un pourcentage des mises du Kaazino alimente une cagnotte, qui peut être gagnée en cas de "quasi victoire".
- 🏆 **Système de succès** [SOON] : Attribution automatique de succès pour encourager la participation.

### 🔹 Gestion et automatisation
- 📌 **Citations** : Système de sauvegarde et suppression des meilleures citations des membres.
- 📜 **Best-of mensuel** : Génération automatique d’un best-of des citations chaque mois.
- 🔄 **Mise à jour des rôles** : Synchronisation automatique des rôles Discord en fonction des données Firestore.

### 🔹 Intégrations et API
- 📰 **Flux RSS Lodestone** : Surveillance des news FFXIV et publication automatique sur Discord.
- 👗 **API Reddit Fashion** : Partage des dernières tenues postées sur Reddit.

### 🔹 Utilitaires
- 🛠️ **Commandes personnalisées** : `/help`, `/quote`, `/kaazino`, `/listerole`, etc.
- 🚀 **Keep-Alive** : Maintien du bot actif sur Koyeb malgré la mise en veille automatique.
- 🔔 **Messages d'accueil et d'au revoir** : Attribution automatique de rôles à l’arrivée et annonce du départ.

---

## 📦 Installation

###  Prérequis
- **Node.js** (v18+ recommandé)
- **Firestore** pour la base de données
- **Un bot Discord** (avec son Token)

### Cloner le repo
```sh
git clone https://github.com/Jungso-GB/otter-management.git
cd otter-management
```

### Installer les dépendances
```sh
npm install
```

### Créer un `.env`
Copiez le fichier `.env.example` vers `.env` puis personnalisez les valeurs :
```env
DISCORD_TOKEN=ton_token
KEYSFIREBASE=chemin_du_fichier_json
GITHUB_BRANCH=main
GOOGLE_SHEET_ID=ton_id_google_sheet
FTP_HOST=ftp.tonsite.com
FTP_USER=ton_user
FTP_PASS=ton_mdp
DEV_MODE=false
REDDIT_CLIENT_ID=ton_client_id
REDDIT_CLIENT_SECRET=ton_client_secret
REDDIT_USERNAME=ton_nom_utilisateur
REDDIT_PASSWORD=ton_mot_de_passe

```
### Démarrer le bot
```sh
node bot.js
```
## Commandes et fonctionnalités

### Les fonctionnalités
Le fichier `settings.js` (et sa variante `settings-dev.js`) contient un objet `features` permettant d'activer ou non certaines parties du bot.

```js
features: {
  verifyWord: true,
  quoteSystem: true,
  rss: true,
  bestOfMonthly: true,
  redditFashion: true,
  welcomeMessage: true,
  assignRoles: true,
  goodbyeMessage: true,
}
```

Passez une valeur à `false` pour désactiver la fonctionnalité correspondante sans modifier le code.

### Réglage des intervalles

Les paramètres techniques liés à Reddit se trouvent dans `config/reddit.js` ; les autres options sont regroupées dans `settings.js` (ou `settings-dev.js`) sous la clé `reddit` :

```js
// config/reddit.js
module.exports = {
  // ------------------- Limitations de rate limit -------------------
  rateLimit: 100,      // ⚠️ 100 QPM maximum selon la politique Reddit
  rateReserve: 10,     // ⚠️ Arrêt quand il reste ce nombre pour éviter le blocage
  rateWindow: 600,     // Fenêtre de ratelimit en secondes (10 min)

  // ------------------- Identification du client -------------------
  userAgent: 'web:otter-management-bot:1.0.0 (by /u/OtterChantal-bot)', // ⚠️ User-Agent obligatoire
};
```

```js
// settings.js
module.exports = {
  // ...
  reddit: {
    fashionInterval: 60, // Vérifie le subreddit Reddit Fashion toutes les 60 minutes
    postCheckInterval: 60, // Vérifie les posts existants toutes les 60 minutes
    fashionSubreddit: 'ffxiv', // Subreddit ciblé
    fashionQuery: 'author:Gottesstrafe Fashion Report - Full Details - For Week of', // Requête de recherche
    fashionSort: 'new',  // Tri des résultats
    fashionTime: 'week', // Période de recherche
    fashionChannelId: '000000000000000000', // Canal pour le flux Fashion
    debug: false,
  },
};
```

Le User-Agent est défini directement dans `config/reddit.js`.

Les autres réglages généraux restent dans `settings.js`.

### Mode debug Reddit

Activez `debug` dans `settings.js` (ou `settings-dev.js`) à la section `reddit` pour afficher les requêtes Reddit et les en-têtes de limitation d'API (`X-Ratelimit-Used`, `X-Ratelimit-Remaining`, `X-Ratelimit-Reset`).
Les logs détaillent également le User-Agent, la limite configurée et le délai appliqué entre chaque requête.
Ces messages, préfixés par `[Reddit]`, sont isolés du flux Lodestone afin d'éviter toute interférence.

### Limites et conformité à l'API Reddit

Reddit impose un maximum de **100 requêtes par minute et par identifiant OAuth**. Cette limite est calculée sur une fenêtre glissante d'environ **10 minutes**, soit jusqu'à 1 000 requêtes sur la période. Chaque réponse fournit les en‑têtes `X-Ratelimit-Used`, `X-Ratelimit-Remaining` et `X-Ratelimit-Reset` indiquant respectivement le nombre de requêtes utilisées, celles restantes et le temps avant réinitialisation. Le bot lit ces en‑têtes pour ajuster automatiquement son rythme.

Les comptes bénéficiant d'un accès gratuit sont également soumis à des plafonds de **2 000 messages de chat par destinataire et 3 000 au total par jour**, ainsi qu'à une limite de **300 salons** rejointe quotidiennement. Le bot n'utilise pas l'API de messagerie et reste donc en‑dessous de ces seuils.

Le fichier `config/reddit.js` permet de personnaliser cette politique :

```js
rateLimit: 100,  // Requêtes par minute
rateWindow: 600, // Fenêtre de 10 minutes
rateReserve: 10  // Seuil d'arrêt avant saturation
```

Des valeurs initiales sont définies au démarrage afin d'éviter tout affichage `null`, garantissant un suivi cohérent dès la première requête.

### Les commandes

Chaque commande peut être (dé)activée individuellement dans le fichier `settings.js` (ou `settings-dev.js`).
L'objet `commandToggles` répertorie toutes les commandes. Elles sont activées par défaut et peuvent être mises à `false` si nécessaire :

```js
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
  verify: false
}
```

Une commande dont la valeur est définie à `false` sera ignorée au chargement et renverra un message d'erreur si un utilisateur tente de l'exécuter.
