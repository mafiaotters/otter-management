const {dateFormatLog} = require('./logTools');

const { EmbedBuilder } = require('discord.js');

/**
 * Fonction pour envoyer un message de bienvenue
 * @param {GuildMember} member Le nouveau membre qui vient de rejoindre
 */
async function welcomeMember(member) {
    try {
        console.log(await dateFormatLog() + member.displayName + " a rejoint le serveur Discord !")
        
        let channelWelcomeID = "";
        // Trouver le canal "bienvenue"
        if(process.env.GITHUB_BRANCH == "main"){ channelWelcomeID = '675910340936204288'}
        else{ channelWelcomeID = '653689680906420238' }

        const welcomeChannel = member.guild.channels.cache.get(channelWelcomeID);
        if (welcomeChannel) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Attendre 1 seconde

            // Créer l'embed
            const embed = new EmbedBuilder()
            .setColor('#c3c44f') // Couleur de l'embed
            .setAuthor({
                name: 'Loutre recruteuse.',
                iconURL: 'https://cdn.discordapp.com/emojis/747554032503226461.png' // URL de l'émoji personnalisé
            })
            .setDescription(`Hey <@${member.id}> ! Je suis la Loutre recruteuse. <:otter_love:747554032360357960> \n\n`)
            .addFields(
                { name: '🔗 Site ', value: 'Si ce n’est pas déjà fait, je t’invite à passer via le site pour en savoir plus sur nous : \n[Clique ici pour visiter le site !](https://ffxiv-lamafiadesloutres.fr) \n\nSi tu souhaites nous rejoindre, il y a des points importants à savoir !' },
                { name: '🔹 Nos conditions', value: `Nous n’acceptons pas les - de 18 ans.\nOn met un point d’honneur sur la politesse (Bonjour / Au revoir / Merci / Re et autres).` },
                { name: '🔹 Absences', value: `Si tu dois avoir une absence de quelques semaines, n’hésite pas à nous prévenir. C’est toujours mieux que de voir un membre disparaître sans nouvelles.` },
                { name: '🔹 Participation', value: `Ne te sens pas obligé de venir à tous les événements. Il y en a pour tous les jours et tous les goûts.` },
                { name: '🔹 Entraide', value: `N’hésite pas à discuter, venir en vocal et demander de l’aide ! On est là pour jouer ensemble et s’aider.` },
                { name: '🔹 Questions', value: `Si tu as des questions, les autres Loutres seront présentes pour te répondre !` }
            )
            .setThumbnail('https://cdn-longterm.mee6.xyz/plugins/commands/images/675543520425148416/0f0679eec6ed179a3dc7c3b052bea97ff3d09917d3d5dd080ac754bda26d140c.png') // Image en haut à droite
            .setImage('https://cdn-longterm.mee6.xyz/plugins/commands/images/675543520425148416/fd55e162563177b19a6b4b6ea8d703be0c33fa327581d1ac14c8fcff7072e47d.png') // Image en haut à droite


            // Envoyer l'embed
            return await welcomeChannel.send({ embeds: [embed] });
        } else {
            console.warn(`Le channel de bienvenue n'as pas été trouvé ID:${channelWelcomeID} dans ${member.guild.name}.`);
        }
    } catch (error) {
        console.error('Erreur dans welcomeMember :', error);
    }
}

module.exports = { welcomeMember };
