const db = require('../Loader/loadDatabase'); 
const updateUserGills = require('./updateUserGills');
const { EmbedBuilder } = require('discord.js');

const { dateFormatLog } = require('../Helpers/logTools');

const objects = [
    { symbole: '🍓', coeff: 10, weight: 25 }, // Très fréquent
    { symbole: '🍪', coeff: 40, weight: 8 },  // Rare
    { symbole: '🍑', coeff: 18, weight: 23 }, // Fréquent
    { symbole: '🍉', coeff: 13, weight: 25 }, // Très fréquent
    { symbole: '🍒', coeff: 35, weight: 10 }, // Moyennement rare
    { symbole: '🍌', coeff: 30, weight: 15 }, // Moyennement fréquent
    { symbole: '🍐', coeff: 20, weight: 12 }, // Moyennement fréquent
    { symbole: '🐟', coeff: 65, weight: 5 },  // Très rare
];


function generateRandomLine() {
    const weightedObjects = [];
    objects.forEach(obj => {
        for (let i = 0; i < obj.weight; i++) {
            weightedObjects.push(obj.symbole);
        }
    });
    const line = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * weightedObjects.length);
        line.push(weightedObjects[randomIndex]);
    }
    return line.join(' • ');
}



async function kaazino(bot, interaction) {

    const userRef = db.collection('gillSystem').doc(interaction.user.id);
    const doc = await userRef.get();

    if (!doc.exists) {
        return await interaction.editReply({ content: 'Tu n\'as pas encore de compte GillSystem. Utilisez la commande `/collecte` pour avoir tes premiers gills !', ephemeral: true });
    }    
    const lastPlayedKaazinoData = doc.data() ? doc.data().lastPlayedKaazino : undefined;
    const lastPlayedKaazino = lastPlayedKaazinoData ? lastPlayedKaazinoData.toDate() : new Date().setFullYear(1970);
    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000); // 10 minutes en millisecondes

    if (lastPlayedKaazino && lastPlayedKaazino > tenMinutesAgo) {
        // L'utilisateur a déjà joué dans les 10 dernières minutes
        return await interaction.editReply({ content: "Vous avez déjà joué à la machine à sous dans les 10 dernières minutes. Revenez plus tard !", ephemeral: true });
    }

    const gillsToSpend = Math.floor(Math.random() * (12 - 8 + 1)) + 8; // Dépense aléatoire entre 8 et 12 gills
    if(doc.data().gills < gillsToSpend) {
        return await interaction.editReply({ content: `Tu n'as pas assez de gills pour la machine à sous, SALE PAUVRE TOCARD`, ephemeral: true });
    }

        // L'utilisateur peut jouer à la machine à sous
    // Redéfinir la date à maintenant, pour éviter des spams.
    await userRef.update({ lastPlayedKaazino: new Date() });

    
    // Si les messages de vérification sont faits, on sait que la suite est un "succès"
    await interaction.deleteReply();

    // Mettre à jour le solde de gills de l'utilisateur
    await updateUserGills(interaction.user, Math.floor(gillsToSpend) * -1);

    // Création de l'embed initial
    let embed = new EmbedBuilder()
        .setTitle('Machine à Sous')
        .setDescription('La machine à sous tourne...')
        .setColor('#003aff');

    // Envoyer l'embed initial
    const message = await interaction.channel.send({ content: `:slot_machine: • <@${interaction.user.id}> envoie ${gillsToSpend} :fish: pour la machine à sous..`, embeds: [embed], ephemeral: false });

    // Simuler le temps de rotation de la machine à sous 3 fois
    for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre 1 seconde
        const currentResult = `${generateRandomLine()}\n${generateRandomLine()}\n${generateRandomLine()}`;
        embed.setDescription(`\n${currentResult}`);
        await message.edit({ embeds: [embed] });
    }

    // Générer le dernier embed de la machine à sous
    const result = `${generateRandomLine()}\n${generateRandomLine()}\n${generateRandomLine()}\n-------------\n${generateRandomLine()}\n-------------`;

    // Calculer les gains en utilisant les coefficients
    // Appeler calculateGains
    const { actualGains: gains, potentialGains } = calculateGains(result);

    // Mise à jour de l'embed avec le résultat de la machine à sous et les gains
    embed.setDescription(`${result}`)

    // Déterminer le texte à afficher en fonction des gains
    let resultText = '';
    if (gains === 0) {
        resultText = 'et perd <:otter_cry_1:883792001202532372>';
        embed.setColor('#a40303');
    } else if (gains === 1) { //La valeur des gains potentiels : ${Math.floor(potentialGains)}
        resultText = `et n'était pas loin de gagner ! <:otter_afraid:747554031349661836>`;
        embed.setColor('#f5a623');
    } else {
        resultText = `et gagne **${Math.floor(gains)} :fish:** ! <:otter_pompom:747554032582787163> <:tada:> <:otter_pompom:747554032582787163>`;
        embed.setColor('#28a403');
        if(gains >= 150){ 
            await interaction.channel.send({ content: `<@${interaction.user.id}> OMG !!`, ephemeral: false });
        }
    }

    // Mise à jour du message avec le nouvel embed
    await message.edit({ content: `:slot_machine: • <@${interaction.user.id}> envoie ${gillsToSpend} :fish: pour la machine à sous... ${resultText}`, embeds: [embed], epheremal: false });

    if(gains <= 1) { //Si le joueur n'as pas gagné (gains 0 = rien ; = presque ! ; + = gagné)
        return
    }
    // Mettre à jour le solde de gills de l'utilisateur avec les gains
    await updateUserGills(interaction.user, Math.floor(gains));
}

