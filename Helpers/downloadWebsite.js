const { exec } = require('child_process');
const path = require('path');

async function downloadWebsite(gitRepoUrl, outputPath) {
  try {
    // Construire la commande git clone
    const command = `git clone ${gitRepoUrl} "${outputPath}"`;

    // Exécuter la commande git clone
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur lors du clonage du dépôt : ${error}`);
        return;
      }
      console.log(`Dépôt cloné avec succès dans ${outputPath}`);
      console.log(stdout);
    });
  } catch (error) {
    console.error('Erreur lors du téléchargement du dépôt Git :', error);
  }
}

module.exports = downloadWebsite;