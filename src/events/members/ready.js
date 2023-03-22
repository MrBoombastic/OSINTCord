const {art, saveAndExit} = require("../../utils");
const {perms, overlap, bruteforce} = require("../../steps");
module.exports = async (client) => {
    console.log(art.replace("$MODE", process.env.MODE));
    console.log(`Logged in as ${client.user.tag} (${client.user?.emailAddress || "NO EMAIL"})`);

    // Getting target
    const guild = await client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild?.available) {
        console.error("ERROR: selected guild is not available!\nAvailable guilds:", client.guilds.cache.map(x => `${x.name} (${x.id})`).join(", "));
        process.exit(1);
    }
    const channel = await guild.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel) {
        console.warn("WARNING: selected channel is missing! 'Member list' method will be skipped\nAvailable channels: ", guild.channels.cache.map(x => `${x.name} (${x.id})`).join(", "));
    }

    console.log(`Target acquired: ${guild.name} (${channel?.name || "NO CHANNEL"})`);

    // Fetching!
    await perms(guild); // Method 1 - fetching with perms
    if (channel) await overlap(guild, client); // Method 2 - overlap member list fetching
    if ((guild.members.cache.size < guild.memberCount) && (guild.members.cache.size !== guild.memberCount)) await bruteforce(guild); // Method 3 - brute-force fetching

    // Done!
    console.log(`Fetching done! Found ${guild.members.cache.size}/${guild.memberCount} => ${guild.members.cache.size / guild.memberCount * 100}% members.`);

    await saveAndExit(client, guild);

};
