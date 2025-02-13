import { Message } from "discord.js";
import Command from "structures/Command";
import Bot from "structures/Bot";

export default class LeaveGuildCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "leaveguild",
      description: "Leaves a guild by the provided Id",
      category: "botowner",
      ownerOnly: true,
    });
  }

  async execute(message: Message, args: string[]) {
    const lang = await this.bot.utils.getGuildLang(message.guild?.id);

    const guildId = args[0];

    if (!guildId) {
      return message.channel.send("Please provide an id");
    }

    const guild = this.bot.guilds.cache.find((g) => g.id === guildId);

    if (!guild) {
      return message.channel.send(lang.GUILD.NOT_FOUND);
    }

    try {
      await guild.leave();
      message.channel.send(lang.GUILD.LEFT.replace("{guild_name}", guild.name));
    } catch (e) {
      this.bot.utils.sendErrorLog(e, "error");
      return message.channel.send(lang.GLOBAL.ERROR);
    }
  }
}
