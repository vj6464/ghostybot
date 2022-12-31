import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { Event } from "structures/Event";

export default class GuildMemberRoleAddEvent extends Event {
  constructor(bot: Bot) {
    super(bot, "guildMemberRoleAdd");
  }

  async execute(bot: Bot, member: DJS.GuildMember, role: DJS.Role) {
    try {
      if (!member.guild) return;
      if (!member.guild.available) return;

      const webhook = await bot.utils.getWebhook(member.guild);
      if (!webhook) return;

      const embed = bot.utils
        .baseEmbed({ author: bot.user })
        .setTimestamp()
        .setColor(DJS.Colors.Green)
        .setTitle("Member Update: `Role Add`")
        .setDescription(`${member} was **given** the ${role} role.`);

      await webhook.send({ embeds: [embed] });
    } catch (err) {
      bot.utils.sendErrorLog(err, "error");
    }
  }
}
