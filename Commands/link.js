const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Lier votre lodestone à Discord !')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('Votre ID lodestone')
                .setRequired(true)),
                
    async execute(interaction) {
        const lodestoneId = interaction.options.getString('id');
        const discordId = interaction.user.id;

        let command;
        console.log(interaction.options.getString("id"))

        if(interaction.options.getString("id")) {
            command = bot.commands.get(interaction.options.getString("id"));
            if(!command) return interaction.reply("Veuillez rentrer votre ID");
    }
    

    // If don't put ID
    if(!command) {
        return interaction.reply("Veuillez rentrer votre ID");
        // If user define a command
        } else {
            console.log('Lodestone ID en vérification:' + interaction.options.getString("ID"))
            const docRef = db.collection('profiles').doc(discordId);
            await docRef.set({ lodestoneId });
            await interaction.reply(`Votre ID Discord est maintenant lié à votre ID lodestone: ${lodestoneId}`);
            
        }

    }
};






/*
const { SlashCommandBuilder } = require('@discordjs/builders');

const db = require('../Loader/loadDatabase');  // Assurez-vous d'importer la fonction de votre module database

module.exports = {
    name: "link",
    description: "Lier votre lodestone à Discord!",
    permission: "Aucune",
    dm: true,
    category: "User",
    options: [
        {
            type: "STRING",
            name: "ID",
            description: "Votre ID lodestone",
            required: true,
            autocomplete: false,
        }
    ],
    
    
    
    async run(bot, interaction, args) {

        const lodestoneId = interaction.options.getString('ID');
        const discordId = interaction.user.id;

        let command;
        console.log('Lodestone ID en vérification:' + interaction.options.getString("ID"))

        //VOIR POUR VERIFIER LA VALIDITE DU LODESTONE ID

        if(interaction.options.getString("ID")) {
            command = bot.commands.get(interaction.options.getString("ID"));
            if(!command) return interaction.reply("ID Lodestone invalide");
    }

    // If don't put ID. 
    if(!command) {
        return interaction.reply("Entrez votre Lodestone ID")
    }

        // Utilisez la base de données Firestore pour lier le profil
        const docRef = db.collection('profiles').doc(discordId);
        await docRef.set({ lodestoneId });

        await interaction.reply(`Votre ID Discord est maintenant lié à votre ID lodestone: ${lodestoneId}`);
    },
};*/
