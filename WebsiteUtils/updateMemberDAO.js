const fs = require('fs');
const path = require('path');
const db = require('@loader/loadDatabase');
const SftpClient = require('ssh2-sftp-client');
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
            fileName: profileData.websiteInfo.fileName,
            Prenom: prenom,
            Nom: nom,
            Titre: profileData.websiteInfo.Titre,
            profilPage: profileData.websiteInfo.profilPage,
            hidden : profileData.websiteInfo.hidden
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
        const basePath = process.env.GITHUB_BRANCH === 'main' ? '/assets/img/speakers' : '/dev/assets/img/speakers';

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