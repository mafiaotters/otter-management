const fs = require('fs');

console.log('Chargement des commandes...')
module.exports = async (bot) => {
    // Read each .js file in the Commands folder
    fs.readdirSync("./Commands").filter(f => f.endsWith(".js")).forEach(async file => {

        let command = require(`../Commands/${file}`)
        // Check if the command has a name
        if(!command.data.name || typeof command.data.name !== "string") throw new TypeError(`Command ${file.slice(0, file.length - 3)} have no name`)
            //Load the command in the bot
            bot.commands.set(command.data.name, command)
            console.log(`Commande + ${file} + chargée !`)
        
    })
}