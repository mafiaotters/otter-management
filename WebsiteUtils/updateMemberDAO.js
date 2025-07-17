const fs = require('fs');
const path = require('path');
const db = require('@loader/loadDatabase');
const SftpClient = require('ssh2-sftp-client');
const { dateFormatLog } = require('../Helpers/logTools');
const sftp = new SftpClient();


async function updateMemberDAO(bot) {
    const rolePermissions = bot.rolePermissions;
  
    let membersList = [];
  
    for (const role of Object.keys(rolePermissions).sort((a, b) => rolePermissions[b] - rolePermissions[a])) {
      const roleRef = db.collection('activeMembers').doc(role).collection('members');
      const membersSnapshot = await roleRef.get();
      console.warn(`${role} : Récupération des membres du rôle ...`);
  
      for (const memberDoc of membersSnapshot.docs) {
        const discordId = memberDoc.id;
        const profileDoc = await db.collection('profiles').doc(discordId).get();

        console.log(`${discordId} : Récupération du profil...`);
  
        if (profileDoc.exists) {
          const profileData = await profileDoc.data();

           // Vérifiez si les champs Prenom et Nom existent, supprimez les guillemets s'ils existent, et utilisez des valeurs par défaut si non définis
        const prenom = profileData.Prenom ? profileData.Prenom.replace(/"/g, '') : "Prénom";
        const nom = profileData.Nom ? profileData.Nom.replace(/"/g, '') : "Nom";

          // Ajoutez ici les informations nécessaires à partir de profileData, dans le tableau membersList
          membersList.push({
            Prenom: prenom,
            Nom: nom,
            fileName: profileData.websiteInfo.fileName,
            Titre: profileData.websiteInfo.Titre,
            profilPage: profileData.websiteInfo.profilPage,
            hidden : profileData.websiteInfo.hidden,
            currentRole : profileData.currentRole,
            discordId : profileData.discordId,
            profileTitre1 : profileData.websiteInfo.profilPageInfo.titre1,
            profileTitre2 : profileData.websiteInfo.profilPageInfo.titre2,
            profileTitre3 : profileData.websiteInfo.profilPageInfo.titre3,
            profileDescriptionHTML : profileData.websiteInfo.profilPageInfo.descriptionHTML
          });
        }else{console.log('ERROR: no profile data')}
      }

    }
  
    // Une fois tous les membres récupérés, générer le fichier MemberDAO.php
    await writeMemberDAOPHP(membersList);
    //await writeMemberDAOCSV(membersList)
  }

// Fonction pour générer le contenu de MemberDAO.CSV
async function writeMemberDAOCSV(membersList) {
    try {
        const tmpDirPath = path.join(__dirname, '../tmp');
        if (!fs.existsSync(tmpDirPath)) {
            fs.mkdirSync(tmpDirPath, { recursive: true });
            console.log(await dateFormatLog() + ' [CSV] Dossier "tmp" créé avec succès.');
        }

        const csvFilePath = path.join(tmpDirPath, 'MemberDAO.csv');

        if (membersList.length === 0) {
            console.warn(await dateFormatLog() + ' [CSV] Aucun membre à enregistrer.');
            return;
        }

        console.warn(await dateFormatLog() + ' [CSV] Génération du fichier MemberDAO.csv...');

        // Connexion au serveur SFTP
        await sftp.connect({
            host: process.env.FTP_HOST,
            port: process.env.FTP_PORT,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            readyTimeout: 20000,
            keepaliveInterval: 5000
        });

        // Séparer les premiers 8 membres du reste
        const firstMembers = membersList.slice(0, 8);
        let remainingMembers = membersList.slice(8).sort(() => Math.random() - 0.5);
        const combinedMembers = [...firstMembers, ...remainingMembers];

        const headers = [
            'fileName', 'Prenom', 'Nom', 'Titre', 'profilPage', 'hidden',
            'currentRole', 'discordId', 'profileTitre1', 'profileTitre2',
            'profileTitre3', 'profileDescriptionHTML', 'avatar', 'extension' 
        ];

        const basePath = process.env.GITHUB_BRANCH === 'main' ? './www/assets/img/speakers' : './www/dev/assets/img/speakers';

        // Générer les lignes du CSV
        const csvData = [];
        for (const member of combinedMembers) {
            if (member.hidden ?? false) {
                console.warn(await dateFormatLog() + ` [CSV] ${member.Prenom} ${member.Nom} : Membre caché, non inclus.`);
                continue;
            }

            console.log(await dateFormatLog() + ` [CSV] Vérification de l'avatar pour ${member.Prenom} ${member.Nom}...`);

            // Trouver l'extension jpg/png
            let extension = "jpg";
            let existsExt = await sftp.exists(`${basePath}/${member.fileName}.jpg`);
            extension = existsExt ? "jpg" : "png"; // Définit l'extension trouvée

            const remoteAvatarPath = `${basePath}/${member.fileName}_1.${extension}`;
            let avatar = "NoAvatar2";

            let exists = await sftp.exists(remoteAvatarPath);
            avatar = exists ? "Avatar2" : "NoAvatar2";

            const row = headers.map(header => {
                if (header === "avatar") return `"${avatar}"`;
                if (header === "extension") return `"${extension}"`; 

                let value = member[header] !== undefined ? member[header] : '';
                if (typeof value === 'string') {
                    value = value.replace(/"/g, '""'); // Échapper les guillemets
                }
                return `"${value}"`;
            });

            csvData.push(row.join(','));
        }

        // Écriture du fichier CSV
        fs.writeFileSync(csvFilePath, [headers.join(','), ...csvData].join('\n'), 'utf8');

        console.log(await dateFormatLog() + ` [CSV] Fichier MemberDAO.csv généré avec succès (${csvData.length} membres).`);

        // Fermer la connexion SFTP
        await sftp.end();
    } catch (error) {
        console.error(await dateFormatLog() + ' [CSV] Erreur lors de la création du fichier MemberDAO.csv :', error);
    }
}


// Fonction pour générer le contenu de MemberDAO.php
async function writeMemberDAOPHP(membersList) {

    // Configuration de la connexion SFTP
    const sftpOptions = {
        host: process.env.FTP_HOST,
        port: process.env.FTP_PORT,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS,
        readyTimeout: 20000, // Timeout pour l'authentification
        keepaliveInterval: 5000, // Ping pour garder la connexion active    
    };

    // Connexion au serveur SFTP
    await sftp.connect(sftpOptions);

    // Début du template de MemberDAO.php
    let content = `<?php

    require_once "member.php";

class MemberDAO
{
    function getAll()
    {
        return array(
`;

    // Séparer les premiers 6 membres du reste
    const firstMembers = membersList.slice(0, 8);
    let remainingMembers = membersList.slice(8);

    // Mélanger les membres restants
    remainingMembers = remainingMembers.sort(() => Math.random() - 0.5);

    // Combiner les deux parties
    const combinedMembers = [...firstMembers, ...remainingMembers];


    
    // Générer les lignes pour chaque membre
    for (const member of combinedMembers) {
        if(member.hidden ?? false) {
            console.warn(`${member.Prenom} ${member.Nom} : Membre caché du site.`);
            continue;

        } //Si on veut cacher le membre du site, 
        console.log(`${member.Prenom} ${member.Nom} : Vérification de l'existence de l'avatar...`);
        const basePath = process.env.GITHUB_BRANCH === 'main' ? './www/assets/img/speakers' : './www/dev/assets/img/speakers';

        try{
            // Trouver l'extension png/jpg du joueur
            let extension = "jpg"; // Par défaut, jpg
            let existsExt = await sftp.exists(`${basePath}/${member.fileName}.jpg`); //Vérifier Jpg, la plus courante.
            extension = existsExt ? "jpg" : "png"; // Définit l'extension de l'avatar


            const remoteAvatarPath = `${basePath}/${member.fileName}_1.${extension}`;
            let avatar = "NoAvatar2"; // Par défaut, pas d'avatar

            let exists = await sftp.exists(remoteAvatarPath); //Vérifier Jpg, la plus courante.
            avatar = exists ? "Avatar2" : "NoAvatar2";     
            content += `            new Member("assets/img/speakers/${member.fileName}.${extension}", "${member.Prenom}", "${member.Nom}", "${member.Titre}", ${member.profilPage}, "${avatar}"),\n`;
            
        } catch (err) {
            console.error(`Erreur lors de la vérification de l'existence de l'avatar sur le serveur SFTP: ${err.message}`);
        }

    }

    // Fin du template de MemberDAO.php
    content += `        );
    }
}
    
class FriendsMemberDAO
{

    function getAll()
    {
        return array(
            new Member("assets/img/speakers/ochi.jpg", "Ochi", "Mochi", "Cinis Chimaeras", true, "Avatar2"),
            new Member("assets/img/speakers/flora.jpg", "Flora", "Mantis", "Cinis Chimaeras", false, "Avatar2"),
            new Member("assets/img/speakers/kajiya.jpg", "Kajiya", "Nahel", "Cinis Chimaeras", false, "NoAvatar2"),
		    new Member("assets/img/speakers/alys.jpg", "Alys", "Huin", "Cinis Chimaeras", false, "NoAvatar2"),
			new Member("", "Kayak", "Hamo", "Cinis Chimaeras", false, "NoAvatar2"),
            new Member("assets/img/speakers/ella.jpg", "Ella", "Danloce", "Cinis Chimaeras", false, "NoAvatar2"),
        );
    }
}`;

    const tmpDirPath = path.join(__dirname, '../tmp');
    if (!fs.existsSync(tmpDirPath)) {
        // Créer le dossier "tmp" s'il n'existe pas
        fs.mkdirSync(tmpDirPath, { recursive: true });
        console.log('Dossier "tmp" créé avec succès.');
    }
    // Écrire le contenu dans le fichier MemberDAO.php
    fs.writeFile(tmpDirPath + '/memberDAO.php', content, (err) => {
        if (err) {
            console.error("Erreur lors de l'écriture du fichier MemberDAO.php:", err);
        } else {
            console.log('MemberDAO.php mis à jour avec succès.');
        }
    });

     // Fermer la connexion SFTP
     sftp.end();
}

module.exports = updateMemberDAO;