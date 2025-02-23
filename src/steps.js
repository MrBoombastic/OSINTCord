import {refreshLoading} from "./utils.js";
import ora from "ora";


export async function bruteforce(guild) {
    // Dictionary info
    const dictionary = (Array.from(new Set(process.env.DICTIONARY.toLowerCase()))).sort();  //deduplication
    console.log("Using dictionary:", dictionary.join(''));

    const delay = parseInt(process.env.DELAY);
    if (delay < 500) console.warn(`WARN: Delay is less than 500ms, this may cause rate limits.`,);

    // Get up to 10 000 members instantly
    let prefetchedSize = 0;
    if (process.env.PREFETCH === "true") {
        const prefetched = await guild.members.fetchByMemberSafety();
        console.log(`[PREFETCH] Prefetched ${prefetched?.size} members from a total of ${guild.memberCount} members.`);
        prefetchedSize = prefetched.size;
    }

    const limit = 100; // greater values change nothing

    // if there are missing members, bruteforce by dictionary
    if (prefetchedSize < guild.memberCount) {
        console.log(`Still missing members, brute-forcing\n`);
        const progressbar = ora({text: "Starting 'brute-force' method!", prefixText: "[BRUTE-FORCE]"}).start();

        // recursively search for members with the given dictionary
        const fetchRec = async (query) => {
            const req = await guild.members.fetch({query, limit});

            refreshLoading(progressbar, guild, query);
            // Deduplication of members here does not make any sense - when we hit the limit (100),
            // there still can be missing accounts, so we have to check every time when we hit the limit
            if (req.size === limit) {
                for (const query2 of dictionary) {
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
}

