const db = require('@loader/loadDatabase'); 
const updateFunction = require('@websiteUtils/updateFunction');
const { EmbedBuilder } = require('discord.js');


const lastUsed = {};

module.exports = {
    name: "update",
    description: "Mise à jour du site web des loutres.",
    permission: "Aucune",
    dm: true,
    category: "User",


    async run(bot, interaction, args) {
        const userId = interaction.user.id;
        const timestamp = new Date().getTime();
        const cooldownPeriod = 300000; // Délai en millisecondes, ici 60*5 (300) secondes

        try{ 
            if (!interaction.deferred && !interaction.replied) {
                await interaction.deferReply({ ephemeral: true });
            }
    
        // Vérifie si l'utilisateur a déjà utilisé la commande récemment
        if (lastUsed[userId] && timestamp - lastUsed[userId] < cooldownPeriod) {
            const timeLeft = ((cooldownPeriod - (timestamp - lastUsed[userId])) / 1000).toFixed(0);
            return interaction.followUp({ content: `Veuillez attendre encore ${timeLeft} secondes avant de réutiliser cette commande.`, ephemeral: true });
        }
    
        // Met à jour le timestamp de la dernière utilisation pour cet utilisateur
        lastUsed[userId] = timestamp;

        // Liste des ID des utilisateurs autorisés
        const allowedUsers = bot.settings.commands.allowedUsers; // Jungso, Sefa, Kaaz, compte test sefa
        const isAllowedUser = allowedUsers.includes(interaction.user.id);
    
        // Vérifie l'autorisation d'executer la commande
        if (!isAllowedUser) {
            // Si l'utilisateur n'est ni admin ni dans la liste, on refuse l'exécution de la commande
            return interaction.followUp({ content: "Vous n'avez pas la permission d'utiliser cette commande.", ephemeral: true });
        }

        console.log(` Mise à jour du site web...`);

        let modifications = []
        modifications = await updateFunction(bot, interaction);

        await interaction.deleteReply();
        await interaction.channel.send({ embeds: [await makeEmbed(modifications, interaction)] })

    } catch (error) { 
        console.error("Erreur lors de la mise à jour du site web:", error);
        if (!interaction.deferred && !interaction.replied) {
            await interaction.followUp({ content: "Une erreur est survenue.", ephemeral: true });
          }
    }
}
}

async function makeEmbed(modifications, interaction) {
    const embed = new EmbedBuilder()
        .setTitle('📋 Modifications des rôles par ' + interaction.user.displayName)
        .setDescription('Voici les changements détectés lors de cette mise à jour.')
        .setColor('#0099ff')
        .setTimestamp();

    if (modifications.length === 0) {
        embed.addFields({
            name: 'Aucun changement',
            value: 'Aucun changement de rôle détecté.',
        });
    } else {
        modifications.forEach(mod => {
            if (mod.action === 'Role Updated' && mod.role) {
                embed.addFields({
                    name: `👤 ${mod.user || 'Utilisateur inconnu'}`,
                    value: `Nouveau rôle -> **${mod.role}**`,
                });
            } else if (mod.action === 'Error' && mod.error) {
                embed.addFields({
                    name: `❌ ${mod.user || 'Utilisateur inconnu'}`,
                    value: `Erreur -> ${mod.error}`,
                });
            } else {
                embed.addFields({
                    name: `⚠️ ${mod.user || 'Utilisateur inconnu'}`,
                    value: 'Action inconnue',
                });
            }
        });
    }

    return embed;
}
