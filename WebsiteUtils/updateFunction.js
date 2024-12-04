const updateMemberDAO = require('@websiteUtils/updateMemberDAO');
const backupWebsite = require('@websiteUtils/backupWebsite');
const updateOtterJson = require('@websiteUtils/updateOtterJson');
const uploadUpdate = require('@websiteUtils/uploadUpdate');
const updateMemberRole = require('@websiteUtils/updateMemberRole');

async function updateFunction(bot) {

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