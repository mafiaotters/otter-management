const {dateFormatLog} = require('./logTools');

async function verifyFeur(message, bot) {

    const feurSentences = [
        "Feur !",
        "FEUUUURRRR ! <:otter_dark:855011968515440660>",
        "Feur… toujours feur. <:otter_gotcha:883792001148006400>",
        "Et Feur !",
        "Feur. C'est devenu tellement simple.. <:otter_glasses:747554032574398485>",
        "Encore un Feur, bravo champion ! _Nullos_",
        "Oh, tu sais quoi ? FEUR <:otter_mdr:747554032494837772>",
        "Feur, mais avec classe. <:otter_glasses:747554032574398485>",
        "Tu pensais vraiment l’éviter ? Feur. ",
    ];
 
 // Expression régulière pour détecter "quoi" à la fin d'une phrase
    const regex1 = /\bquoi[\s\.,!?]*$/i;
    const regex2 = /\bkoi[\s\.,!?]*$/i;
    const regex3 = /\bqoi[\s\.,!?]*$/i;

    // Tester si le message correspond
    if (regex1.test(message.content) || regex2.test(message.content) || regex3.test(message.content) ) {
        
        // Générer une probabilité
        const chance = Math.random(); // Nombre entre 0 et 1
        console.log(chance)
        if (chance <= 0.50) { // Répondre seulement si la probabilité est inférieure ou égale à 50 %

        // Répondre si le message se termine par "quoi"
        const randomFeurSentences = feurSentences[Math.floor(Math.random() * feurSentences.length)];
        await message.reply(randomFeurSentences);
        return console.log(`${await dateFormatLog()}Un Feur a été prononcé dans ${message.channel.name}`)
        }
    }
}

module.exports = verifyFeur;