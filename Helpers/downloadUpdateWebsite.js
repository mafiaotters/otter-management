const fs = require('fs').promises;
const simpleGit = require('simple-git');

async function downloadUpdateWebsite(gitRepoUrl, outputPath) {
    const timestamp = new Date().toISOString();
    console.log('Mise à jour du site web...');

    try {
        // Vérifier si le dossier outputPath existe
        const outputPathExists = await fs.access(outputPath).then(() => true).catch(() => false);

        if (!outputPathExists) {
            // Si le dossier n'existe pas, on clone le dépôt
            const git = simpleGit();
            await git.clone(gitRepoUrl, outputPath);
            console.log(`[${timestamp}]: Site web cloné avec succès dans ${outputPath}`);
            return; // Fin de la fonction après le clonage
        }

        // Si le dossier existe, on continue avec la mise à jour du dépôt
        const git = simpleGit(outputPath);
        const gitDirExists = await fs.access(`${outputPath}/.git`).then(() => true).catch(() => false);

        if (gitDirExists) {
            // Si le répertoire est déjà un dépôt Git, on fait simplement un pull pour mettre à jour
            await git.fetch();
            await git.checkout('.');
            await git.pull('--recurse-submodules');
            console.log(`[${timestamp}]: Site web mis à jour avec succès dans ${outputPath}`);
        } else {
            // Si le répertoire n'est pas un dépôt Git, on clone le dépôt
            await git.clone(gitRepoUrl, outputPath);
            console.log(`[${timestamp}]: Site web cloné avec succès dans ${outputPath}`);
        }
    } catch (error) {
        console.error(`[${timestamp}]: Erreur lors de la mise à jour ou du clonage du dépôt : ${error}`);
    }
}

module.exports = downloadUpdateWebsite;