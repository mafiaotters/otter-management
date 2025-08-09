const Discord = require('discord.js');
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

module.exports = async bot => {

    let commands = [];

    //For each loaded command
    bot.commands.forEach(async command => {

        if (!bot.commandEnabled(command.name)) {
            console.log(`Slash commande ${command.name} ignorée (désactivée)`)
            return
        }

        let slashCommand;

        if(command.type === "MESSAGE" || command.type === "USER") {
            slashCommand = new Discord.ContextMenuCommandBuilder()
            .setName(command.name)
            .setType(command.type === "MESSAGE" ? Discord.ApplicationCommandType.Message : Discord.ApplicationCommandType.User)
            .setDMPermission(command.dm)
            .setDefaultMemberPermissions(command.permission === "Aucune" ? null : command.permission)
        }
        else{
            slashCommand = new Discord.SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description)
            .setDMPermission(command.dm)
            // Put permission "Aucune" if no permission is given.
            .setDefaultMemberPermissions(command.permission === "Aucune" ? null : command.permission)

            // Si on a des options.
            if(command.options?.length >= 1) {
                for(let i = 0; i < command.options.length; i++) {

                    if(command.options[i].type === "SUB_COMMAND") {
                        slashCommand.addSubcommand(subcommand =>
                            subcommand.setName(command.options[i].name)
                            .setDescription(command.options[i].description)
                            // Ici, vous pouvez ajouter des options spécifiques à la sous-commande si nécessaire
                        )
                    }
                    //If it's a string, add command
                     else if(command.options[i].type === "STRING") {
                        slashCommand[`add${command.options[i].type.charAt(0).toUpperCase()
                            + command.options[i].type.slice(1).toLowerCase()}Option`]
                        (optionBuilder =>
                        optionBuilder.setName(command.options[i].name)
                        .setDescription(command.options[i].description)
                        .setAutocomplete(command.options[i].autocomplete)
                        .setRequired(command.options[i].required))
                    }
                    else{
                    // Put in the format capital letter for first caracter. Then put name, description and required.
                    slashCommand[`add${command.options[i].type.charAt(0).toUpperCase()
                        + command.options[i].type.slice(1).toLowerCase()}Option`]
                    (optionBuilder =>
                    optionBuilder.setName(command.options[i].name)
                    .setDescription(command.options[i].description)
                    .setRequired(command.options[i].required))
                    }

                }
            }
        }
        await commands.push(slashCommand);
    })
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    await rest.put(Routes.applicationCommands(bot.user.id), { body: commands })
    console.log(`Commande slash envoyée au serveur Discord.`);
}