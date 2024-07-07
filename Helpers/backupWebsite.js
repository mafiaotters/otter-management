const fsExtra = require('fs-extra');
const path = require('path');
const SftpClient = require('ssh2-sftp-client'); // Utilisez ssh2-sftp-client pour SFTP

async function backupWebsite() {
    const timestamp = new Date().toISOString();
    const backupFolderPath = path.join('./backupWebsite');

    console.log(`[${timestamp}]: Création d'une sauvegarde du site web du FTP...`)

    // Vérifie si le dossier backupWebsite existe
    const exists = await fsExtra.pathExists(backupFolderPath);

    if (exists) {
        // Si le dossier existe, le supprimer
        await fsExtra.remove(backupFolderPath);
    }

    // Recréer le dossier backupWebsite
    await fsExtra.ensureDir(backupFolderPath);

    // Configuration de la connexion SFTP et des options de téléchargement
    const sftpOptions = {
        host: process.env.FTP_HOST,
        port: process.env.FTP_PORT,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS
    };

    // Initialiser la connexion SFTP
    const sftp = new SftpClient();
    await sftp.connect(sftpOptions);

    // Télécharger le contenu du site web, en excluant certains dossiers
    await sftp.downloadDir(backupFolderPath);

    console.log('Backup du site web réalisé avec succès.');
    sftp.end();
}

// Vous devrez adapter ou implémenter downloadDir pour ssh2-sftp-client
// La fonction downloadDir ci-dessous est un placeholder et doit être implémentée correctement
SftpClient.prototype.downloadDir = async function(sourceDir, destDir, excludeDirs = []) {
    const handleDir = async (currentSourceDir, currentDestDir) => {
        await fsExtra.ensureDir(currentDestDir); // Assurez-vous que le répertoire de destination existe

        const list = await this.list(currentSourceDir); // Liste des fichiers/dossiers dans le répertoire courant

        for (let item of list) {
            if (excludeDirs.includes(item.name)) {
                continue; // Exclure les dossiers spécifiés
            }

            const itemSourcePath = path.join(currentSourceDir, item.name);
            const itemDestPath = path.join(currentDestDir, item.name);

            if (item.type === 'd') { // Si l'élément est un dossier
                await handleDir(itemSourcePath, itemDestPath); // Récursion pour gérer le contenu du dossier
            } else if (item.type === '-'){ // Si l'élément est un fichier
                await this.fastGet(itemSourcePath, itemDestPath); // Télécharger le fichier
            }
        }
    };

    await handleDir(sourceDir, destDir); // Commencer le traitement à partir du répertoire source
};

module.exports = backupWebsite;