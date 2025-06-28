const db = require('../Loader/loadDatabase'); 
const fs = require('fs');
const path = require('path');  

/*  async function addMemberToActiveMembers(member, prenom, nom, bot) {
    rolePermissions = bot.rolePermissions
    const discordName = member.user.username;
    const roles = member.roles.cache;
    const activeRef = db.collection('activeMembers');
  
    // Trouver le rôle le plus élevé du membre qui est également défini dans rolePermissions
    const highestRole = roles
      .filter(role => rolePermissions[role.name])
      .sort((a, b) => rolePermissions[b.name] - rolePermissions[a.name])
      .first();
  
    if (!highestRole || !rolePermissions[highestRole.name]) {
      console.log(`Aucun rôle significatif trouvé pour ${discordName}.`);
      return;
    }
  
    // Ajouter le membre dans la collection "activeMembers" sous le rôle le plus élevé trouvé
    const highestRoleRef = activeRef.doc(highestRole.name).collection('members');
    await highestRoleRef.doc(discordName).set({pseudo: prenom + " " + nom}); 
    console.log(`Ajouté à la collection ${highestRole.name} pour ${discordName} avec le pseudo: ${discordName}`);
}*/

module.exports = {
    name: "add",
    description: "Ajoute un membre dans la BDD.",
    permission: "Aucune",
    dm: true,
    category: "User",
    options: [
        {
            type: "USER",
            name: "membre",
            description: "Membre à ajouter dans la BDD.",
            required: true,
            autocomplete: true,
        },
        {
            type: "STRING",
            name: "prenom",
            description: "Prénom in-game du membre.",
            required: true,
            autocomplete: false,
        },
        {
            type: "STRING",
            name: "nom",
            description: "Nom in-game du membre.",
            required: true,
            autocomplete: false,
        },
        {
            type: "STRING",
            name: "filename",
            description: "Nom de fichier pour le profil du membre.",
            required: true,
            autocomplete: false,
        },
        {
            type: "STRING",
            name: "titre",
            description: "Titre du site du membre. (Non-obligatoire)",
            required: false,
            autocomplete: false,
        }
    ],

    async run(bot, interaction, args) {

        try{
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply({ ephemeral: true });
            }
    

        const timestamp = new Date().toISOString();
        // Liste des ID des utilisateurs autorisés
        const allowedUsers = bot.settings.commands.allowedUsers; // Jungso, Sefa, Kaaz, compte test Sefa
        // Vérifie si l'utilisateur est un administrateur ou s'il est dans la liste des utilisateurs autorisés
        const isAllowedUser = allowedUsers.includes(interaction.user.id);


        // Vérifie l'autorisation
        if (!isAllowedUser) {
            // Si l'utilisateur n'est ni admin ni dans la liste, on refuse l'exécution de la commande
            console.log( `[Add] Utilisateur non autorisé: ${interaction.user.username}`);
            return interaction.followUp({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }
        
        // Supposons que args[0] est l'ID Discord du membre à ajouter
        const discordUser = interaction.options.getUser('membre');
        const discordId = discordUser.id;
        const discordName = discordUser.username; // Récupérer le nom d'utilisateur Discord

        // Accéder à Firestore pour créer ou mettre à jour le document
        const profilesRef = db.collection('profiles');
        const userDocRef = profilesRef.doc(discordId);

        const docSnapshot = await userDocRef.get();
        if(docSnapshot.exists) {
            console.log(`${timestamp}: Membre déjà dans la base de données: ${discordName}`)
            return interaction.followUp({ content: "Ce membre est déjà dans la base de données.", ephemeral: true });
        }

       /* console.log('displayName: ' + discordUser.displayName);
        console.log('username: ' + discordUser.username);
        console.log('tag: ' + discordUser.tag);
        console.log('discordUser: ' + discordUser.nickname);*/


        const nom = interaction.options.getString('nom');
        const prenom = interaction.options.getString('prenom');
        const titre = interaction.options.getString('titre') || "Loutre Mafieuse"; // Utilisez "Loutre Mafieuse" comme valeur par défaut si titre est vide
        const fileName = interaction.options.getString('filename');

        await userDocRef.set({
            discordName: discordName,
            lodestoneId: " ",
            verified: false,
            discordId: discordId,
            currentRole: "Attente Update",
            Prenom: prenom,
            Nom: nom,
            websiteInfo:{
                fileName: fileName,
                Titre: titre,
                profilPage: false,
                profilPageInfo: {
                    descriptionHTML: " ",
                    titre1: "Gauche",
                    titre2: "Milieu",
                    titre3: "Droite",
                }
            }
        });

            //await addMemberToActiveMembers(await interaction.guild.members.fetch(discordUser), prenom, nom, bot);

            console.log(`[Add] Membre ajouté avec succès: ${discordName}`)
            await interaction.followUp({ content: `Le membre ${discordName} a été ajouté avec succès.`, ephemeral: true });
        } catch (error) {
        console.error("Erreur lors de l'ajout du membre:", error);
        if (!interaction.deferred && !interaction.replied) {
            await interaction.followUp({ content: "Une erreur est survenue lors de l'exécution de la commande.", ephemeral: true }).catch("Erreur lors de l'ajout d'un membre en BDD: ", console.error);
        }
    }}
        
}
