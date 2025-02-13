import { Message } from "discord.js";
import Command from "structures/Command";
import Bot from "structures/Bot";

export default class FeedCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "feed",
      description: "feed somebody",
      category: "image",
    });
  }

  async execute(message: Message) {
    const lang = await this.bot.utils.getGuildLang(message.guild?.id);
    try {
      const data = await this.bot.neko.sfw.feed();

      const user = message.mentions.users.first() || message.author;
      const feeding = message.author.id === user.id ? "themselves" : user.username;

      const embed = this.bot.utils
        .baseEmbed(message)
        .setTitle(`${message.author.username} ${lang.IMAGE.FEEDED} ${feeding}`)
        .setDescription(`${lang.IMAGE.CLICK_TO_VIEW}(${data.url})`)
        .setImage(`${data.url}`);

      message.channel.send(embed);
    } catch (err) {
      this.bot.utils.sendErrorLog(err, "error");
      return message.channel.send(lang.GLOBAL.ERROR);
    }
  }
}
