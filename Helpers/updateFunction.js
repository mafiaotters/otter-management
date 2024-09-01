const updateMemberDAO = require('./updateMemberDAO');
const downloadGitWebsite = require('./downloadGitWebsite');
const backupWebsite = require('./backupWebsite');
const updateOtterJson = require('./updateOtterJson');

async function updateFunction() {

    // Télécharger la structure actuelle du site, du GitHub
    //await downloadGitWebsite('https://github.com/Satalis/LOUTRES_SITE/', './PublicWebsite')

    // Créer une backup du site actuellement sur FTP
    //await backupWebsite();
    
    // Edit le fichier MemberDAO
    await updateMemberDAO(); 

    // Edit le fichier Otter.json
    await updateOtterJson();

    // Upload le site sur le FTP
    //await uploadWebsite(); A FAIRE

}
module.exports = updateFunction;