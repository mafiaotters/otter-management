const updateMemberDAO = require('@websiteUtils/updateMemberDAO');
const backupWebsite = require('@websiteUtils/backupWebsite');
const updateOtterJson = require('@websiteUtils/updateOtterJson');
const uploadUpdate = require('@websiteUtils/uploadUpdate');
const updateMemberRole = require('@websiteUtils/updateMemberRole');
const { EmbedBuilder } = require('discord.js');


async function updateFunction(bot, interaction) {

    // Créer une backup du site actuellement sur FTP
    await backupWebsite();

    let modifications = [];

    // Mettre à jour les rôles des membres (Scan complet)
    modifications = await updateMemberRole(bot);

    // Edit le fichier MemberDAO
    await updateMemberDAO(bot); 

    // Edit le fichier Otter.json
    await updateOtterJson(bot);

    // Upload le site sur le FTP
    await uploadUpdate(); 

    return modifications
}

module.exports = updateFunction;