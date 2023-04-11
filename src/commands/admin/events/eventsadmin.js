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
            description: "The Name of the Event(case sensitive)",
            required: true,
            type: ApplicationCommandOptionType.String
          },
          {
            name: "starttime",
            description: "When does the event start, in UTC(EPOCH) Timestamp(in seconds)?",
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
            description: "The name of the event(case sensitive)",
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
            description: "The name of the event(case sensitive)",
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
      data.settings["events"] = []
      await data.settings.save()
    }

    let response;

    if(sub == "create") {
      response = await createEvent(interaction, data.settings);
    } else if(sub == "remove") {
      response = await removeEvent(interaction, data.settings);
    } else if(sub == "participants") {
      response = await getParticipants(interaction, data.settings);
    }
    await interaction.followUp(response);
  },
};


async function createEvent(interaction, settings) {
  let events = settings["events"];
  if(events.length > 10){
    return "You can only have 10 events at a time!";
  }
  let temp = events;
  for(var i = 0; i < events.length; i++) {
    if(events[i].name == interaction.options.getString("name")) {
      return "Event already exists!";
    }
  }
  try{
    new Date(interaction.options.getInteger("starttime"));
  }catch(e){
    return "Invalid time!";
  }

  if(interaction.options.getInteger("starttime")*1000 < Date.now()) {
    return "Start time must be in the future!";
  }

  if(interaction.options.getInteger("openslots") < 0) {
    return "Invalid number of slots!";
  }

  temp.push({
    name: interaction.options.getString("name"),
    starttime: interaction.options.getInteger("starttime"),
    openslots: interaction.options.getInteger("openslots"),
    participants: []
  })

  settings["events"] = temp;
  await settings.save();

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
  await settings.save();

  return "Event removed!";
}

async function getParticipants(interaction, settings) {
  let events = settings["events"];
  let participants = [];
  for(var i = 0; i < events.length; i++) {
    if(events[i].name == interaction.options.getString("name")) {
      if(events[i].participants.length > 0){
        participants.push(events[i].participants.tag)
      }
    }
  }

  console.log(participants)

  return `The Registered Participants is: ${participants.length == 0 ? "No Participants" : participants.join(", ")}`
}