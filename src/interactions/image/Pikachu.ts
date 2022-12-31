import * as DJS from "discord.js";
import { request } from "undici";
import { Bot } from "structures/Bot";
import { SubCommand } from "structures/Command/SubCommand";

export default class PikachuCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "image",
      name: "pikachu",
      description: "Returns an image of a pikachu",
    });
  }

  async execute(
    interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">,
    lang: typeof import("@locales/english").default,
  ) {
    await interaction.deferReply();

    const data = (await request(this.APIs.Pikachu).then((res) => res.body.json())) as {
      link: string;
    };

    const embed = this.bot.utils
      .baseEmbed(interaction)
      .setDescription(`${lang.IMAGE.CLICK_TO_VIEW}(${data.link})`)
      .setImage(data.link);

    await interaction.editReply({ embeds: [embed] });
  }
}
