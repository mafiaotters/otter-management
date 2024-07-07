const updateMemberDAO = require('./updateMemberDAO');
const downloadUpdateWebsite = require('./downloadUpdateWebsite');
const backupWebsite = require('./backupWebsite');

async function updateFunction() {

    // Télécharger la structure actuelle du site, du GitHub
    await downloadUpdateWebsite('https://github.com/Satalis/LOUTRES_SITE/', './PublicWebsite')

    // Créer une backup du site actuellement sur FTP
    await backupWebsite();
    
    // Edit le fichier MemberDAO
    //updateMemberDAO(); 

}
module.exports = updateFunction;