import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { SubCommand } from "structures/Command/SubCommand";

export default class ReRollGiveaway extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "giveaway",
      name: "reroll",
      description: "Re-roll a giveaway",
      memberPermissions: [DJS.PermissionFlagsBits.ManageGuild],
      options: [
        {
          description: "The messageId of the giveaway",
          name: "message-id",
          required: true,
          type: DJS.ApplicationCommandOptionType.String,
        },
      ],
    });
  }

  async execute(
    interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">,
    lang: typeof import("@locales/english").default,
  ) {
    const messageId = interaction.options.getString("message-id", true) as DJS.Snowflake;

    const deleted = await this.bot.giveawayManager.delete(messageId).catch(() => null);

    if (deleted === null) {
      return interaction.reply({
        ephemeral: true,
        content: lang.GIVEAWAY.ALREADY_ENDED,
      });
    }

    await interaction.reply({ ephemeral: true, content: lang.GIVEAWAY.SUCCESS_ENDED });
  }
}
