module.exports = {
    zeroPad: function (num) {
        return num.toString().padStart(2, "0");
    },

    dateFormatter: function (date) {
        return `${date.getFullYear()}-${module.exports.zeroPad(date.getMonth() + 1)}-${module.exports.zeroPad(date.getDate())} ${module.exports.zeroPad(date.getHours())}:${module.exports.zeroPad(date.getMinutes())}:${module.exports.zeroPad(date.getSeconds())}.${date.getMilliseconds()}`;
    },

    formatUserData: function (member, spacing) {
        const data = [member.id, member.user.tag, member?.nickname || "NULL", member.user?.avatar || "NULL", member.roles.cache.map(role => role.id).join(", "),
            module.exports.dateFormatter(member.user.createdAt), module.exports.dateFormatter(member.joinedAt), member?.presence?.activities?.map(activity => activity?.name).join(", ") || "NULL",
            member?.presence?.status.toUpperCase() || "NULL", member.user?.displayAvatarURL({
                size: 1024,
                dynamic: true
            })];
        return data.join(spacing);
    }

};