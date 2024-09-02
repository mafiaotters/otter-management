const fsExtra = require('fs-extra');
const fs = require('fs').promises;
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

    // Télécharger le contenu du site web
    await sftp.downloadDir('./', backupFolderPath);

    await sftp.uploadDir('./backupWebsite', './backupWebsite');

    console.log('Backup du site web réalisé avec succès.');
    sftp.end();
}

// Vous devrez adapter ou implémenter downloadDir pour ssh2-sftp-client
// La fonction downloadDir ci-dessous est un placeholder et doit être implémentée correctement
SftpClient.prototype.downloadDir = async function(sourceDir, destDir, excludeDirs = ['logs', 'cache', 'tmp', 'css', 'xivapi_poc', '.git', '.vscode', 'vendor', 'templates', 'guide', 'sitemap.xml', 'manifest.json', 'browserconfig.xml', '.gitignore', '404.html', 'backupBot', 'favicon.ico', 'backupWebsite', 'assets', 'dev']) {
    const handleDir = async (currentSourceDir, currentDestDir) => {
        await fsExtra.ensureDir(currentDestDir); // Assurez-vous que le répertoire de destination existe

        const list = await this.list(currentSourceDir); // Liste les fichiers/dossiers dans le répertoire courant

        for (let item of list) {
            if (excludeDirs.includes(item.name)) {
                continue; // Exclure les dossiers spécifiés
            }
            console.log('Téléchargement de:', item.name);

            if(currentSourceDir.includes('assets') && item.name !== 'speakers' && !currentSourceDir.endsWith('speakers')) {                continue; // Saute tous les dossiers de img, sauf speakers
            }

            // Utilisez path.posix.join pour garantir l'utilisation de slash (/)
            const itemSourcePath = path.posix.join(currentSourceDir, item.name);
            const itemDestPath = path.posix.join(currentDestDir, item.name);

            if (item.type === 'd') { // Si l'élément est un dossier
                await handleDir(itemSourcePath, itemDestPath); // Récursion pour gérer le contenu du dossier
            } else if (item.type === '-'){ // Si l'élément est un fichier
                await this.fastGet(itemSourcePath, itemDestPath); // Télécharger le fichier
            }
        }

        // Sauvegarde de tous les fichiers de speakers dans un fichier JSON, pour faire des vérifs plus tard.
        let speakersFiles = await this.list('/assets/img/speakers')
        let data = JSON.stringify(speakersFiles, null, 2);
        let filePath = './backupWebsite/allFiles.json';
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                console.error('Une erreur est survenue lors de la sauvegarde du fichier:', err);
            } else {
                console.log('Fichier sauvegardé avec succès.');
            }});


    };

    await handleDir(sourceDir, destDir); // Commencer le traitement à partir du répertoire source

SftpClient.prototype.uploadDir = async function(sourceDir, destDir, excludeDirs = []) {
    const handleDir = async (currentSourceDir, currentDestDir) => {
        console.log('Upload du répertoire:', currentSourceDir);
        await this.mkdir(currentDestDir, true); // Crée le répertoire de destination si nécessaire

        const items = await fsExtra.readdir(currentSourceDir); // Liste les fichiers/dossiers dans le répertoire courant

        for (let itemName of items) {
            
            const itemSourcePath = path.join(currentSourceDir, itemName);
            const itemDestPath = path.posix.join(currentDestDir, itemName); // Utilisez path.posix.join pour garantir l'utilisation de slash (/)

            const stat = await fsExtra.stat(itemSourcePath);
            if (stat.isDirectory()) { // Si l'élément est un dossier
                await handleDir(itemSourcePath, itemDestPath); // Récursion pour gérer le contenu du dossier
            } else if (stat.isFile()) { // Si l'élément est un fichier);
                await this.fastPut(itemSourcePath, itemDestPath); // Téléverser le fichier
            }
        }
    };

    await handleDir(sourceDir, destDir); // Commencer le traitement à partir du répertoire source
};

};

module.exports = backupWebsite;