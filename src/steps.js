const {refreshLoading} = require("./utils");
const ora = require("ora");


const bruteforce = async (guild) => {
    // Dictionary info
    const dictionary = (Array.from(new Set(process.env.DICTIONARY.toLowerCase()))).sort();  //deduplication
    console.log("Using dictionary:", dictionary.join(''));

    const delay = parseInt(process.env.DELAY);
    if (delay < 500) console.warn(`WARN: Delay is less than 500ms, this may cause rate limits.`,);

    // Get up to 10 000 members instantly
    const prefetched = await guild.members.fetchByMemberSafety();
    console.log(`[PREFETCH] Prefetched ${prefetched?.size} members from a total of ${guild.memberCount} members.`);

    const limit = 100; // greater values change nothing

    // if there are missing members, bruteforce by dictionary
    if (prefetched?.size < guild.memberCount) {
        console.log(`Still missing members, brute-forcing\n`);
        // cache of members before next fetching
        const idsBeforeSet = new Set(guild.members.cache.map(member => member.id));
        const progressbar = ora({text: "Starting 'brute-force' method!", prefixText: "[BRUTE-FORCE]"}).start();
        // recursively search for members with the given dictionary
        const fetchRec = async (query) => {
            const req = await guild.members._fetchMany({query, limit});
            // search may return duplicated members, we need to filter them (comparing with current cache)
            const newMembers = req.filter(member => !idsBeforeSet.has(member.id));
            // add new members to cache
            newMembers.forEach(member => guild.members.cache.set(member.id, member));
            // update idsBefore and cache
            newMembers.forEach(member => {
                guild.members.cache.set(member.id, member);
                idsBeforeSet.add(member.id);
            });
            if (newMembers?.size === limit) {
                for (const query2 of dictionary) {
                    refreshLoading(progressbar, guild, query + query2);
                    await guild.client.sleep(delay);
                    await fetchRec(query + query2);
                }
            }
        };
        for (const query of dictionary) {
            refreshLoading(progressbar, guild, query);
            await guild.client.sleep(delay);
            await fetchRec(query);
        }
        progressbar.stop();
    }
};
module.exports = {bruteforce};

