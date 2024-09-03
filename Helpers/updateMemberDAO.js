const fs = require('fs');
const path = require('path');
const db = require('../Loader/loadDatabase');
const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();


async function updateMemberDAO() {
    const rolePermissions = {
      "Le Parrain": 6,
      "Sottocapo": 5,
      "Enroloutre": 4,
      "Loutre Mafieuse": 3,
      "Loutre Naissante": 2
    };
  
    let membersList = [];
  
    for (const role of Object.keys(rolePermissions).sort((a, b) => rolePermissions[b] - rolePermissions[a])) {
      const roleRef = db.collection('activeMembers').doc(role).collection('members');
      const membersSnapshot = await roleRef.get();
      console.log(`Récupération des membres pour le rôle ${role}...`);
  
      for (const memberDoc of membersSnapshot.docs) {
        const discordName = memberDoc.id;
        const profileDoc = await db.collection('profiles').doc(discordName).get();

        console.log(`Récupération du profil de ${discordName}...`);
  
        if (profileDoc.exists) {
          const profileData = await profileDoc.data();

            // Vérifiez si les champs Prenom et Nom existent et ne sont pas undefined
            const prenom = profileData.Prenom || "Prénom";
            const nom = profileData.Nom || "Nom";

          // Ajoutez ici les informations nécessaires à partir de profileData, dans le tableau membersList
          membersList.push({
            fileName: profileData.websiteInfo.fileName,
            Prenom: prenom,
            Nom: nom,
            Titre: role,
            profilPage: profileData.websiteInfo.profilPage,
          });
        }else{console.log('ERROR: no profile data')}
      }

    }
  
    // Une fois tous les membres récupérés, générer le fichier MemberDAO.php
    await writeMemberDAO(membersList);
  }



// Fonction pour générer le contenu de MemberDAO.php
async function writeMemberDAO(membersList) {

    // Configuration de la connexion SFTP
    const sftpOptions = {
        host: process.env.FTP_HOST,
        port: process.env.FTP_PORT,
        user: process.env.FTP_USER,
        password: process.env.FTP_PASS
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

    
    // Générer les lignes pour chaque membre
    for (const member of membersList) {
        const basePath = process.env.GITHUB_BRANCH === 'main' ? '/assets/img/speakers' : '/dev/assets/img/speakers';
        const remoteAvatarPath = `${basePath}/${member.fileName}_1.jpg`;
        let avatar = "NoAvatar2";

        try {
            const exists = await sftp.exists(remoteAvatarPath);
            avatar = exists ? "Avatar2" : "NoAvatar2";
        } catch (err) {
            console.error(`Erreur lors de la vérification de l'existence de l'avatar sur le serveur SFTP: ${err.message}`);
        }

        content += `            new Member("assets/img/speakers/${member.fileName}.jpg", "${member.Prenom}", "${member.Nom}", "${member.Titre}", ${member.profilPage}, "${avatar}"),\n`;
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