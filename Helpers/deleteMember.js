const Discord = require('discord.js');
const db = require('../Loader/loadDatabase'); 
const handleMemberLeave = require('../Events/handleMemberLeave');

const {dateFormatLog} = require('./logTools');

async function deleteMember(discordName, interaction, bot) {
    const profilesRef = db.collection('profiles');
    const userDocRef = profilesRef.doc(discordName);

    if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ ephemeral: true });
    }

    const docSnapshot = await userDocRef.get();
    if(!docSnapshot.exists) {
        console.log(`${await dateFormatLog()} Membre inexistant dans la base de données: ${discordName}`);
        if (interaction) {
            return interaction.followUp({ content: "Ce membre n'est pas dans la base de données.", ephemeral: true });
        } else {
            // Gérer le cas où interaction n'est pas défini
            console.log(await dateFormatLog() + "Action impossible : Ce membre n'est pas dans la base de données.");
            return;
        }
    }
    await userDocRef.delete();
    // Supprimer le membre de la collection activeMembers
    await handleMemberLeave(bot, { user: { username: discordName } });

    console.log(`Membre ${discordName} supprimé de la base de données.`);
    await interaction.followUp({ content: `Le membre ${discordName} a été retiré avec succès.`, ephemeral: true });

}

module.exports = deleteMember;