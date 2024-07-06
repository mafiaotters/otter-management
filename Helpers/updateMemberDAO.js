const fs = require('fs');
const path = require('path');

// Simuler la récupération des données des membres depuis PublicWebsite/memberDAO.php
const members = [
    { img: "assets/img/speakers/mimino.jpg", firstName: "Mimino", lastName: "Mino", title: "Loutre Princesse", hasAvatar: true, avatarType: "Avatar2" },
    // Ajoutez d'autres membres ici
];

async function generateMemberDAO() {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}]: Edition du fichier MemberDAO...`);
    // Chemin vers le fichier JSON où vous souhaitez sauvegarder les données des membres
    const filePath = path.join(__dirname, '../PublicWebsite/data/otter.json');

    // Convertir l'objet JavaScript en chaîne JSON
    const data = JSON.stringify(members, null, 2);

    // Écrire les données dans le fichier JSON
    fs.writeFile(filePath, data, (err) => {
        if (err) {
            console.error("Erreur lors de l'écriture du fichier MemberDAO:", err);
        } else {
            console.log('MemberDAO édité avec succès.');
        }
    });
}

// Exécuter la fonction
module.exports = generateMemberDAO;