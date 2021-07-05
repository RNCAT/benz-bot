require('dotenv').config()

const Discord = require('discord.js')
const { Player } = require('discord-player')
const ytdl = require('ytdl-core-discord')
const WOKCommands = require('wokcommands')
const fs = require('fs')
const { env, presence } = require('./config')

const client = new Discord.Client()
client.player = new Player(client)

client.player.on('trackStart', (queue, track) => {
  queue.metadata.send(`🎶 | พี่เบนซ์กำลังเปิดเพลง: **${track.title}** !`)
})

client.player.on('channelEmpty', (queue) => {
  queue.metadata.send('❌ | ไม่มีคนอยู่ในห้อง พี่เบนซ์ไปแล้วงั้น...')
})

client.player.on('queueEnd', (queue) => {
  queue.metadata.send('✅ | พี่เบนซ์เปิดเพลงให้หมดแล้ว !')
})

client.on('ready', async () => {
  new WOKCommands(client, {
    commandsDir: 'commands',
    showWarns: false,
  })

  client.user.setPresence(presence)
})

client.on('voiceStateUpdate', async (oldMember, newMember) => {
  const opening = fs.readFileSync('./opening.json', 'utf-8')
  let openingData = JSON.parse(opening)
  const memberSong = openingData[`${newMember.member.id}`]

  let newUserChannel = newMember.channel
  let oldUserChannel = oldMember.channel

  if (oldUserChannel === null && newUserChannel !== null) {
    console.log(
      `${newMember.member.displayName} has joined  ${newUserChannel.guild.name} (${newUserChannel.name})`
    )
    if (memberSong) {
      const connection = await newUserChannel.join()
      const stream = ytdl(memberSong, {
        quality: 'highestaudio',
        opusEncoded: true,
      })
      const dispatcher = connection.play(await stream, {
        type: 'opus',
      })

      dispatcher.on('finish', () => {
        connection.disconnect()
      })
    }
  } else if (newUserChannel === null) {
    console.log(
      `${oldMember.member.displayName} has left ${oldUserChannel.guild.name} (${oldUserChannel.name})`
    )
  }
})

client.login(env.DISCORD_TOKEN)
