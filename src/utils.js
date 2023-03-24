const fs = require("fs");
const request = require("request");
const path = require("path");
const packagejson = require("../package.json");

module.exports = {
    formatUserData: function (member, spacing, dateFormat) {
        const avatarURL = member.user?.displayAvatarURL({
            size: 1024,
            dynamic: true
        });
        const presenceJSON = {activities: member?.presence?.activities, clientStatus: member?.presence?.clientStatus};
        const data = [member.id, member.user.tag, member?.nickname || "", avatarURL || "", member.roles.cache.map(role => `${role.id} - ${role.name}`).join(", "),
            dayjs(member.user.createdAt).format(dateFormat), dayjs(member.joinedAt).format(dateFormat), member?.presence?.status !== "offline" ? JSON.stringify(presenceJSON) : "",
            member?.presence?.status.toUpperCase(), member?.user?.flags?.toArray()?.join(", "), member.premiumSinceTimestamp ? dayjs(member.premiumSinceTimestamp).format(dateFormat) : ""
        ];
        return data.join(spacing);
    },

    checkConfig: function () {
        let props = [];
        switch (process.env.MODE.toLowerCase()) {
            case "watchdog":
                props = ["GUILD_ID", "TOKEN"];
                break;
            case "members":
                props = ["GUILD_ID", "CHANNEL_ID", "SPACING", "TOKEN", "DELAY", "DICTIONARY", "DATE_FORMAT", "DATE_LOCALE"];
                break;
            default:
                return {success: false, reason: "MODE"};
        }
        for (let prop of props) {
            if (!process.env[prop]) return {success: false, reason: prop};
        }
        return {success: true};
    },
    welcome: function (client) {
        console.log(module.exports.art.replace("$MODE", process.env.MODE.toUpperCase()));
        console.log(`Logged in as ${client.user.tag} (${client.user?.emailAddress || "NO EMAIL"})`);
    },
    refreshLoading: function (ora, guild) {
        ora.text = `Fetching members... ${guild.members.cache.size}/${guild.memberCount} => ${Math.floor(guild.members.cache.size / guild.memberCount * 100)}%`;
    },
    saveMembers: function (client, guild) {
        // Generating text output
        const header = ["id", "username#discriminator", "nickname", "avatar", "roles", "created_at", "joined_at", "activity", "status", "flags", "boosting_since\n"];
        let data = header.join(process.env.SPACING);

        data += guild.members.cache.map(member => module.exports.formatUserData(member, process.env.SPACING, process.env.DATE_FORMAT)).join("\n");

        // Save to file
        const filename = `logs/members-${guild.id}-${Date.now()}.txt`;
        try {
            fs.writeFileSync(filename, data);
            console.log(`Saved data to ${filename}!`);
        } catch (e) {
            console.error(e);
        }
    },
    exit: function (client) {
        console.log("OSINTCord says goodbye.");
        client.destroy();
        process.exit(0);
    },
    downloadFile: function (url) {
        const mediaDir = './media';
        if (!fs.existsSync(mediaDir)) {
            fs.mkdirSync(mediaDir);
        }
        let fileName = url.replace("https://media.discordapp.net/attachments/", "");
        fileName = fileName.replaceAll("/", "-");
        const filePath = path.join(mediaDir, fileName);

        request(url)
            .on('error', (err) => {
                console.error(`Error downloading file: ${err.message}`);
            })
            .pipe(fs.createWriteStream(filePath))
            .on('error', (err) => {
                console.error(`Error saving file: ${err.message}`);
            })
            .on('finish', () => {
                console.log(`File saved to ${filePath}`);
            });
    },

    art: `
 ██████╗ ███████╗██╗███╗   ██╗████████╗ ██████╗ ██████╗ ██████╗ ██████╗ 
██╔═══██╗██╔════╝██║████╗  ██║╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗
██║   ██║███████╗██║██╔██╗ ██║   ██║   ██║     ██║   ██║██████╔╝██║  ██║
██║   ██║╚════██║██║██║╚██╗██║   ██║   ██║     ██║   ██║██╔══██╗██║  ██║
╚██████╔╝███████║██║██║ ╚████║   ██║   ╚██████╗╚██████╔╝██║  ██║██████╔╝
 ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝     v${packagejson.version}
=============\t\t\t$MODE MODE\t\t\t=============`
};
