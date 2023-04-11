const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "events",
  description: "Actions for upcoming events!",
  category: "EVENTS",
  userPermissions: [],
  command: {
    enabled: false,
    minArgsCount: 2,
    subcommands: [
      {
        trigger: "ghostping <on|off>",
        description: "detect and logs ghost mentions in your server",
      },
      {
        trigger: "spam <on|off>",
        description: "enable or disable antispam detection",
      },
      {
        trigger: "massmention <on|off> [threshold]",
        description: "enable or disable massmention detection [default threshold is 3 mentions]",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: false,
    options: [
      {
        name: "upcoming",
        description: "Get upcoming events!",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "actions",
        description: "Register/Unregister for an upcoming event!",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "configuration status",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "REGISTER",
                value: "REGISTER",
              },
              {
                name: "UNREGISTER",
                value: "UNREGISTER",
              },
            ],
          },
        ],
      },
    ],
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    const settings = data.settings;

    let response;
    if (sub == "ghostping") response = await antiGhostPing(settings, interaction.options.getString("status"));
    else if (sub == "spam") response = await antiSpam(settings, interaction.options.getString("status"));
    else if (sub === "massmention") {
      response = await antiMassMention(
        settings,
        interaction.options.getString("status"),
        interaction.options.getInteger("amount")
      );
    } else response = "Invalid command usage!";

    await interaction.followUp(response);
  },
};

async function antiGhostPing(settings, input) {
  const status = input.toUpperCase() === "ON" ? true : false;
  settings.automod.anti_ghostping = status;
  await settings.save();
  return `Configuration saved! Anti-Ghostping is now ${status ? "enabled" : "disabled"}`;
}

async function antiSpam(settings, input) {
  const status = input.toUpperCase() === "ON" ? true : false;
  settings.automod.anti_spam = status;
  await settings.save();
  return `Antispam detection is now ${status ? "enabled" : "disabled"}`;
}

async function antiMassMention(settings, input, threshold) {
  const status = input.toUpperCase() === "ON" ? true : false;
  if (!status) {
    settings.automod.anti_massmention = 0;
  } else {
    settings.automod.anti_massmention = threshold;
  }
  await settings.save();
  return `Mass mention detection is now ${status ? "enabled" : "disabled"}`;
}
