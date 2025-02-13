import { Message, Permissions } from "discord.js";
import categories from "data/categories.json";
import Command from "structures/Command";
import Bot from "structures/Bot";

export const saveCommands = ["help", "enable", "disable"];
export const saveCategories = ["botowner", "exempt", "disabled", "custom"];

export default class DisableCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "disable",
      description: "Disables a command",
      category: "exempt",
      memberPermissions: [Permissions.FLAGS.ADMINISTRATOR],
      requiredArgs: [{ name: "command name | category name" }],
    });
  }

  async execute(message: Message, args: string[]) {
    const lang = await this.bot.utils.getGuildLang(message.guild?.id);
    try {
      const [option] = args;

      const guild = await this.bot.utils.getGuildById(message.guild?.id);

      if (!guild) {
        return message.channel.send(lang.GLOBAL.ERROR);
      }

      if (!option) {
        return message.channel.send(lang.ADMIN.PROVIDE_COMMAND_OR_CATEGORY_NAME);
      }

      if (guild?.custom_commands?.find(({ name }) => name.toLowerCase() === option.toLowerCase())) {
        return message.channel.send(lang.ADMIN.COMMAND_CANNOT_DISABLED);
      }

      const command = this.bot.utils.resolveCommand(option.toLowerCase());

      if (!command) {
        // disable category
        const category = option.toLowerCase();
        if (!categories.includes(category)) {
          return message.channel.send(lang.ADMIN.COMMAND_OR_CATEGORY_NOT_FOUND);
        }

        if (saveCategories.includes(category)) {
          return message.channel.send(lang.ADMIN.CATEGORY_CANNOT_DISABLED);
        }

        if (guild?.disabled_categories?.includes(category)) {
          return message.channel.send(lang.ADMIN.CATEGORY_ALREADY_DISABLED);
        }

        await this.bot.utils.updateGuildById(message.guild?.id, {
          disabled_categories: [...guild.disabled_categories, category],
        });

        const embed = this.bot.utils
          .baseEmbed(message)
          .setTitle(lang.ADMIN.DISABLED_CATEGORY)
          .setDescription(lang.ADMIN.CATEGORY_DISABLED.replace("{category}", category));

        return message.channel.send(embed);
      } else {
        // disable command
        if (saveCommands.includes(command.name)) {
          return message.channel.send(lang.ADMIN.COMMAND_CANNOT_DISABLED);
        }

        if (guild.disabled_commands.includes(command.name)) {
          return message.channel.send(lang.ADMIN.COMMAND_ALREADY_DISABLED);
        }

        await this.bot.utils.updateGuildById(message.guild?.id, {
          disabled_commands: [...guild.disabled_commands, command.name],
        });

        const embed = this.bot.utils
          .baseEmbed(message)
          .setTitle(lang.ADMIN.DISABLED_COMMAND)
          .setDescription(lang.ADMIN.COMMAND_DISABLED.replace("{commandName}", command.name));

        return message.channel.send(embed);
      }
    } catch (err) {
      this.bot.utils.sendErrorLog(err, "error");
      return message.channel.send(lang.GLOBAL.ERROR);
    }
  }
}
