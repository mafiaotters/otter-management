const db = require('@loader/loadDatabase'); // Assurez-vous que cette importation est correcte
require('dotenv').config();

function getHighestRole(memberRoles, bot) {
    let highestRole = null;
    let highestPermissionValue = 0;

    memberRoles.forEach(role => {
        const roleName = role.name; // Role étudié

        if (Object.keys(bot.rolePermissions).includes(roleName)) { // Vérifiez si le rôle scanné est dans rolePermissions
            const permissionValue = bot.rolePermissions[roleName];

            if (permissionValue && permissionValue > highestPermissionValue) {
                highestPermissionValue = permissionValue;
                highestRole = roleName;
            }
        }
    });

    return highestRole;
}

async function removeMemberFromActiveMembers(activeRef, discordId, bot) {
    for (const roleName of Object.keys(bot.rolePermissions)) {
        const roleRef = activeRef.doc(roleName).collection('members');
        const memberDoc = await roleRef.doc(discordId).get();

        if (memberDoc.exists) {
            await roleRef.doc(discordId).delete();
            console.log(`Retiré de la collection ${roleName} pour ${discordId}`);
        }
    }
}

async function updateMemberRole(bot) {
    const modifications = []; // Tableau pour sauvegarder les modifications
    const guild = await bot.guilds.fetch(bot.settings.mainGuildId);
    console.log(`Récupération de la guilde: ${guild.name}`);

    // Récupérer tous les profils de la collection 'profiles'
    const profilesSnapshot = await db.collection('profiles').get();
    console.log(`Récupération de tous les profils Firestore...`);

    for (const profileDoc of profilesSnapshot.docs) {
        const discordName = profileDoc.data().Prenom;
        const discordId = profileDoc.id;

        if (!discordId) {
            console.log(`discordId non trouvé pour ${discordName}`);
            continue;
        }

        try {
            const member = await guild.members.fetch(discordId);
            const profileData = profileDoc.data();
            const activeRef = db.collection('activeMembers');

            // Vérifiez son rôle le plus élevé
            const highestRole = await getHighestRole(member.roles.cache, bot);

            console.log(`${discordName} : Rôle le plus élevé trouvé: ${highestRole}`);

            // Si rôle listé dans rolePermissions
            if (highestRole) {
                if (highestRole !== profileData.currentRole) {
                    console.log(`${discordName} : Mise à jour du rôle le plus élevé`);
                    await profileDoc.ref.update({ currentRole: highestRole, roleRemoved: false });

                    modifications.push({
                        user: discordName,
                        action: 'Role Updated',
                        role: highestRole,
                    });

                    await removeMemberFromActiveMembers(activeRef, discordId, bot);

                    const prenom = profileDoc.data().Prenom || "";
                    const nom = profileDoc.data().Nom || "";
                    const fullName = `${prenom} ${nom}`;

                    const highestRoleRef = activeRef.doc(highestRole).collection('members');
                    await highestRoleRef.doc(discordId).set({ pseudo: fullName });
                    console.log(`${discordName} : Ajouté à la collection ${highestRole} avec le pseudo: ${fullName}`);
                }
            } else {
                // Vérifier si l'utilisateur a déjà été marqué comme "n'est plus une loutre"
                if (!profileData.roleRemoved) {
                    console.log(`${discordName} : Aucun rôle significatif trouvé. Suppression du profil de activeMembers.`);
                    modifications.push({
                        user: discordName,
                        action: 'Role Updated',
                        role: "N'est plus une loutre.",
                    });
                    await profileDoc.ref.update({ currentRole: null, roleRemoved: true });
                    await removeMemberFromActiveMembers(activeRef, discordId, bot);
                } else {
                    console.log(`${discordName} : Déjà marqué comme sans rôle, aucune modification.`);
                }
            }
        } catch (error) {
            if (error.message.includes('Unknown Member')) {
                console.error(`${discordName} : Erreur lors de la récupération, avec discordId: ${discordId}`);
                continue;
            } else {
                console.error(`${discordName} : Erreur inconnue lors de la récupération, avec discordId: ${discordId}`, error);
                continue;
            }
        }
    }
    return modifications;
}

module.exports = updateMemberRole;
