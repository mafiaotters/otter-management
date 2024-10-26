const updateUserGills = require('./updateUserGills');
const { EmbedBuilder } = require('discord.js');

const objects = [
    {symbole: '🍓', coeff: 3}, 
    {symbole:'🍪', coeff: 2.78}, 
    {symbole:'🍑', coeff: 2.48},
    {symbole: '🍉', coeff: 2.82}, 
    {symbole:'🍒', coeff: 2.65}, 
    {symbole:'🍌', coeff: 3.27}, 
    {symbole:'🍐', coeff: 2.98},
    {symbole: '🐟', coeff : 7.5}
];

// FONCTION DE DEVELOPPEMENT SIMULATEGAINS - Permet de voir le gain par tentative, lissé.
/*function simulateGains(numSimulations) {
    console.warn("[DEV] Simulation des gains en cours...");
    let totalGains = 0;
    for (let i = 0; i < numSimulations; i++) {
        const result = `${generateRandomLine()}\n${generateRandomLine()}\n${generateRandomLine()}\n-------------\n${generateRandomLine()}\n-------------`;
        totalGains += calculateGains(result);
    }
    return totalGains / numSimulations;
}
console.log(`Gains moyens par tour: ${simulateGains(90000000)}`);*/


function generateRandomLine() {
    const line = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * objects.length);
        line.push(objects[randomIndex].symbole);
    }
    return line.join(' • ');
}

async function kaazino(bot, interaction) {
    const gillsToSpend = Math.floor(Math.random() * (12 - 8 + 1)) + 8; // Dépense aléatoire entre 8 et 12 gills

    // Mettre à jour le solde de gills de l'utilisateur
    await updateUserGills(interaction.user, -gillsToSpend);

    // Création de l'embed initial
    let embed = new EmbedBuilder()
        .setTitle('Machine à Sous')
        .setDescription('La machine à sous tourne...')
        .setColor('#0099ff');

    // Envoyer l'embed initial
    await interaction.editReply({ content: `:slot_machine::slot_machine::slot_machine: • <@${interaction.user.id}> envoie ${gillsToSpend} :fish: pour la machine à sous..`, embeds: [embed], ephemeral: false });

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

   /* // Mise à jour de l'embed avec le résultat de la machine à sous et les gains
    embed.setDescription(`${result}\nVous avez gagné ${gains} gills !`)
        .setColor('#0099ff');*/

    // Déterminer le texte à afficher en fonction des gains
    let resultText = '';
    if (gains === 0) {
        resultText = 'et perd :otter_cry~1:';
    } else {
        resultText = 'et gagne ! :otter_pompom:';
    }

    // Mise à jour du message avec le nouvel embed
    await interaction.editReply({ content: `:slot_machine: • <@${interaction.user.id}> envoie ${gillsToSpend} :fish: pour la machine à sous... ${resultText}`, embeds: [embed], epheremal: false });

    // Mettre à jour le solde de gills de l'utilisateur avec les gains
    await updateUserGills(interaction.user, gains);
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
            gains += obj.coeff * 8; // Gain pour 2 occurrences
        } else if (count === 3) {
            gains += obj.coeff * 20; // Gain pour 3 occurrences
        }
        gain = Math.floor(gains);
    });
    //console.log("Gains: " + gains);
    return gains;
}

module.exports = kaazino;