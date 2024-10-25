const updateUserGills = require('./updateUserGills');
const { EmbedBuilder } = require('discord.js');

const objects = [
    {symbole: '🍓', coeff: 1}, 
    {symbole:'🍪', coeff: 1}, 
    {symbole:'🍑', coeff: 1},
    {symbole: '🍉', coeff: 1}, 
    {symbole:'🍒', coeff: 1}, 
    {symbole:'🍌', coeff: 1}, 
    {symbole:'🍐', coeff: 1},
    {symbole: '🐟', coeff : 1}
];

function generateRandomLine() {
    const line = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * objects.length);
        line.push(objects[randomIndex].symbole);
    }
    return line.join(' • ');
}

async function casino(bot, interaction) {
    const gillsToSpend = Math.floor(Math.random() * (12 - 8 + 1)) + 8; // Dépense aléatoire entre 8 et 12 gills

    // Mettre à jour le solde de gills de l'utilisateur
    await updateUserGills(interaction.user, -gillsToSpend);

    // Création de l'embed initial
    let embed = new EmbedBuilder()
        .setTitle('Machine à Sous')
        .setDescription('La machine à sous tourne...')
        .setColor('#0099ff');

    // Envoyer l'embed initial
    await interaction.editReply({ embeds: [embed], ephemeral: false });

    // Simuler le temps de rotation de la machine à sous 3 fois
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
        const currentResult = `${generateRandomLine()}\n${generateRandomLine()}\n${generateRandomLine()}`;
        embed.setDescription(`\n${currentResult}`);
        await interaction.editReply({ embeds: [embed] });
    }

    // Générer les résultats de la machine à sous
    const result = `${generateRandomLine()}\n${generateRandomLine()}\n${generateRandomLine()}\n-------------\n${generateRandomLine()}\n-------------`;

    // Calculer les gains en utilisant les coefficients
    const gains = calculateGains(result);

    // Mise à jour de l'embed avec le résultat de la machine à sous et les gains
    embed.setDescription(`${result}\nVous avez gagné ${gains} gills !`)
        .setColor('#0099ff');

    // Mise à jour du message avec le nouvel embed
    await interaction.editReply({ embeds: [embed] });

    // Mettre à jour le solde de gills de l'utilisateur avec les gains
    await updateUserGills(interaction.user, gains);
}

function calculateGains(result) {
    let gains = 0;
    const lines = result.split('\n');
    const lastLine = lines[lines.length - 2]; // Prendre uniquement l'avant dernière ligne, soit la dernière ligne avec symbole

    console.log("Dernière ligne:", lastLine);

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
            gains += obj.coeff + 2; // Gain pour 2 occurrences
        } else if (count === 3) {
            gains += obj.coeff + 3; // Gain pour 3 occurrences
        }
    });
    console.log("Gains: " + gains);
    return gains;
}

module.exports = casino;