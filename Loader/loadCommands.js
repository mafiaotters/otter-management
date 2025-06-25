const fs = require('fs');

console.log('Chargement des commandes...')
module.exports = async (bot) => {
    // Read each .js file in the Commands folder
    fs.readdirSync("./Commands").filter(f => f.endsWith(".js")).forEach(async file => {

        let command = require(`../Commands/${file}`)

        // Check if the command has a name
        if(!command.name || typeof command.name !== "string") throw new TypeError(`Command ${file.slice(0, file.length - 3)} have no name`)

        // Skip loading if command is disabled
        if (!bot.commandEnabled(command.name)) {
            console.log(`Commande ${command.name} désactivée`)
            return
        }

        // Load the command in the bot
        bot.commands.set(command.name, command)
        console.log(`Commande ${file} chargée !`)

    })
}