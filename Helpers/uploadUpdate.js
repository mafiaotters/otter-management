const fsExtra = require('fs-extra');
const path = require('path');
const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();

async function uploadUpdate() {
    const sftpOptions = {
        host: process.env.FTP_HOST,
        port: process.env.FTP_PORT,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS
    };

    try {
        await sftp.connect(sftpOptions);

        // Chemin du dossier tmp contenant les fichiers à uploader
        const tmpDirPath = './tmp';

        // Chemins spécifiques des fichiers à uploader
        const filesToUpload = [
            'memberDAO.php', 
            path.join('data', 'otter.json') // Ajustement pour le dossier "data"
        ];

        for (const fileName of filesToUpload) {
            const localFilePath = path.join(tmpDirPath, fileName);
            const remoteFilePath = path.posix.join('/', fileName); // Ajustez le chemin distant si nécessaire

            // Vérifie si le fichier existe localement avant de tenter l'upload
            const exists = await fsExtra.pathExists(localFilePath);
            if (exists) {
                console.log(`Upload du fichier: ${fileName}`);
                await sftp.fastPut(localFilePath, remoteFilePath);
            } else {
                console.error(`Le fichier ${fileName} n'existe pas dans ${tmpDirPath}`);
            }
        }

        console.log('Upload des fichiers terminé avec succès.');
    } catch (err) {
        console.error('Une erreur est survenue lors de l\'upload:', err);
    } finally {
        sftp.end();
    }
}

module.exports = uploadUpdate;