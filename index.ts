import DiscordJS, { Intents } from 'discord.js'
import WOKCommands from 'wokcommands'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config()

const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

client.on('ready', () => {
  console.log('Bot is running')

  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    typeScript: true,
    testServers: '572050130199379977',
  })
})

client.login(process.env.DISCORD_TOKEN)
