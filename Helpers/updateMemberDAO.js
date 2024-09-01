const fs = require('fs');
const path = require('path');
const db = require('../Loader/loadDatabase');


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
          const profileData = profileDoc.data();

          console.log(profileData)
          console.log('photo', profileData.websiteInfo.PhotoLoutre)

          // Ajoutez ici les informations nécessaires à partir de profileData, dans le tableau membersList
          membersList.push({
            PhotoLoutre: profileData.websiteInfo.PhotoLoutre,
            Prenom: profileData.websiteInfo.Prenom,
            Nom: profileData.websiteInfo.Nom,
            Titre: role,
            profilPage: profileData.websiteInfo.profilPage,
            PhotoLoutre2: profileData.websiteInfo.PhotoLoutre2
          });
        }else{console.log('ERROR: no profile data')}
      }

      console.log('Membres :', membersList)

    }
  
    // Une fois tous les membres récupérés, générer le fichier MemberDAO.php
    await writeMemberDAO(membersList);
  }



// Fonction pour générer le contenu de MemberDAO.php
async function writeMemberDAO(membersList) {
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
    membersList.forEach(member => {
        content += `            new Member("${member.PhotoLoutre}", "${member.Prenom}", "${member.Nom}", "${member.Titre}", ${member.profilPage}, "${member.PhotoLoutre2}"),\n`;
    });

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

    // Chemin vers le fichier MemberDAO.php
    const filePath = path.join(__dirname, '../memberDAO.php');

    // Écrire le contenu dans le fichier MemberDAO.php
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error("Erreur lors de l'écriture du fichier MemberDAO.php:", err);
        } else {
            console.log('MemberDAO.php mis à jour avec succès.');
        }
    });
}

module.exports = updateMemberDAO;