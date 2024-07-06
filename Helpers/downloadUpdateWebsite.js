const fs = require('fs').promises;
const path = require('path');
const SFTPClient = require('ssh2-sftp-client');
const sftp = new SFTPClient();

// Configuration SFTP déjà définie dans votre extrait
const sftpConfig = {
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    username: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    remoteDir: '/'
};

async function downloadUpdateWebsite(localDir) {
    await sftp.connect(sftpConfig);
    const remoteFiles = await sftp.list(sftpConfig.remoteDir);

    for (const file of remoteFiles) {
        const localFilePath = path.join(localDir, file.name);
        const remoteFilePath = path.join(sftpConfig.remoteDir, file.name);

        try {
            const localFileStats = await fs.stat(localFilePath);
            const localFileModifiedTime = new Date(localFileStats.mtime).getTime();
            const remoteFileModifiedTime = new Date(file.modifyTime).getTime();

            // Vérifie si le fichier local est plus ancien que le fichier distant
            if (localFileModifiedTime < remoteFileModifiedTime || !localFileStats) {
                console.log(`Téléchargement de ${file.name}...`);
                await downloadFile(remoteFilePath, localFilePath);
            }
        } catch (error) {
            // Le fichier n'existe pas localement, le télécharger
            console.log(`Téléchargement de ${file.name} car il n'existe pas localement.`);
            await downloadFile(remoteFilePath, localFilePath);
        }
    }

    await sftp.end();
}

async function downloadFile(remoteFilePath, localFilePath) {
    // Crée le dossier si nécessaire
    await fs.mkdir(path.dirname(localFilePath), { recursive: true });
    await sftp.get(remoteFilePath, localFilePath);
}

module.exports = downloadUpdateWebsite;