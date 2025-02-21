const {welcome, exit, saveMembers} = require("../../utils");
const {bruteforce} = require("../../steps");

module.exports = async (client) => {
    welcome(client);

    // Getting target
    const guild = await client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild?.available) {
        console.error("ERROR: selected guild is not available!\nAvailable guilds:", client.guilds.cache.map(x => `${x.name} (${x.id})`).join(", "));
        process.exit(1);
    }
    const channel = await guild.channels.cache.get(process.env.CHANNEL_ID);
    console.log(`Target acquired: ${guild.name} (${channel?.name || "NO CHANNEL"})`);

    // Fetching!
    if (guild.members.cache.size < guild.memberCount) await bruteforce(guild); // Method 3 - brute-force fetching

    // Done!
    console.log(`Fetching done! Found ${guild.members.cache.size}/${guild.memberCount} => ${guild.members.cache.size / guild.memberCount * 100}% members.`);
    saveMembers(client, guild);
    exit(client);
};
