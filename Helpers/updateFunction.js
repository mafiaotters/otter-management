const updateMemberDAO = require('./updateMemberDAO');
const backupWebsite = require('./backupWebsite');
const updateOtterJson = require('./updateOtterJson');
const uploadUpdate = require('./uploadUpdate');
const updateMemberRole = require('./updateMemberRole');

async function updateFunction(bot) {

    // Télécharger la structure actuelle du site, du GitHub
    //await downloadGitWebsite('https://github.com/Satalis/LOUTRES_SITE/', './PublicWebsite')

    // Créer une backup du site actuellement sur FTP
    await backupWebsite();

    // Mettre à jour les rôles des membres (Scan complet)
    await updateMemberRole(bot);
    
    // Edit le fichier MemberDAO
    await updateMemberDAO(bot); 

    // Edit le fichier Otter.json
    await updateOtterJson(bot);

    // Upload le site sur le FTP
    await uploadUpdate(); 

}
module.exports = updateFunction;