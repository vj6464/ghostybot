import { bold, inlineCode, time } from "@discordjs/builders";
import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { SubCommand } from "structures/Command/SubCommand";
import badges from "assets/ts/badges";

export default class UserInfoCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "info",
      name: "user",
      description: "Get information about a user",
      options: [
        {
          description: "The user you want more information about",
          name: "user",
          required: false,
          type: DJS.ApplicationCommandOptionType.User,
        },
      ],
    });
  }

  async execute(
    interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">,
    lang: typeof import("@locales/english").default,
  ) {
    const user = interaction.options.getUser("user") ?? interaction.user;

    const member = await this.bot.utils.findMember(interaction, [user.id], { allowAuthor: true });
    if (!member) {
      return interaction.reply({ ephemeral: true, content: lang.MEMBER.NOT_FOUND });
    }

    const banner = await this.bot.users
      .fetch(user.id, { force: true })
      .then((v) => v)
      .catch(() => null);
    const { username, id, tag } = member.user;
    const joinedAt = member.joinedAt ? time(new Date(member.joinedAt), "F") : lang.UTIL.UNKNOWN;
    const joinedAtR = member.joinedAt ? time(new Date(member.joinedAt), "R") : lang.UTIL.UNKNOWN;

    const createdAt = user.createdAt ? time(new Date(user.createdAt), "F") : lang.UTIL.UNKNOWN;
    const createdAtR = user.createdAt ? time(new Date(user.createdAt), "R") : lang.UTIL.UNKNOWN;

    const nickname = member.nickname || lang.GLOBAL.NONE;

    const userFlags =
      (await member.user.fetchFlags(true))
        .toArray()
        .map((flag) => badges[flag])
        .join(" ") || lang.GLOBAL.NONE;

    const roles =
      member.roles.cache
        .filter((r) => r.id !== interaction.guildId)
        .sort((a, b) => b.rawPosition - a.rawPosition)
        .map((r) => r)
        .join(", ") || lang.GLOBAL.NONE;

    const roleCount = member.roles.cache.filter((r) => r.id !== interaction.guildId).size;

    const embed = this.bot.utils
      .baseEmbed(interaction)
      .setTitle(this.bot.utils.translate(lang.UTIL.USER_INFO, { username }))
      .setThumbnail(member.user.displayAvatarURL())
      .setDescription(
        `
${bold("ID")}: ${inlineCode(id)}
${banner?.banner ? `${lang.MEMBER.BANNER}: ${banner.bannerURL({ size: 4096 })}` : ""}
${bold(lang.MEMBER.TAG)}: ${tag}
${bold(lang.MEMBER.BADGES)}: ${userFlags}
${bold(lang.MEMBER.CREATED_ON)}: ${createdAt} (${createdAtR})
${bold(lang.MEMBER.PENDING)}: ${member.pending}
`,
      )
      .addFields(
        {
          name: lang.UTIL.GUILD_INFO,
          value: `
${bold(lang.MEMBER.NICKNAME)}: ${nickname}
${bold(lang.MEMBER.JOINED_AT)}: ${joinedAt} (${joinedAtR})
`,
        },
        {
          name: bold(`${lang.MEMBER.ROLES} (${roleCount})`),
          value: roles,
        },
      );

    await interaction.reply({ embeds: [embed] });
  }
}
