// Including libraries
const fs = require("fs");
const {Client} = require("discord.js-selfbot-v13");
global.dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/localizedFormat"));
const {saveAndExit, checkConfig, art} = require("./utils.js");
const {bruteforce, perms, overlap} = require("./steps.js");

// Setting up client
const client = new Client({
    checkUpdate: false, partials: ["GUILD_MEMBER"]
});

// Config and guild are stored here
let config, guild;

// Config file validation
try {
    config = JSON.parse(fs.readFileSync("./config.json"));
} catch (e) {
    console.error("ERROR: missing config file!");
    process.exit(1);
}
const configStatus = checkConfig(config);
if (!configStatus.ok) {
    console.error(`ERROR: missing '${configStatus.prop}' in config file!`);
    process.exit(1);
}

// Preparing date formatting
try {
    require(`dayjs/locale/${config.dateLocale}`);
    dayjs.locale(config.dateLocale);
} catch (e) {
    console.warn(`WARNING: locale '${config.dateLocale}' not found. Using 'en' as fallback.`);
    dayjs.locale("en");
}

// Just informational things
client.on("rateLimit", async (data) => {
    console.log(data);
});

// When bot is ready
client.on("ready", async () => {
    console.log(art);
    console.log(`Logged in as ${client.user.tag} (${client.user?.emailAddress || "NO EMAIL"})`);

    // Getting target
    guild = await client.guilds.cache.get(config.guildID);
    if (!guild?.available) {
        console.error("ERROR: selected guild is not available!\nAvailable guilds:", client.guilds.cache.map(x => `${x.name} (${x.id})`).join(", "));
        process.exit(1);
    }
    const channel = await guild.channels.cache.get(config.channelID);
    if (!channel) {
        console.warn("WARNING: selected channel is missing! 'Member list' method will be skipped\nAvailable channels: ", guild.channels.cache.map(x => `${x.name} (${x.id})`).join(", "));
    }

    console.log(`Target acquired: ${guild.name} (${channel?.name || "NO CHANNEL"})`);

    // Fetching!
    await perms(guild); // Method 1 - fetching with perms
    if (channel) await overlap(guild, config, client); // Method 2 - overlap member list fetching
    if ((guild.members.cache.size < guild.memberCount) && (guild.members.cache.size !== guild.memberCount)) await bruteforce(guild, config); // Method 3 - brute-force fetching

    // Done!
    console.log(`Fetching done! Found ${guild.members.cache.size}/${guild.memberCount} => ${guild.members.cache.size / guild.memberCount * 100}% members.`);

    await saveAndExit(client, config, guild);
});

process.on("SIGINT", async () => {
    console.log("\nStopped upon user's request!");
    await saveAndExit(client, config, guild);
});

client.login(config.token);
