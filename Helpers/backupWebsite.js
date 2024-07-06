const fsExtra = require('fs-extra');
const path = require('path');

async function backupWebsite() {
    const timestamp = new Date().toISOString();
    const sourceDir = path.join(__dirname, '../PublicWebsite');
    const destDir = path.join(__dirname, '../BackupWebsite');

    try {
        await fsExtra.copy(sourceDir, destDir);
        console.log(`[${timestamp}]: Backup du site réalisée.`);
    } catch (err) {
        console.error(`[${timestamp}]: Erreur lors de la création de la sauvegarde du site :`, err);
    }
}

module.exports = backupWebsite;