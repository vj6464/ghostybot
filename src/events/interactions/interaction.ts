import { Constants, Interaction } from "discord.js";
import Bot from "structures/Bot";
import Event from "structures/Event";

export default class InteractionEvent extends Event {
  constructor(bot: Bot) {
    super(bot, Constants.Events.INTERACTION_CREATE);
  }

  async execute(bot: Bot, interaction: Interaction) {
    if (!interaction.isCommand()) return;
    if (!interaction.command) return;

    const command = bot.interactions.get(interaction.command.name);

    try {
      await command?.execute(
        interaction,
        interaction.options.map((v) => v.value),
      );
    } catch (e) {
      bot.utils.sendErrorLog(e, "error");
    }
  }
}
