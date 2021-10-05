const axios = require('axios')
const { MessageEmbed } = require('discord.js')

module.exports = {
  slash: true,
  description: 'สุ่มรูปหมา',
  category: 'Funny',
  callback: async () => {
    const dogURL = 'https://dog.ceo/api/breeds/image/random'

    const puppy = async () => {
      const { data } = await axios.get(dogURL)
      return data.message
    }

    const title = ''
    const image = await puppy()
    const color = 'GREEN'

    const embed = new MessageEmbed()
      .setTitle(title)
      .setColor(color)
      .setImage(image)

    return embed
  }
}
