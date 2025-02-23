import {exit, saveMembers, welcome} from "../../utils.js";
import {bruteforce} from "../../steps.js";

export default async (client) => {
    welcome(client);

    // Getting target
    const guild = await client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild?.available) {
        console.error("ERROR: selected guild is not available!\nAvailable guilds:", client.guilds.cache.map(x => `${x.name} (${x.id})`).join(", "));
        process.exit(1);
    }

    // Fetching!
    if (guild.members.cache.size < guild.memberCount) await bruteforce(guild); // Method 3 - brute-force fetching

    // Done!
    console.log(`Fetching done! Found ${guild.members.cache.size}/${guild.memberCount} => ${guild.members.cache.size / guild.memberCount * 100}% members.`);
    saveMembers(client, guild);
    exit(client);
};
