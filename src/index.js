const {Client} = require('discord.js-selfbot-v13');
const {formatUserData} = require("./utils.js");
const client = new Client({
    checkUpdate: false,
    partials: ["GUILD_MEMBER"]
});
const fs = require('fs');
const config = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
const packagejson = require("../package.json");


// Just informational
let method = "FETCH";

// When bot is ready
client.on('ready', async () => {
    console.log(`
 ██████╗ ███████╗██╗███╗   ██╗████████╗ ██████╗ ██████╗ ██████╗ ██████╗ 
██╔═══██╗██╔════╝██║████╗  ██║╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗
██║   ██║███████╗██║██╔██╗ ██║   ██║   ██║     ██║   ██║██████╔╝██║  ██║
██║   ██║╚════██║██║██║╚██╗██║   ██║   ██║     ██║   ██║██╔══██╗██║  ██║
╚██████╔╝███████║██║██║ ╚████║   ██║   ╚██████╗╚██████╔╝██║  ██║██████╔╝
 ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝         v1.1.0
 ${packagejson.dependencies["discord.js-selfbot-v13"] === "2.8.14" ? "Using GitHub Artifacts? Pls don't. :(" : ""}
`);
    console.log(`OSINTCord ${client.user.username} is ready!`);

    // Getting target Guild
    const guild = await client.guilds.cache.get(config.guildID);
    console.log(`Target acquired: ${guild.name}`);

    // Initiating progress loop
    const loading = setInterval(() => {
        console.log(`[${method}] Fetching members... ${guild.members.cache.size}/${guild.memberCount} => ${Math.floor(guild.members.cache.size / guild.memberCount * 100)}%`);
    }, 3000);

    // https://github.com/aiko-chan-ai/discord.js-selfbot-v13/blob/main/Document/FetchGuildMember.md
    // Using everything because we can!

    // Regular fetch
    await guild.members.fetch();

    // Bruteforce dictionary (searching nicknames by characters)
    method = "FETCH BRUTEFORCE";
    await guild.members.fetchBruteforce({delay: config.delay, dictionary: config.dictionary});

    // Fetching members from sidebar, may fetch additional online members, if guild has > 1000
    method = "OVERLAP MEMBERLIST";
    for (let index = 0; index <= guild.memberCount; index += 100) {
        try {
            await guild.members.fetchMemberList(config.channelID, index, index !== 100).catch(() => false);
            await client.sleep(config.delay);
        } catch (e) {
            console.warn("Using fallback method [selfbot: 2.8.14]...");
            await guild.members.fetchMemberList(config.channelID, index, config.delay)?.catch(() => false);
        }
    }

    // Done!
    console.log(`Fetching done! Found ${guild.members.cache.size}/${guild.memberCount} members.`);

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