function calculateGains(result) {
    let gains = 0;
    let potentialGains = 0; // Gains potentiels si une troisième occurrence est ajoutée
    const lines = result.split('\n');
    const lastLine = lines[lines.length - 2]; // Prendre uniquement l'avant-dernière ligne, soit la dernière ligne avec symbole

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
            gains = 1; // Indique qu'il a presque gagné
            potentialGains += obj.coeff * 5; // Calcul des gains si une troisième occurrence est ajoutée
        }
        if (count === 3) {
            gains += obj.coeff * 5.2; // Gain pour 3 occurrences
        }
    });

    return { actualGains: Math.floor(gains), potentialGains }; // Retourne les gains réels et les gains potentiels
}


module.exports = { kaazino, analyzeGame, calculateAverageGainsByEmoji, simulateGains}

/* 
=================================
        ANALYSE DU JEU
Faire les appels via bot.js
=================================
*/
function analyzeGame(numSimulations) {
    const symbolOccurrences = {};
    let wins = 0; // Victoires (3 occurrences ou plus)
    let nearWins = 0; // Quasi-victoires (2 occurrences)
    let totalGains = 0;

    // Initialisation des symboles
    objects.forEach(obj => {
        symbolOccurrences[obj.symbole] = 0;
    });

    console.warn('=============== \nANALYSE KAAZINO...   \n ===============')

    for (let i = 0; i < numSimulations; i++) {
        const result = `${generateRandomLine()}\n${generateRandomLine()}\n${generateRandomLine()}\n-------------\n${generateRandomLine()}\n-------------`;
        const { actualGains: gains } = calculateGains(result);

        // Comptage des victoires et des quasi-victoires
        if (gains > 1) wins++;
        if (gains === 1) nearWins++;

        totalGains += gains;

        // Compter les occurrences de chaque symbole
        const lines = result.split('\n');
        const lastLine = lines[lines.length - 2]; // Prendre la dernière ligne valide
        objects.forEach(obj => {
            const count = (lastLine.match(new RegExp(obj.symbole, 'g')) || []).length;
            symbolOccurrences[obj.symbole] += count;
        });
    }

    // Résultats
    const winRate = (wins / numSimulations) * 100;
    const nearWinRate = (nearWins / numSimulations) * 100;
    const averageGain = totalGains / numSimulations;

    console.log("winRate (3 occurences): " + Math.floor(winRate) + "%")
    console.log("nearWinRate (2 occurences): " + Math.floor(nearWinRate) + "%")
    console.log("Gain moyen par tour " + Math.floor(averageGain))
    console.warn("=============== \n   FIN ANALYSE KAAZINO   \n ===============")

    return {
        winRate, // Pourcentage de chance de gagner (3 occurrences)
        nearWinRate, // Pourcentage de quasi-victoire (2 occurrences)
        averageGain,
        symbolOccurrences,
    };
}

// FONCTION DE DEVELOPPEMENT SIMULATEGAINS - Permet de voir le gain par tentative, lissé.
async function simulateGains(numSimulations) {
    console.warn(await dateFormatLog() + "[DEV] Simulation des gains en cours...");
    let totalGains = 0;
    for (let i = 0; i < numSimulations; i++) {
        const result = `${generateRandomLine()}\n${generateRandomLine()}\n${generateRandomLine()}\n-------------\n${generateRandomLine()}\n-------------`;
        const { actualGains: gains, potentialGains } = calculateGains(result);
        totalGains += gains;
    }
    return totalGains / numSimulations;
}

async function calculateAverageGainsByEmoji(numSimulations = 100000) {
    const emojiGains = {}; // Stocke les gains totaux pour chaque émoji
    const emojiOccurrences = {}; // Stocke les occurrences où chaque émoji a contribué à un gain

    // Initialiser les compteurs
    objects.forEach(obj => {
        emojiGains[obj.symbole] = 0;
        emojiOccurrences[obj.symbole] = 0;
    });

    for (let i = 0; i < numSimulations; i++) {
        const result = `${generateRandomLine()}\n${generateRandomLine()}\n${generateRandomLine()}\n-------------\n${generateRandomLine()}\n-------------`;

        const { actualGains } = calculateGains(result);

        if (actualGains > 0) {
            const lines = result.split('\n');
            const lastLine = lines[lines.length - 2]; // Prendre uniquement la ligne gagnante
            objects.forEach(obj => {
                const count = (lastLine.match(new RegExp(obj.symbole, 'g')) || []).length;
                if (count >= 3) {
                    emojiGains[obj.symbole] += actualGains;
                    emojiOccurrences[obj.symbole] += 1;
                }
            });
        }
    }

    // Calculer le gain moyen par émoji
    const averageGains = {};
    objects.forEach(obj => {
        averageGains[obj.symbole] = emojiOccurrences[obj.symbole] > 0
            ? emojiGains[obj.symbole] / emojiOccurrences[obj.symbole]
            : 0; // Si jamais l'émoji n'a jamais contribué à un gain
    });

    return { averageGains, emojiOccurrences };
}