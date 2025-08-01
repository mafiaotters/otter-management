const generateWheelGif = require("@helpers/generateWheelGif");

module.exports = {
  name: "roue",
  description: "Génère une roue aléatoire avec vos choix (max 10).",
  permission: "Aucune",
  dm: false,
  category: "Fun",
  options: [
    {
      type: "STRING",
      name: "choix",
      description: "Entrez vos choix séparés par des virgules (max 10).",
      required: true,
      autocomplete: false,
    }
  ],

  async run(bot, interaction) {
    try {
      const rawInput = interaction.options.getString("choix");
      console.log("✅ rawInput via interaction.options:", rawInput);

      if (typeof rawInput !== "string") {
        return interaction.reply({
          content: "❌ Aucun choix valide reçu.",
          ephemeral: true,
        });
      }

      const labels = rawInput
        .split(",")
        .map(label => label.trim())
        .filter(label => label.length > 0);

      console.log("✅ Labels extraits :", labels);

      if (labels.length < 2 || labels.length > 10) {
        return interaction.reply({
          content: "❌ Veuillez entrer entre 2 et 10 choix séparés par des virgules.",
          ephemeral: true,
        });
      }

      await interaction.reply({ content: "🎲 Génération de la roue en cours..." });

      const wheelBuffer = await generateWheelGif(labels);

      await interaction.editReply({
        content: `🎉 Voici votre roue !`,
        files: [{ attachment: wheelBuffer.buffer, name: "roulette.gif" }],
    });

    } catch (error) {
      console.error("[/roue] ❗ Erreur complète :", error);
      const errorMsg = "❌ Une erreur est survenue lors de la génération de la roue.";
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: errorMsg, flags: 64 });
      } else {
        await interaction.editReply({ content: errorMsg });
      }
    }
  }
};
