import { Queue, Song } from "distube";
import { Bot } from "structures/Bot";
import { Event } from "structures/Event";

export default class PlayerAddSongEvent extends Event {
  constructor(bot: Bot) {
    super(bot, "addSong");
  }

  async execute(bot: Bot, queue: Queue, song: Song) {
    try {
      const channel = queue.textChannel;

      if (!channel?.guild.available) return;
      if (!bot.utils.hasSendPermissions(channel)) return;
      const lang = await bot.utils.getGuildLang(channel.guild.id);

      const embed = bot.utils
        .baseEmbed({ author: song.user ?? null })
        .setTitle(
          this.bot.utils.translate(lang.MUSIC.ADDED_TO_QUEUE, {
            song: song.name as string,
          }),
        )
        .setAuthor({
          name: this.bot.utils.translate(lang.MUSIC.REQUESTED_BY, {
            user: song.user!.username,
          }),
        });

      if (song.thumbnail) {
        embed.setImage(song.thumbnail);
      }

      return channel.send({ embeds: [embed] });
    } catch (err) {
      bot.utils.sendErrorLog(err, "error");
    }
  }
}
