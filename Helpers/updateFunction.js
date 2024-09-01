const updateMemberDAO = require('./updateMemberDAO');
const downloadGitWebsite = require('./downloadGitWebsite');
const backupWebsite = require('./backupWebsite');

async function updateFunction() {

    // Télécharger la structure actuelle du site, du GitHub
    //await downloadGitWebsite('https://github.com/Satalis/LOUTRES_SITE/', './PublicWebsite')

    // Créer une backup du site actuellement sur FTP
    //await backupWebsite();
    
    // Edit le fichier MemberDAO
    updateMemberDAO(); 

    // Upload le site sur le FTP
    //await uploadWebsite(); A FAIRE

}
module.exports = updateFunction;