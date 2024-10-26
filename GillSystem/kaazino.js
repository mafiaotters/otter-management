const db = require('../Loader/loadDatabase'); 
const updateUserGills = require('./updateUserGills');
const { EmbedBuilder } = require('discord.js');

const objects = [
    {symbole: '🍓', coeff: 2.2}, 
    {symbole:'🍪', coeff: 2.3}, 
    {symbole:'🍑', coeff: 2.4},
    {symbole: '🍉', coeff: 2}, 
    {symbole:'🍒', coeff: 1.9}, 
    {symbole:'🍌', coeff: 1.9}, 
    {symbole:'🍐', coeff: 1.8},
    {symbole: '🐟', coeff : 4.7}
];

// FONCTION DE DEVELOPPEMENT SIMULATEGAINS - Permet de voir le gain par tentative, lissé.
function simulateGains(numSimulations) {
    console.warn("[DEV] Simulation des gains en cours...");
    let totalGains = 0;
    for (let i = 0; i < numSimulations; i++) {
        const result = `${generateRandomLine()}\n${generateRandomLine()}\n${generateRandomLine()}\n-------------\n${generateRandomLine()}\n-------------`;
        totalGains += calculateGains(result);
    }
    return totalGains / numSimulations;
}
console.warn(`Gains moyens par tour: ${simulateGains(300000)}`);


function generateRandomLine() {
    const line = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * objects.length);
        line.push(objects[randomIndex].symbole);
    }
    return line.join(' • ');
}

async function kaazino(bot, interaction) {
    const userRef = db.collection('gillSystem').doc(interaction.user.id);
    const doc = await userRef.get();

    if (!doc.exists) {
        return interaction.editReply({ content: 'Tu n\'as pas encore de compte GillSystem. Utilisez la commande `/collecte` pour avoir tes premiers gills !', ephemeral: true });
    }    
    const lastPlayedKaazinoData = doc.data() ? doc.data().lastPlayedKaazino : undefined;
    const lastPlayedKaazino = lastPlayedKaazinoData ? lastPlayedKaazinoData.toDate() : new Date().setFullYear(1970);
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000); // 10 minutes en millisecondes

    if (lastPlayedKaazino && lastPlayedKaazino > tenMinutesAgo) {
        // L'utilisateur a déjà joué dans les 10 dernières minutes
        return interaction.editReply({ content: "Vous avez déjà joué à la machine à sous dans les 10 dernières minutes. Revenez plus tard !", ephemeral: true });
    }

    // L'utilisateur peut jouer à la machine à sous
    // Redéfinir la date à maintenant, pour éviter des spams.
    //await userRef.update({ lastPlayedKaazino: new Date() });


    const gillsToSpend = Math.floor(Math.random() * (12 - 8 + 1)) + 8; // Dépense aléatoire entre 8 et 12 gills
    if(doc.data().gills < gillsToSpend) {
        return interaction.editReply({ content: `Tu n'as pas assez de gills pour la machine à sous, SALE PAUVRE TOCARD`, ephemeral: true });
    }

    // Mettre à jour le solde de gills de l'utilisateur
    await updateUserGills(interaction.user, Math.floor(gillsToSpend) * -1);

    // Création de l'embed initial
    let embed = new EmbedBuilder()
        .setTitle('Machine à Sous')
        .setDescription('La machine à sous tourne...')
        .setColor('#003aff');

    // Envoyer l'embed initial
    await interaction.editReply({ content: `:slot_machine: • <@${interaction.user.id}> envoie ${gillsToSpend} :fish: pour la machine à sous..`, embeds: [embed], ephemeral: false });

    // Simuler le temps de rotation de la machine à sous 3 fois
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
        const currentResult = `${generateRandomLine()}\n${generateRandomLine()}\n${generateRandomLine()}`;
        embed.setDescription(`\n${currentResult}`);
        await interaction.editReply({ embeds: [embed] });
    }

    // Générer le dernier embed de la machine à sous
    const result = `${generateRandomLine()}\n${generateRandomLine()}\n${generateRandomLine()}\n-------------\n${generateRandomLine()}\n-------------`;

    // Calculer les gains en utilisant les coefficients
    const gains = calculateGains(result);

    // Mise à jour de l'embed avec le résultat de la machine à sous et les gains
    embed.setDescription(`${result}`)

    // Déterminer le texte à afficher en fonction des gains
    let resultText = '';
    if (gains === 0) {
        resultText = 'et perd :otter_cry~1:';
        embed.setColor('#a40303');
    } else {
        resultText = 'et gagne ! :otter_pompom:';
        embed.setColor('#28a403');
    }

    // Mise à jour du message avec le nouvel embed
    await interaction.editReply({ content: `:slot_machine: • <@${interaction.user.id}> envoie ${gillsToSpend} :fish: pour la machine à sous... ${resultText}`, embeds: [embed], epheremal: false });

    // Mettre à jour le solde de gills de l'utilisateur avec les gains
    await updateUserGills(interaction.user, Math.floor(gains));
}

function calculateGains(result) {
    let gains = 0;
    const lines = result.split('\n');
    const lastLine = lines[lines.length - 2]; // Prendre uniquement l'avant dernière ligne, soit la dernière ligne avec symbole

    //console.log("Dernière ligne:", lastLine);

    // Compter les occurrences de chaque symbole
    const symbolCounts = {};
    objects.forEach(obj => {
        const count = (lastLine.match(new RegExp(obj.symbole, 'g')) || []).length;
        symbolCounts[obj.symbole] = count;
    });

    // Calculer les gains en fonction des occurrences
    objects.forEach(obj => {
        const count = symbolCounts[obj.symbole];
        if (count === 2) {
            gains += obj.coeff * 11.25; // Gain pour 2 occurrences
        } else if (count === 3) {
            gains += obj.coeff * 27; // Gain pour 3 occurrences
        }
    });
    //console.log("Gains: " + gains);
    return gains;
}

module.exports = kaazino;