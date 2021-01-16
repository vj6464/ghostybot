const BaseEmbed = require("../../modules/BaseEmbed");

module.exports = {
  name: "createrole",
  description: "This command creates a role with the name of what you say",
  category: "admin",
  usage: "<role_name>",
  botPermissions: ["MANAGE_ROLES"],
  memberPermissions: ["MANAGE_ROLES"],
  requiredArgs: ["role name"],
  async execute(bot, message, args) {
    const lang = await bot.utils.getGuildLang(message.guild?.id);
    const roleName = args[0];

    message.guild.roles.create({
      data: {
        name: roleName,
        color: "BLUE",
      },
    });

    const embed = bot.utils.baseEmbed(message)
      .setTitle(`${lang.ADMIN.CREATED_ROLE_CREATED}: ${roleName}`)
      .setDescription(lang.ADMIN.CREATED_ROLE_ADDED);

    message.channel.send(embed);
  },
};
