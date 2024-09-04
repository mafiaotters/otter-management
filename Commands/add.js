const db = require('../Loader/loadDatabase'); 

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
        const timestamp = new Date().toISOString();
        // Liste des ID des utilisateurs autorisés
        const allowedUsers = ['207992750988197889', '173439968381894656', '239407042182381588']; // Jungso, Sefa, Kaaz, compte test Sefa
        // Vérifie si l'utilisateur est un administrateur ou s'il est dans la liste des utilisateurs autorisés
        const isAllowedUser = allowedUsers.includes(interaction.user.id);
    
        // Vérifie l'autorisation
        if (!isAllowedUser) {
            // Si l'utilisateur n'est ni admin ni dans la liste, on refuse l'exécution de la commande
            return interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }
        
        // Supposons que args[0] est l'ID Discord du membre à ajouter
        const discordUser = interaction.options.getUser('membre');
        const discordId = discordUser.id;
        const discordName = discordUser.username; // Récupérer le nom d'utilisateur Discord

        // Accéder à Firestore pour créer ou mettre à jour le document
        const profilesRef = db.collection('profiles');
        const userDocRef = profilesRef.doc(discordName);

        const docSnapshot = await userDocRef.get();
        if(docSnapshot.exists) {
            console.log(`${timestamp}: Membre déjà dans la base de données: ${discordName}`)
            return interaction.reply({ content: "Ce membre est déjà dans la base de données.", ephemeral: true });
        }

       /* console.log('displayName: ' + discordUser.displayName);
        console.log('username: ' + discordUser.username);
        console.log('tag: ' + discordUser.tag);
        console.log('discordUser: ' + discordUser.nickname);*/


        const nom = interaction.options.getString('nom');
        const prenom = interaction.options.getString('prenom');
        const titre = interaction.options.getString('titre') || "Loutre Naissante"; // Utilisez "Loutre Naissante" comme valeur par défaut si titre est vide
        const fileName = interaction.options.getString('filename');
  

        try {
            await userDocRef.set({
                discordName: discordName,
                lodestoneId: " ",
                verified: false,
                discordId: discordId,
                currentRole: " ",
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
            await interaction.reply({ content: `Le membre ${discordName} a été ajouté avec succès.`, ephemeral: true });
            console.log(`${timestamp}: Membre ajouté avec succès: ${discordName}`)
        } catch (error) {
            console.error(timestamp + ": Erreur lors de l'ajout du membre " + discordName, error);
            await interaction.reply({ content: "Une erreur est survenue lors de l'ajout du membre.", ephemeral: true });
        }

        
    }
}