const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config.js");

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
            name: "name",
            description: "Name of the event(case sensitive)",
            required: true,
            type: ApplicationCommandOptionType.String
          },
          {
            name: "action",
            description: "True to register, false to unregister",
            required: true,
            type: ApplicationCommandOptionType.Boolean
          },
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

    if(sub == "upcoming") {
      const events = data.settings["events"]
      if(events.length == 0) {
        return interaction.followUp({ content: "There are no upcoming events!", ephemeral: true })
      }

      const embed = new EmbedBuilder()
        .setTitle("Upcoming Events")
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setDescription("Here are the upcoming events for this server!");

      events.forEach(event => {
        embed.addFields({ name: event.name, value: `Starts at: <t:${event.starttime}>\nSlots Left: ${event.openslots - event.participants.length}` })
      })

      return interaction.followUp({ embeds: [embed] })
    }else if(sub == "actions"){
      let name = interaction.options.getString("name")
      let action = interaction.options.getBoolean("action")
      let response = await handleAction(name, action, interaction, data.settings);
      await interaction.followUp(response);
    }

  },
};

async function handleAction(name, action, interaction,  settings) {
  let event = settings["events"];
  if(action == true){
    // loops through events
    for(let i = 0; i < event.length; i++){
      // checks if event name matches
      if(event[i]["name"] == name){
        let participants = event[i]["participants"]
        if(event[i]["participants"].length >= event[i]["openslots"]){
          return "This event is full!"
        }
        for(let j = 0; j < participants.length; j++){
          if(participants[j] == interaction.user.id){
            return "You are already registered for this event!"
          }
        }
        event[i]["participants"].push(interaction.user.id)

      }
    }
    await settings.save()

    let embed = new EmbedBuilder()
      .setTitle("Event Registration Confirmation")
      .setColor(EMBED_COLORS.BOT_EMBED)
      .setDescription(`You have been registered for the event: ${name}! \n\n\nDepending on the event, you may receive dms from the organizer prior to the event, which may include instructions for joining the event.\n\nIf you can receive this message, you can receive dms from the event organizer. Please change your privacy settings if you do not want to receive dms from the organizer.`)
      
  
    try{
      await interaction.user.send({ embeds: [embed] })
      return "You have now been registered for this event!"
    }catch(e){
      return "You have been registered for this event, but you have dms disabled. Please allow me to dm you(check your server privacy settings) as the event organizers may provide instructions to join the event through your dms."
    }
  }else{
    for(let i = 0; i < event.length; i++){
      if(event[i]["name"] == name){
        let temp = [];
        for(let j = 0; j < event[i]["participants"].length; j++){
          if(event[i]["participants"][j] != interaction.user.id){
            temp.push(event[i]["participants"][j])
          }
        }
        event[i]["participants"] = temp;
      }
    }
    await settings.save()
    return "You have now been unregistered for this event!"
  }
}