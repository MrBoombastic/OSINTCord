// Including libraries
const {Client} = require("discord.js-selfbot-v13");
global.dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/localizedFormat"));
const {saveAndExit, checkConfig} = require("./utils.js");
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

// For some reason, I can't get vercel/pkg to work. Using this workaround instead.
if (process.env.MODE === "WATCHDOG") {
    client.on("messageDelete", require("./events/watchdog/messageDelete.js").bind(null, client));
    client.on("messageUpdate", require("./events/watchdog/messageUpdate.js").bind(null, client));
    client.on("ready", require("./events/watchdog/ready.js").bind(null, client));
} else if (process.env.MODE === "MEMBERS") {
    client.on("ready", require("./events/members/ready.js").bind(null, client));
}


process.on("SIGINT", async () => {
    console.log("\nStopped upon user's request!");
    await saveAndExit(client, guild);
});

client.login(process.env.TOKEN);
