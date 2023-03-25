// Including libraries
const {Client} = require("discord.js-selfbot-v13");
global.dayjs = require("dayjs");
dayjs.extend(require("dayjs/plugin/localizedFormat"));
const {checkConfig, exit, saveMembers} = require("./utils.js");
require('dotenv').config();


// Setting up client
const client = new Client({
    checkUpdate: false,
});

// Config file validation
const configStatus = checkConfig();
if (!configStatus.success) {
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

const events = {
    watchdog: ["messageDelete", "messageUpdate", "ready"],
    members: ["ready"]
};
for (const file of events[process.env.MODE.toLowerCase()]) {
    const event = require(`./events/${process.env.MODE.toLowerCase()}/${file}`);
    client.on(file, event.bind(null, client));
}

process.on("SIGINT", async () => {
    console.log("\nStopping at user's request!");
    if (process.env.MODE.toLowerCase() === "members") saveMembers(client, client.guilds.cache.get(process.env.GUILD_ID));
    exit(client);
});

client.login(process.env.TOKEN);
