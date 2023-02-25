const fs = require("fs");
module.exports = {
    formatUserData: function (member, spacing, dateFormat) {
        const data = [member.id, member.user.tag, member?.nickname || "NULL", member.user?.avatar || "NULL", member.roles.cache.map(role => `${role.id} - ${role.name}`).join(", "),
            dayjs(member.user.createdAt).format(dateFormat), dayjs(member.joinedAt).format(dateFormat), member?.presence?.activities?.map(activity => activity?.name).join(", ") || "NULL",
            member?.presence?.status.toUpperCase(), member.user?.displayAvatarURL({
                size: 1024,
                dynamic: true
            })];
        return data.join(spacing);
    },

    checkConfig: function (config) {
        const props = ["guildID", "channelID", "spacing", "token", "delay", "dictionary"];
        for (let prop of props) {
            if (!(prop in config)) return {ok: false, prop};
        }
        return {ok: true};
    },

    refreshLoading: function (ora, prefix, guild) {
        ora.prefixText = prefix;
        ora.text = `Fetching members... ${guild.members.cache.size}/${guild.memberCount} => ${Math.floor(guild.members.cache.size / guild.memberCount * 100)}%`;
    },

    saveAndExit: async function (config, guild) {
        // Generating text output
        const header = ["id", "username#discriminator", "nickname", "avatar", "roles", "created_at", "joined_at", "activity", "status", "avatar_url\n"];
        let data = header.join(config.spacing);

        data += guild.members.cache.map(member => module.exports.formatUserData(member, config.spacing, config.dateFormat)).join("\n");

        // Save to file
        const filename = `data-${Date.now()}.txt`;
        try {
            fs.writeFileSync(filename, data);
            console.log(`Saved data to ${filename}!`);
        } catch (e) {
            console.error(e);
        } finally {
            console.log("OSINTCord says goodbye!");
            process.exit(0);
        }
    }
};
