const Discord = require('discord.js');
const db = require('../Loader/loadDatabase'); 
const handleMemberLeave = require('../Events/handleMemberLeave');

async function deleteMember(discordName, interaction) {
    const profilesRef = db.collection('profiles');
    const userDocRef = profilesRef.doc(discordName);

    const docSnapshot = await userDocRef.get();
    if(!docSnapshot.exists) {
        console.log(`: Membre inexistant dans la base de données: ${discordName}`);
        if (interaction) {
            return interaction.reply({ content: "Ce membre n'est pas dans la base de données.", ephemeral: true });
        } else {
            // Gérer le cas où interaction n'est pas défini
            console.log("Action impossible : Ce membre n'est pas dans la base de données.");
            return;
        }
    }
    await userDocRef.delete();
    // Supprimer le membre de la collection activeMembers
    await handleMemberLeave(null, { user: { username: discordName } });
    
    if (!interaction.deferred && !interaction.replied) {
        await interaction.reply({ content: `Le membre ${discordName} a été retiré avec succès.`, ephemeral: true });
    } else if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: `Le membre ${discordName} a été retiré avec succès.` });
    }
}

module.exports = deleteMember;