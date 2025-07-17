const fsExtra = require('fs-extra');
const path = require('path');
const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();

async function uploadUpdate() {
    const sftpOptions = {
        host: process.env.FTP_HOST,
        port: process.env.FTP_PORT,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS,
        readyTimeout: 20000, // Timeout pour l'authentification
        keepaliveInterval: 5000, // Ping pour garder la connexion active    
    };

    try {
        await sftp.connect(sftpOptions);

        // Chemin du dossier tmp contenant les fichiers à uploader
        const tmpDirPath = './tmp';

        // Chemins spécifiques des fichiers à uploader
        const filesToUpload = [
            'memberDAO.php',
            'memberDAO.csv',
           path.posix.join('data', 'otter.json') // Ajustement pour le dossier "data"
        ];

        let basePath = './www/dev/'; // Chemin distant de base pour les fichiers à uploader
        console.log('Chemin distant défini sur /dev.');
        if (process.env.GITHUB_BRANCH === 'main') {
            basePath = './www/'; // Changer le chemin distant pour le site principale
            console.log('Chemin distant changé pour la branche principale.');
            //console.error('Attention: Branche principale demandée, mais non activé pour rester sur la dev.');
        }
        

    for (const fileName of filesToUpload) {
            const localFilePath = path.posix.join(tmpDirPath, fileName);
            let remoteFilePath = path.posix.join(basePath, fileName); // Concatène le chemin de base avec le nom du fichier

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