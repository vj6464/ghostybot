import { ApplicationCommandOptionData, Interaction as DiscordInteraction } from "discord.js";
import Bot from "./Bot";

export interface InteractionOptions {
  name: string;
  description: string;
  options?: ApplicationCommandOptionData[];
}

export default class Interaction {
  bot: Bot;
  name: string;
  options: InteractionOptions;

  constructor(bot: Bot, options: InteractionOptions) {
    this.bot = bot;
    this.name = options.name;
    this.options = options;
  }

  /**
   * @param {Bot} bot bot
   * @param {Message} message discord.js message
   * @param {string[]} args message args
   * @returns {any}
   */
  async execute(
    message: DiscordInteraction,
    args: (string | number | boolean | undefined)[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    message;
    args;
  }
}
