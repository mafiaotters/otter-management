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
- 👗 **Flux RSS Reddit Fashion** : Partage des dernières tenues postées sur Reddit.

### 🔹 Utilitaires
- 🛠️ **Commandes personnalisées** : `/help`, `/quote`, `/kaazino`, etc.
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
git clone https://github.com/ton-user/chantal-bot.git
cd chantal-bot

npm install (installer les dépendances)

### Créer un `.env`

Copiez le fichier `.env.example` vers `.env` puis personnalisez les valeurs :
DISCORD_TOKEN=ton_token
FIREBASE_CREDENTIALS=chemin_du_fichier_json
GITHUB_BRANCH=main
GOOGLE_SHEET_ID=ton_id_google_sheet
FTP_HOST=ftp.tonsite.com
FTP_USER=ton_user
FTP_PASS=ton_mdp
DEV_MODE=false

### Initialisation de Firestore pour le développement
Pour peupler rapidement la base Firestore avec des données de test, exécutez :
npm run init:dev -- --insert

Ajoutez `--dry-run` pour simuler sans écrire dans la base.

En définissant la variable d'environnement `DEV_MODE=true`, le script utilisera
`firebase-dev.json` et `settings-dev.js`.
Les membres insérés sont configurés dans `AdminTools/initSettings.json`.

### Le démarrer
node bot.js

### Désactiver des fonctionnalités

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


### Désactiver des commandes

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
  help: false,
  link: false,
  verify: false
}
```

Une commande dont la valeur est définie à `false` sera ignorée au chargement et renverra un message d'erreur si un utilisateur tente de l'exécuter.
