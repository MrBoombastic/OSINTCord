module.exports = async (client, oldMsg, newMsg) => {
    if ((oldMsg.guildId === process.env.GUILD_ID || process.env.GUILD_ID.toLowerCase() === "all") && oldMsg.content !== newMsg.content) {
        let info = `EDITED MESSAGE: Guild: ${oldMsg.guild.name} Channel: ${oldMsg.channel.name} Author: ${oldMsg.author?.tag} Bot: ${oldMsg.author?.bot}
OLD: ${oldMsg.content}
NEW: ${newMsg.content}`;
        if (oldMsg.attachments.size > 0) info += `\nOLD MEDIA: ${newMsg.attachments.map(x => x.url).join(", ")}`;
        if (newMsg.attachments.size > 0) info += `\nNEW MEDIA: ${newMsg.attachments.map(x => x.url).join(", ")}`;
        client.logger.info(info);
    }
};
