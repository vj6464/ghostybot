import * as DJS from "discord.js";
import { Bot } from "structures/Bot";
import { ValidateReturn } from "structures/Command/BaseCommand";
import { SubCommand } from "structures/Command/SubCommand";
import filters from "assets/json/filters.json";

export default class FilterCommand extends SubCommand {
  constructor(bot: Bot) {
    super(bot, {
      commandName: "music",
      name: "filter",
      description: "Set or remove a filter for the current queue",
      options: [
        {
          type: DJS.ApplicationCommandOptionType.String,
          name: "filter",
          required: true,
          description: "The filter to set or remove",
          choices: filters.map((v) => ({ value: v, name: v })),
        },
      ],
    });

    this.didEnableFilter = this.didEnableFilter.bind(this);
  }

  async validate(): Promise<ValidateReturn> {
    return {
      ok: false,
      error: {
        content: "Filter has been temporary disabled due to it resulting in high RAM usage.",
        ephemeral: true,
      },
    };

    // const member = await this.bot.utils.findMember(interaction, [interaction.user.id], {
    //   allowAuthor: true,
    // });

    // if (!member?.voice.channel) {
    //   return { ok: false, error: { ephemeral: true, content: lang.MUSIC.MUST_BE_IN_VC } };
    // }

    // return { ok: true };
  }

  async execute(
    interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">,
    lang: typeof import("@locales/english").default,
  ) {
    const filter = interaction.options.getString("filter", true);

    const queue = this.bot.player.getQueue(interaction.guildId!);
    if (!queue || !queue.playing) {
      return interaction.reply({ ephemeral: true, content: lang.MUSIC.NO_QUEUE });
    }

    if (!filters.includes(filter)) {
      return interaction.reply({ ephemeral: true, content: lang.MUSIC.FILTER_NOT_FOUND });
    }

    const didEnableFilter = this.didEnableFilter(interaction, filter);

    queue.filters.set([filter]);

    if (didEnableFilter) {
      await interaction.reply(this.bot.utils.translate(lang.MUSIC.SUC_APPLIED_FILTER, { filter }));
    } else {
      await interaction.reply(this.bot.utils.translate(lang.MUSIC.SUC_REM_FILTER, { filter }));
    }
  }

  didEnableFilter(
    interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">,
    filterToCheck: string,
  ): boolean {
    const queueFilters = this.bot.player.getQueue(interaction.guildId!)?.filters;

    return !queueFilters?.has(filterToCheck) ?? true;
  }
}
