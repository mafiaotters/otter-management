const { dateFormatLog } = require('./logTools');

async function verifyWord(message, bot) {
    const feurSentences = [
        "Feur !",
        "FEUUUURRRR ! <:otter_dark:855011968515440660>",
        "Feur… toujours feur. <:otter_gotcha:883792001148006400>",
        "Et Feur !",
        "Feur. C'est devenu tellement simple.. <:otter_glasses:747554032574398485>",
        "Encore un Feur, bravo champion ! _Nullos_",
        "Oh, tu sais quoi ? FEUR <:otter_mdr:747554032494837772>",
        "Feur, mais avec classe. <:otter_glasses:747554032574398485>",
        "Tu pensais vraiment l’éviter ? Feur.",
    ];

    // Expressions régulières pour "feur"
    const feur1 = /\bquoi[\s\.,!?]*$/i;
    const feur2 = /\bkoi[\s\.,!?]*$/i;
    const feur3 = /\bqoi[\s\.,!?]*$/i;

    // Expressions régulières pour "c'est qui"
    const cki1 = /\bc['’]est qui[\s\.,!?]*$/i;
    const cki2 = /\bc ki[\s\.,!?]*$/i;
    const cki3 = /\bc['’]est ki[\s\.,!?]*$/i;

    // Vérification pour "feur"
    if (feur1.test(message.content) || feur2.test(message.content) || feur3.test(message.content)) {
        // Générer une probabilité
        const chance = Math.random();
        console.log(`Chance (feur): ${chance}`);

        if (chance <= 0.50) { //50%
            const randomFeurSentences = feurSentences[Math.floor(Math.random() * feurSentences.length)];
            await message.reply(randomFeurSentences);
            return console.log(`${await dateFormatLog()} Un Feur a été prononcé dans ${message.channel.name}`);
        }
    }

    // Vérification pour "c'est qui"
    if (cki1.test(message.content) || cki2.test(message.content) || cki3.test(message.content)) {
        // Générer une probabilité
        const chance = Math.random();

        if (chance <= 0.10) { //10% de chance
            await message.reply("C'est Keen'v !");
            return console.log(`${await dateFormatLog()} Un "C'est Keen'v" a été prononcé dans ${message.channel.name}`);
        }
    }
}

module.exports = verifyWord;
