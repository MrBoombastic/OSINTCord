const {refreshLoading} = require("./utils");
const ora = require("ora");
module.exports = {
    perms: async (guild) => {
        const progressbar = ora({
            text: "Starting 'fetching with perms' method!", prefixText: "[FETCH WITH PERMS]"
        }).start();
        refreshLoading(progressbar, guild);
        const stage = setInterval(function () {
            refreshLoading(progressbar, guild);
        }, 500);
        // In my fork, this only fetches members if user has at least one of these perms: KICK_MEMBERS, BAN_MEMBERS, MANAGE_ROLES
        await guild.members.fetch();
        clearInterval(stage);
        progressbar.stop();
    },

    bruteforce: async (guild, config) => {
        // Dictionary info
        const dictionary = (Array.from(new Set(config.dictionary.toLowerCase()))).sort();  //deduplication
        console.log("Using dictionary:", dictionary.join(''));

        const progressbar = ora({text: "Starting 'brute-force' method!", prefixText: "[BRUTE-FORCE]"}).start();
        // https://github.com/aiko-chan-ai/discord.js-selfbot-v13/blob/main/Document/FetchGuildMember.md
        // Bruteforce dictionary (searching nicknames by characters)

        refreshLoading(progressbar, guild);
        const stage = setInterval(function () {
            refreshLoading(progressbar, guild);
        }, 500);
        await guild.members.fetchBruteforce({
            delay: config.delay, limit: 100,  //max limit is 100 at once
            dictionary: dictionary
        });
        clearInterval(stage);
        progressbar.stop();
    },

    overlap: async (guild, config, client) => {
        const progressbar = ora({
            text: "Starting 'overlap member list' method!", prefixText: "[OVERLAP MEMBER LIST]"
        }).start();
        // Fetching members from sidebar, may fetch additional online members, if guild has > 1000
        refreshLoading(progressbar, guild);
        const stage = setInterval(function () {
            refreshLoading(progressbar, guild);
        }, 500);
        for (let index = 0; index <= guild.memberCount; index += 100) {
            await guild.members.fetchMemberList(config.channelID, index, index !== 100).catch(() => false);
            await client.sleep(config.delay);
        }
        clearInterval(stage);
        progressbar.stop();
    }
};
