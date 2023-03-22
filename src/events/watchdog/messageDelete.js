const {downloadFile} = require("../../utils");
module.exports = async (client, message) => {
    if (message.guildId === process.env.GUILD_ID || process.env.GUILD_ID.toLowerCase() === "all") {
        let info = `DELETED MESSAGE: Guild: ${message.guild.name} Channel: ${message.channel.name} Author: ${message.author?.tag} Bot: ${message.author?.bot}\nCONTENT: ${message.cleanContent}`;
        if (message.attachments.size > 0) {
            info += `\nMEDIA: ${message.attachments.map(x => x.proxyURL).join(", ")}`;
            message.attachments.forEach(x => {
                downloadFile(x.proxyURL);
            });
        }
        client.logger.info(info);
    }
};
