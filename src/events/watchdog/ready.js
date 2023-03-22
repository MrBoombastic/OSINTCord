const log4js = require("log4js");
const {art} = require("../../utils");
module.exports = async (client) => {
    console.log(art.replace("$MODE", process.env.MODE));
    console.log(`Logged in as ${client.user.tag} (${client.user?.emailAddress || "NO EMAIL"})`);

    // Getting target
    const info = process.env.GUILD_ID.toLowerCase() === "all" ? "ALL GUILDS" : await client.guilds.cache.get(process.env.GUILD_ID).name;
    console.log(`Target acquired: ${info}`);

    // Set up message logging
    log4js.configure({
        appenders: {watchdog: {type: "file", filename: `${process.env.GUILD_ID}.log`}},
        categories: {default: {appenders: ["watchdog"], level: "info"}},
    });

    client.logger = log4js.getLogger("watchdog");
};
