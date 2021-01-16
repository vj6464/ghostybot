import { Message } from "discord.js";
import fetch from "node-fetch";
import Command from "../../structures/Command";
import Bot from "../../structures/Bot";

export default class AdviceCommand extends Command {
  constructor(bot: Bot) {
    super(bot, {
      name: "advice",
      description: "Gives you advice",
      category: "games",
    });
  }

  async execute(bot: Bot, message: Message) {
    const data = await fetch("https://api.adviceslip.com/advice").then((res) => res.json());

    message.channel.send(data.slip.advice);
  }
}
