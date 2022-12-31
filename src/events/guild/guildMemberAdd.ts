import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { Event } from "structures/Event";

export default class GuildMemberAddEvent extends Event {
  constructor(bot: Bot) {
    super(bot, "guildMemberAdd");
  }

  async execute(bot: Bot, member: DJS.GuildMember) {
    try {
      if (!member.guild) return;
      if (!member.guild.available) return;
      const guild = await bot.utils.getGuildById(member.guild.id);
      const welcomeData = guild?.welcome_data;
      if (!welcomeData?.enabled) return;

      const message =
        welcomeData.message ||
        `**Username:** {user.username}
      **Tag:** {user.tag}
      **Id:** {user.id}
      `;

      if (welcomeData.ignore_bots && member.user.bot) return;

      if (welcomeData.channel_id) {
        if (!member.guild.channels.cache.find((ch) => ch.id === welcomeData.channel_id)) return;

        const avatar = member.user.displayAvatarURL();

        const embed = bot.utils
          .baseEmbed({ author: member.user })
          .setTitle(`Welcome to **${member.guild.name}**`)
          .setThumbnail(avatar)
          .setDescription(
            bot.utils.parseMessage(message, member.user, {
              author: member.user,
              guild: member.guild,
            }),
          );

        const ch = bot.channels.cache.get(welcomeData.channel_id);
        if (!ch || !ch.isTextBased()) return;

        const hasSendMessagePerms = (ch as DJS.TextChannel)
          .permissionsFor(bot.user!)
          ?.has(DJS.PermissionFlagsBits.SendMessages);
        if (!hasSendMessagePerms) return;

        ch.send({ embeds: [embed] });
      }

      const me = bot.utils.getMe(member);
      if (
        !member.pending &&
        welcomeData.role_id &&
        me?.permissions.has(DJS.PermissionFlagsBits.ManageRoles)
      ) {
        member.roles.add(welcomeData.role_id);
      }
    } catch (err) {
      bot.utils.sendErrorLog(err, "error");
    }
  }
}
