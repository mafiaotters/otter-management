const fs = require('fs').promises;
const simpleGit = require('simple-git');
const path = require('path');
require('dotenv').config();

async function downloadGitWebsite(gitRepoUrl, outputPath) {
    const timestamp = new Date().toISOString();
    const branch = process.env.GITHUB_BRANCH; // Branche à utiliser pour le dépôt Git
    
    // Construisez le chemin correct incluant "PublicWebsite"
    const publicWebsitePath = path.join(outputPath);

    // Vérifiez si le dossier "PublicWebsite" existe, sinon créez-le
    await fs.access(publicWebsitePath).catch(async () => {
        console.log(`Le dossier ${publicWebsitePath} n'existe pas, création en cours...`);
        await fs.mkdir(publicWebsitePath, { recursive: true });
    });

    // Utilisez publicWebsitePath pour les opérations Git
    const git = simpleGit(publicWebsitePath);
    console.log('Mise à jour du site web...');

    try {
        const gitDirExists = await fs.access(path.join(publicWebsitePath, '.git')).then(() => true).catch(() => false);

        if (gitDirExists) {
            await git.fetch();
            await git.checkout(branch); // Spécifiez explicitement la branche "test"
            await git.pull('origin', branch, {'--recurse-submodules': true}); // Assurez-vous de tirer les changements de la branche "test"
            console.log(`[${timestamp}]: Site web mis à jour avec succès dans ${publicWebsitePath}`);
        } else {
            await git.clone(gitRepoUrl, '.', ['--branch', branch]); // Cloner dans le dossier actuel
            console.log(`[${timestamp}]: Site web cloné avec succès dans ${publicWebsitePath}`);
        }
    } catch (error) {
        console.error(`[${timestamp}]: Erreur lors de la mise à jour ou du clonage du dépôt : ${error}`);
    }
}

module.exports = downloadGitWebsite;