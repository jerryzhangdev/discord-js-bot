const { getSettings } = require("@schemas/Guild");


async function handleEvent(client) {
  let guilds = client.guilds.cache.map(g => g.id);

  for (var i = 0; i < guilds.length; i++) {
    const settings = await getSettings(guilds[i]);
    console.log(settings)
  }
}

module.exports = {
  handleEvent
}
