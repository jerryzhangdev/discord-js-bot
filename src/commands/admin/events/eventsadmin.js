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
            type: ApplicationCommandOptionType.Integer
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
    const settings = data.settings;

    if(settings["events"] == undefined) {
      settings["events"] = []
    }

    let response;

    if(sub == "create") {
      response = createEvent(interaction, settings);
    } else if(sub == "remove") {
      response = removeEvent(interaction, settings);
    } else if(sub == "participants") {
      console.log("participants")
      response = "participants"
    }
    console.log(settings["events"])
    await interaction.followUp(response);
  },
};


async function createEvent(interaction, settings) {
  let events = settings["events"];
  let temp = events;
  for(var i = 0; i < events.length; i++) {
    if(events[i].name == interaction.options.getString("name")) {
      return "Event already exists!";
    }
  }

  temp.push({
    name: interaction.options.getString("name"),
    starttime: interaction.options.getInteger("starttime"),
    openslots: interaction.options.getInteger("openslots"),
    participants: []
  })

  settings["events"] = temp;

  return "Event created!";

}

async function removeEvent(interaction, settings) {
  let events = settings["events"];
  let temp = [];
  let exists = false;
  for(var i = 0; i < events.length; i++) {
    if(events[i].name != interaction.options.getString("name")) {
      temp.push(events[i])
    }else{
      exists = true;
    }
  }

  if(exists == false) {
    return "Event does not exist!";
  }

  settings["events"] = temp;

  return "Event removed!";
}