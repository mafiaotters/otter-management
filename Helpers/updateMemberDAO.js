const fs = require('fs');
const path = require('path');

// Fonction pour générer le contenu de MemberDAO.php
async function updateMemberDAO() {
    // Début du template de MemberDAO.php
    let content = `<?php
class MemberDAO
{
    function getAll()
    {
        return array(
`;

    // Générer les lignes pour chaque membre
    members.forEach(member => {
        content += `            new Member("${member.photo}", "${member.prenom}", "${member.nom}", "${member.titre}", ${member.profilPage}, "${member.photoProfil}"),\n`;
    });

    // Fin du template de MemberDAO.php
    content += `        );
    }
}`;

    // Chemin vers le fichier MemberDAO.php
    const filePath = path.join(__dirname, '../devWebsite/memberDAO.php');

    // Écrire le contenu dans le fichier MemberDAO.php
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error("Erreur lors de l'écriture du fichier MemberDAO.php:", err);
        } else {
            console.log('MemberDAO.php mis à jour avec succès.');
        }
    });
}

// Exécuter la fonction

modules.exports = updateMemberDAO();