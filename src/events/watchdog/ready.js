import log4js from "log4js";
import {welcome} from "../../utils.js";

export default async (client) => {
    welcome(client);

    // Getting target
    const info = process.env.GUILD_ID.toLowerCase() === "all" ? "ALL GUILDS" : await client.guilds.cache.get(process.env.GUILD_ID).name;
    console.log(`Target acquired: ${info}`);

    // Set up message logging
    log4js.configure({
        appenders: {
            watchdog: {
                type: "file",
                layout: {type: "pattern", pattern: "[%d] %m%n"},
                filename: `logs/watchdog-${process.env.GUILD_ID}.log`
            }
        },
        categories: {default: {appenders: ["watchdog"], level: "info"}},
    });

    client.logger = log4js.getLogger("watchdog");
};
