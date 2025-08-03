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

Certains délais peuvent être ajustés dans `settings.js` :

```js
redditFashionInterval: 60 // Vérifie le subreddit Reddit Fashion toutes les 60 minutes
rssFreshnessHours: 5     // Ignore les posts RSS plus vieux que 5 heures
```

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
