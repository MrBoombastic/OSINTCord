import {Client} from "discord.js-selfbot-v13";
import {checkConfig, exit, saveMembers} from "./utils.js";
import 'dotenv/config';


// Setting up client
const client = new Client();

// Config file validation
const configStatus = checkConfig();
if (!configStatus.success) {
    console.error(`ERROR: wrong config! Reason: ${configStatus.reason}`);
    process.exit(1);
}

const events = {
    watchdog: ["messageDelete", "messageUpdate", "ready"],
    members: ["ready"]
};
for (const file of events[process.env.MODE.toLowerCase()]) {
    const event = await import(`./events/${process.env.MODE.toLowerCase()}/${file}.js`);
    client.on(file, event.default.bind(null, client));
}

process.on("SIGINT", async () => {
    console.log("\nStopping at user's request!");
    if (process.env.MODE.toLowerCase() === "members") saveMembers(client, client.guilds.cache.get(process.env.GUILD_ID));
    exit(client);
});

client.login(process.env.TOKEN);
