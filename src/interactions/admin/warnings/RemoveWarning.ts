import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { SubCommand } from "structures/Command/SubCommand";
import { prisma } from "utils/prisma";

export default class RemoveWarningCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "admin",
      groupName: "warnings",
      name: "remove",
      description: "Remove a warning from a user",
      memberPermissions: [DJS.PermissionFlagsBits.ManageGuild],
      options: [
        {
          name: "user",
          required: true,
          description: "The user you want to remove a warning of",
          type: DJS.ApplicationCommandOptionType.User,
        },
        {
          name: "warning-id",
          required: true,
          description: "The id of a warning",
          type: DJS.ApplicationCommandOptionType.Integer,
        },
      ],
    });
  }

  async execute(
    interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">,
    lang: typeof import("@locales/english").default,
  ) {
    const user = interaction.options.getUser("user", true);
    const id = interaction.options.getInteger("warning-id", true);

    if (user.bot) {
      return interaction.reply({
        ephemeral: true,
        content: lang.MEMBER.BOT_DATA,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const warnings = await this.bot.utils.getUserWarnings(user.id, interaction.guildId!);

    if (!warnings[0]) {
      return interaction.reply({
        content: lang.ADMIN.NO_WARNINGS,
      });
    }

    const warning = warnings[id - 1];
    if (!warning) {
      return interaction.editReply({
        content: "That warning was not found",
      });
    }

    await prisma.warnings.deleteMany({
      where: { id: warning.id },
    });

    await interaction.editReply({ content: "Successfully removed the warning." });
  }
}
