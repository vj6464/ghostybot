import glob from "glob";
import { Collection } from "discord.js";
import { parse } from "path";
import Bot from "structures/Bot";
import Command from "structures/Command";
// import { generateCommandDescriptions } from "../scripts/generateCommandDescriptions";

export default class CommandHandler {
  bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  async loadCommands() {
    try {
      const files = process.env.BUILD_PATH
        ? glob.sync("./dist/src/commands/**/*.js")
        : glob.sync("./src/commands/**/*.ts");

      const path = process.env.BUILD_PATH ? "../../../" : "../../";

      for (const file of files) {
        await this.loadCommand(file, path);
      }

      if (process.env["DEV_MODE"] === "true") {
        // import("@scripts/generateCommandDescriptions").then((v) =>
        //   v.generateCommandDescriptions(this.bot.commands.array()),
        // );
        import("@scripts/generateCommandList").then((v) => v.default(this.bot));
      }
    } catch (e) {
      console.log(e);
    }
  }

  async loadCommand(file: string, path: string) {
    delete require.cache[file];
    const options = parse(`${path}${file}`);
    const File = await (await import(`${path}${file}`)).default;
    const command = new File(this.bot, options) as Command;

    if (!command.execute) {
      new Error(`[ERROR][COMMANDS]: 'execute' function is required for commands! (${file})`);
      process.exit();
    }

    if (!command.name || command.name === "") {
      new Error(`[ERROR][COMMANDS]: 'name' is required for commands! (${file})`);
      process.exit();
    }

    this.bot.commands.set(command.name, command);

    command.options.aliases?.forEach((alias) => {
      this.bot.aliases.set(alias, command.name);
    });

    if (!this.bot.cooldowns.has(command.name)) {
      this.bot.cooldowns.set(command.name, new Collection());
    }

    if (process.env["DEBUG_MODE"] === "true") {
      this.bot.logger.log("COMMAND", `Loaded ${command.name}`);
    }
  }
}
