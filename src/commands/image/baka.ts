import { Message } from "discord.js";
import Command from "structures/Command";
import Bot from "structures/Bot";

export default class BakaCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "baka",
      description: "None",
      category: "image",
    });
  }

  async execute(message: Message) {
    const lang = await this.bot.utils.getGuildLang(message.guild?.id);
    try {
      const data = await this.bot.neko.sfw.baka();

      const embed = this.bot.utils
        .baseEmbed(message)
        .setDescription(`${lang.IMAGE.CLICK_TO_VIEW}(${data.url})`)
        .setImage(`${data.url}`);

      message.channel.send(embed);
    } catch (err) {
      this.bot.utils.sendErrorLog(err, "error");
      return message.channel.send(lang.GLOBAL.ERROR);
    }
  }
}
