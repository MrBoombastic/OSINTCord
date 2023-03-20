// Including libraries
const {Client} = require("discord.js-selfbot-v13");
global.dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/localizedFormat"));
const {saveAndExit, checkConfig, art, downloadFile} = require("./utils.js");
const {bruteforce, perms, overlap} = require("./steps.js");
const log4js = require("log4js");
require('dotenv').config();


// Setting up client
const client = new Client({
    checkUpdate: false, partials: ["GUILD_MEMBER"]
});

// Config and guild are stored here
let guild;

// Config file validation
const configStatus = checkConfig();
if (!configStatus.ok) {
    console.error(`ERROR: wrong config! Reason: ${configStatus.reason}`);
    process.exit(1);
}

// Preparing date formatting
try {
    require(`dayjs/locale/${process.env.DATE_LOCALE}`);
    dayjs.locale(process.env.DATE_LOCALE);
} catch (e) {
    console.warn(`WARNING: locale '${process.env.DATE_LOCALE}' not found. Using 'en' as fallback.`);
    dayjs.locale("en");
}

// Just informational things
client.on("rateLimit", async (data) => {
    console.log(data);
});

// When bot is ready
client.on("ready", async () => {
    console.log(art.replace("$MODE", process.env.MODE));
    console.log(`Logged in as ${client.user.tag} (${client.user?.emailAddress || "NO EMAIL"})`);
    if (process.env.MODE === "WATCHDOG") {
        // Getting target
        const info = await client.guilds.cache.get(process.env.GUILD_ID);
        console.log(`Target acquired: ${info.name}`);

        // Set up message logging
        log4js.configure({
            appenders: {watchdog: {type: "file", filename: `${process.env.GUILD_ID}.log`}},
            categories: {default: {appenders: ["watchdog"], level: "info"}},
        });

        global.logger = log4js.getLogger("watchdog");
    } else if (process.env.MODE === "MEMBERS") {
        // Getting target
        guild = await client.guilds.cache.get(process.env.GUILD_ID);
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
    }
});

client.on("messageDelete", message => {
    if (message.guildId === process.env.GUILD_ID || process.env.GUILD_ID === "ALL") {
        let info = `DELETED MESSAGE: Guild: ${message.guild.name} Channel: ${message.channel.name} Author: ${message.author.tag} Bot: ${message.author.bot}\nCONTENT: ${message.cleanContent}`;
        if (message.attachments.size > 0) {
            info += `\nMEDIA: ${message.attachments.map(x => x.proxyURL).join(", ")}`;
            message.attachments.forEach(x => {
                downloadFile(x.proxyURL);
            });
        }
        logger.info(info);
    }
});

client.on("messageUpdate", (oldMsg, newMsg) => {
    if ((oldMsg.guildId === process.env.GUILD_ID || process.env.GUILD_ID === "ALL") && oldMsg.content !== newMsg.content) {
        let info = `EDITED MESSAGE: Guild: ${oldMsg.guild.name} Channel: ${oldMsg.channel.name} Author: ${oldMsg.author?.tag} Bot: ${oldMsg.author?.bot}
OLD: ${oldMsg.content}
NEW: ${newMsg.content}`;
        if (oldMsg.attachments.size > 0) info += `\nOLD MEDIA: ${newMsg.attachments.map(x => x.url).join(", ")}`;
        if (newMsg.attachments.size > 0) info += `\nNEW MEDIA: ${newMsg.attachments.map(x => x.url).join(", ")}`;
        logger.info(info);
    }
});

process.on("SIGINT", async () => {
    console.log("\nStopped upon user's request!");
    await saveAndExit(client, guild);
});

client.login(process.env.TOKEN);
