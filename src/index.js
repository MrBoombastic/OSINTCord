const fs = require('fs');
const {Client} = require('discord.js-selfbot-v13');
const {formatUserData, checkConfig} = require("./utils.js");
const client = new Client({
    checkUpdate: false,
    partials: ["GUILD_MEMBER"]
});
let config;

// Config file validation
console.log("Checking config.json...");
try {
    config = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
} catch (e) {
    return console.error("ERROR: missing config file!");
}
const configStatus = checkConfig(config);
if (!configStatus.ok) {
    console.error(`ERROR: missing '${configStatus.prop}' in config file!`);
    process.exit(1);
}


// Just informational
let method = "";

client.on('rateLimit', async (data) => {
    console.log(data);
});

// When bot is ready
client.on('ready', async () => {
    console.log(`
 ██████╗ ███████╗██╗███╗   ██╗████████╗ ██████╗ ██████╗ ██████╗ ██████╗ 
██╔═══██╗██╔════╝██║████╗  ██║╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗
██║   ██║███████╗██║██╔██╗ ██║   ██║   ██║     ██║   ██║██████╔╝██║  ██║
██║   ██║╚════██║██║██║╚██╗██║   ██║   ██║     ██║   ██║██╔══██╗██║  ██║
╚██████╔╝███████║██║██║ ╚████║   ██║   ╚██████╗╚██████╔╝██║  ██║██████╔╝
 ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝     v1.2.0
`);
    console.log(`OSINTCord ${client.user.username} is ready!`);

    // Getting target guild
    const guild = await client.guilds.cache.get(config.guildID);
    if (!guild) {
        console.error("ERROR: selected guild is not available!");
        process.exit(1);
    }
    console.log(`Guild: target acquired: ${guild.name}`);

    // Getting target channel
    const channel = await client.channels.cache.get(config.channelID);
    if (!channel) {
        console.error("WARNING: selected channel is missing! Member list method will be skipped.");
    }

    // Initiating progress loop
    const loading = setInterval(() => {
        console.log(`[${method}] Fetching members... ${guild.members.cache.size}/${guild.memberCount} => ${Math.floor(guild.members.cache.size / guild.memberCount * 100)}%`);
    }, 3000);

    // https://github.com/aiko-chan-ai/discord.js-selfbot-v13/blob/main/Document/FetchGuildMember.md

    // Bruteforce dictionary (searching nicknames by characters)
    method = "FETCH BRUTEFORCE";
    await guild.members.fetchBruteforce({
        delay: config.delay,
        limit: 100,  //max limit is 100 at once
        dictionary: Array.from(new Set(config.dictionary.toLowerCase())) //deduplication
    });

    if (channel) {
        // Fetching members from sidebar, may fetch additional online members, if guild has > 1000
        method = "OVERLAP MEMBERLIST";
        for (let index = 0; index <= guild.memberCount; index += 100) {
            await guild.members.fetchMemberList(config.channelID, index, index !== 100).catch(() => false);
            await client.sleep(config.delay);
        }
    }

    // Done!
    console.log(`Fetching done! Found ${guild.members.cache.size}/${guild.memberCount} => ${guild.members.cache.size / guild.memberCount * 100}% members.`);

    // Generating text output
    const header = ["id", "username#discriminator", "nickname", "avatar", "roles", "created_at", "joined_at", "activity", "status", "avatar_url\n\n"];
    let data = header.join(config.spacing);

    data += guild.members.cache.map(member => formatUserData(member, config.spacing)).join("\n");

    // Stop loading interval
    clearInterval(loading);

    // Save to file
    const filename = `data-${Date.now()}.txt`;
    try {
        fs.writeFileSync(filename, data);
        console.log(`Saved data to ${filename}!`);
    } catch (e) {
        console.error(e);
    } finally {
        console.log("OSINTCord says goodbye!");
        client.destroy();
        process.exit(0);
    }
});

client.login(config.token);
