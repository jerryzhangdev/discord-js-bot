const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "eventsadmin",
  description: "Events actions for the current server",
  category: "EVENTS",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: false,
    minArgsCount: 2,
    subcommands: [
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "create",
        description: "Create an event for the server!",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "The Name of the Event",
            required: true,
            type: ApplicationCommandOptionType.String
          },
          {
            name: "starttime",
            description: "When does the event start, in UTC Timestamp?",
            required: true,
            type: ApplicationCommandOptionType.Integer
          },
          {
            name: "openslots",
            description: "How many slots are available for this event?",
            required: true,
            type: ApplicationCommandOptionType.String
          },
        ],
      },
      {
        name: "remove",
        description: "Remove an event for this server",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "The name of the event",
            required: true,
            type: ApplicationCommandOptionType.String,
          }
        ],
      },
      {
        name: "participants",
        description: "Get a list of participants for an event",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "The name of the event",
            required: true,
            type: ApplicationCommandOptionType.String,
          }
        ],
      },
    ],
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    // const settings = data.settings;

    let response;

    if(sub == "create") {
      console.log("create")
      response = "create"
    } else if(sub == "remove") {
      console.log("remove")
      response = "remove"
    } else if(sub == "participants") {
      console.log("participants")
      response = "participants"
    }

    await interaction.followUp(response);
  },
};


