const { getSettings } = require("@schemas/Guild");


async function handleEvent(client) {
  let guilds = client.guilds.cache.map(g => g);
  client.logger.log("Checking if events have passed!")
  for (var i = 0; i < guilds.length; i++) {
    const settings = await getSettings(guilds[i]);
    if(settings["events"] != undefined && settings["events"].length > 0) {
      let events = settings["events"];
      let temp = [];
      for(var j = 0; j < events.length; j++) {
        if((events[j].starttime + (0*60*1000)) <= Date.now()){
          temp.push(events[j]);
        }
      }
      settings["events"] = temp;
      await settings.save();
    }
  }
}

module.exports = {
  handleEvent
}
