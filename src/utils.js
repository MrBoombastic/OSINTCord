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
    }
};
