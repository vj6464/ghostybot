import { Message } from "discord.js";
import Command from "structures/Command";
import Bot from "structures/Bot";

export default class IqCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "iq",
      description: "Get a random Iq returned",
      category: "games",
    });
  }

  async execute(message: Message) {
    const lang = await this.bot.utils.getGuildLang(message.guild?.id);
    try {
      const iq = Math.floor(Math.random() * 100) + 1;

      const embed = this.bot.utils
        .baseEmbed(message)
        .setTitle(lang.GAMES.IQ_TEST)
        .setDescription(lang.GAMES.IQ_IS.replace("{iq}", `${iq}`));

      message.channel.send(embed);
    } catch (err) {
      this.bot.utils.sendErrorLog(err, "error");
      return message.channel.send(lang.GLOBAL.ERROR);
    }
  }
}
