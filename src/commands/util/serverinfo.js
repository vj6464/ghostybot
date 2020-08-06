const { MessageEmbed } = require("discord.js");
const { formatDate } = require("../../utils/functions");


module.exports = {
    name: "serverinfo",
    description: "Get info about the server",
    category: "util",
    execute(bot, message) {
        const guild = message.guild;
        const name = guild.name;
        const roles = guild.roles.cache.size;
        const channels = guild.channels.cache.size;
        const emojis = guild.emojis.cache.size;
        const owner = guild.owner;
        const createdAt = formatDate(guild.createdAt);
        const joined = formatDate(message.member.joinedAt);

        const region = guild.region;
        const verLevel = guild.verificationLevel;
        const mfaLevel = guild.mfaLevel;

        const embed = new MessageEmbed()
            .setTitle(name)
            .setThumbnail(guild.iconURL({ format: "png", dynamic: true, size: 1024 }))
            .setColor("BLUE")
            .addField("Server Information", `
**Server Owner:** ${owner}
**Roles Count:** ${roles}
**Channels Count:** ${channels}
**Emoji Count:** ${emojis}
**Created At:** ${createdAt}
**Joined:** ${joined}
            `)
            .addField("Other Info", `
**Region:** ${region}
**Verification level:** ${verLevel}
**MFA Level:** ${mfaLevel}
            `);

        message.channel.send(embed);
    }
};