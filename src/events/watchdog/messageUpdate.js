const {downloadFile} = require("../../utils");

module.exports = async (client, oldMsg, newMsg) => {
    if (oldMsg.guildId === process.env.GUILD_ID || process.env.GUILD_ID.toLowerCase() === "all") {
        if (oldMsg.embeds.length === 0 && newMsg.embeds.length > 0) return; //ignoring generating thumbnails for images
        let info = `[EDITED MESSAGE] Guild: ${oldMsg.guild.name} Channel: ${oldMsg.channel.name} Author: ${oldMsg.author?.tag} Bot: ${oldMsg.author?.bot}
OLD CONTENT: ${oldMsg.content}
NEW CONTENT: ${newMsg.content}`;
        if (oldMsg.attachments.size !== newMsg.attachments.size) {
            info += `\nOLD MEDIA: ${oldMsg.attachments.map(x => x.url).join(", ")}`;
            info += `\nNEW MEDIA: ${newMsg.attachments.map(x => x.url).join(", ")}`;
            // Assuming that user can only remove media from existing message
            oldMsg.attachments.forEach(x => {
                downloadFile(x.proxyURL);
            });
        }
        client.logger.log(info);
    }
};
