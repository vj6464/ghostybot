import * as DJS from "discord.js";
import type { BaseImageURLOptions } from "@discordjs/rest";
import { Bot } from "structures/Bot";
import { SubCommand } from "structures/Command/SubCommand";

export default class AvatarCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "util",
      name: "avatar",
      description: "View the avatar of a user",
      options: [
        {
          name: "user",
          required: false,
          description: "The user you want to see the avatar of",
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

    const png = this.getAvatar(user, "png");
    const webp = this.getAvatar(user, "webp");
    const jpg = this.getAvatar(user, "jpg");
    const gif = this.getAvatar(user, "gif");

    const embed = this.bot.utils
      .baseEmbed(interaction)
      .setTitle(`${user.username} ${lang.UTIL.AVATAR}`)
      .setDescription(`[png](${png}) | [webp](${webp}) | [jpg](${jpg}) | [gif](${gif})`)
      .setImage(`${webp}`);

    await interaction.reply({ embeds: [embed] });
  }

  getAvatar(user: DJS.User, extension: BaseImageURLOptions["extension"]) {
    return user.displayAvatarURL({ size: 4096, extension });
  }
}
