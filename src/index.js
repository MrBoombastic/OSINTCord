// Including libraries
const fs = require("fs");
const {Client} = require("discord.js-selfbot-v13");
const ora = require("ora");
global.dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/localizedFormat"));
const {formatUserData, checkConfig} = require("./utils.js");
const client = new Client({
    checkUpdate: false,
    partials: ["GUILD_MEMBER"]
});

// Config is being stored here
let config;

// Config file validation
try {
    console.log("Checking config.json...");
    config = JSON.parse(fs.readFileSync("./config.json", "UTF-8"));
} catch (e) {
    return console.error("ERROR: missing config file!");
} finally {
    console.log("Checking config file done!");
}
const configStatus = checkConfig(config);
if (!configStatus.ok) {
    console.error(`ERROR: missing '${configStatus.prop}' in config file!`);
    process.exit(1);
}

// Preparing date formatting
const locales = require("dayjs/locale.json");
const {refreshLoading} = require("./utils");
let foundLocale = false;
for (const locale of locales) {
    require(`dayjs/locale/${locale.key}`);
    if (locale.key === config.dateLocale) foundLocale = true;
}
if (foundLocale) dayjs.locale(config.dateLocale);
else {
    console.warn(`WARNING: locale '${config.dateLocale}' not found. Using 'en' as fallback.`);
    dayjs.locale("en");
}

// Just informational things
client.on("rateLimit", async (data) => {
    console.log(data);
});

// When bot is ready
client.on("ready", async () => {
    console.log(`
 ██████╗ ███████╗██╗███╗   ██╗████████╗ ██████╗ ██████╗ ██████╗ ██████╗ 
██╔═══██╗██╔════╝██║████╗  ██║╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗
██║   ██║███████╗██║██╔██╗ ██║   ██║   ██║     ██║   ██║██████╔╝██║  ██║
██║   ██║╚════██║██║██║╚██╗██║   ██║   ██║     ██║   ██║██╔══██╗██║  ██║
╚██████╔╝███████║██║██║ ╚████║   ██║   ╚██████╗╚██████╔╝██║  ██║██████╔╝
 ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝     v1.3.0
`);
    console.log(`OSINTCord ${client.user.username} (${client.user?.emailAddress || "NO EMAIL"}) is ready!`);

    // Getting target guild
    const guild = await client.guilds.cache.get(config.guildID);
    if (!guild) {
        console.error("ERROR: selected guild is not available!");
        process.exit(1);
    }
    console.log(`Guild: target acquired: ${guild.name}`);

    // Getting target channel
    const channel = await guild.channels.cache.get(config.channelID);
    if (!channel) {
        console.error("WARNING: selected channel is missing! Member list method will be skipped.");
    }
    console.log(`Channel: target acquired: ${channel.name}`);

    // Initiating progress loop, useful when using other methods taking time
    const loading = ora("Starting!").start();

    // Fetching!
    refreshLoading(loading, "[FETCH WITH PERMS]", guild);
    const firstStage = setInterval(function () {
        refreshLoading(loading, "[FETCH WITH PERMS]", guild);
    }, 500);
    // In my fork, this only fetches members if user has at least one of these perms: KICK_MEMBERS, BAN_MEMBERS, MANAGE_ROLES
    await guild.fetch();
    clearInterval(firstStage);

    // https://github.com/aiko-chan-ai/discord.js-selfbot-v13/blob/main/Document/FetchGuildMember.md
    // Bruteforce dictionary (searching nicknames by characters)
    refreshLoading(loading, "[FETCH BRUTEFORCE]", guild);
    const secondStage = setInterval(function () {
        refreshLoading(loading, "[FETCH BRUTEFORCE]", guild);
    }, 500);
    await guild.members.fetchBruteforce({
        delay: config.delay,
        limit: 100,  //max limit is 100 at once
        dictionary: Array.from(new Set(config.dictionary.toLowerCase())) //deduplication
    });
    clearInterval(secondStage);

    if (channel) {
        // Fetching members from sidebar, may fetch additional online members, if guild has > 1000
        refreshLoading(loading, "[OVERLAP MEMBERLIST]", guild);
        const thirdStage = setInterval(function () {
            refreshLoading(loading, "[OVERLAP MEMBERLIST]", guild);
        }, 500);
        for (let index = 0; index <= guild.memberCount; index += 100) {
            await guild.members.fetchMemberList(config.channelID, index, index !== 100).catch(() => false);
            await client.sleep(config.delay);
        }
        clearInterval(thirdStage);
    }

    // Done!
    loading.text = `Fetching done! Found ${guild.members.cache.size}/${guild.memberCount} => ${guild.members.cache.size / guild.memberCount * 100}% members.`;

    // Generating text output
    const header = ["id", "username#discriminator", "nickname", "avatar", "roles", "created_at", "joined_at", "activity", "status", "avatar_url\n"];
    let data = header.join(config.spacing);

    data += guild.members.cache.map(member => formatUserData(member, config.spacing, config.dateFormat)).join("\n");

    // Stop loading interval
    loading.succeed("Done!");

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
