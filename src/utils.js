import fs from "fs";
import path from "path";
import packagejson from "../package.json" with {type: "json"};
import fetch from "node-fetch";
import dayjs from "dayjs";
import LocalizedFormat from "dayjs/plugin/localizedFormat.js";
import 'dotenv/config';

dayjs.extend(LocalizedFormat);

// Preparing date formatting
try {
    import(`dayjs/locale/${process.env.DATE_LOCALE}.js`);
    dayjs.locale(process.env.DATE_LOCALE);
} catch (e) {
    console.warn(`WARNING: locale '${process.env.DATE_LOCALE}' not found. Using 'en' as fallback.`);
    dayjs.locale("en");
}


export function formatUserData(member, spacing, dateFormat) {
    const avatarURL = member.user?.displayAvatarURL({
        size: 1024,
        dynamic: true
    });
    const presenceJSON = {activities: member?.presence?.activities, clientStatus: member?.presence?.clientStatus};
    const data = [member.id, member.user.tag, member?.nickname || "", avatarURL || "", member.roles.cache.map(role => `${role.id} - ${role.name}`).join(", "),
        dayjs(member.user.createdAt).format(dateFormat), dayjs(member.joinedAt).format(dateFormat), member?.presence?.status !== "offline" ? JSON.stringify(presenceJSON) : "",
        member?.presence?.status.toUpperCase(), member?.user?.flags?.toArray()?.join(", "), member.premiumSinceTimestamp ? dayjs(member.premiumSinceTimestamp).format(dateFormat) : ""
    ];
    return data.join(spacing);
}

export function checkConfig() {
    let props = [];
    switch (process.env?.MODE?.toLowerCase()) {
        case "watchdog":
            props = ["GUILD_ID", "TOKEN"];
            break;
        case "members":
            props = ["GUILD_ID", "PREFETCH", "SPACING", "TOKEN", "DELAY", "DICTIONARY", "DATE_FORMAT", "DATE_LOCALE"];
            break;
        default:
            return {success: false, reason: "MODE"};
    }
    for (let prop of props) {
        if (!process.env[prop]) return {success: false, reason: prop};
    }
    return {success: true};
}

export function welcome(client) {
    console.log(art.replace("$MODE", process.env.MODE.toUpperCase()));
    console.log(`Logged in as ${client.user.tag} (${client.user?.emailAddress || "NO EMAIL"})`);
}

export function refreshLoading(ora, guild, query) {
    ora.text = `Fetching members... ${guild.members.cache.size}/${guild.memberCount} => ${Math.floor(guild.members.cache.size / guild.memberCount * 100)}% [query: ${query || ""}]`;
}

export function saveMembers(client, guild) {
    // Generating text output
    const header = ["id", "username#discriminator", "nickname", "avatar", "roles", "created_at", "joined_at", "activity", "status", "flags", "boosting_since\n"];
    let data = header.join(process.env.SPACING);

    const memberData = guild.members.cache.map(member => formatUserData(member, process.env.SPACING, process.env.DATE_FORMAT));
    data += memberData.join("\n");

    // Save to file
    const logsDir = './logs';
    const filename = `${logsDir}/members-${guild.id}-${Date.now()}.txt`;
    try {
        if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
        fs.writeFileSync(filename, data);
        console.log(`Saved data to ${filename}!`);
    } catch (e) {
        console.error(e);
    }
}

export function exit(client) {
    console.log("OSINTCord says goodbye.");
    client.destroy();
    process.exit(0);
}

export async function downloadFile(url) {
    const mediaDir = './media';
    if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);

    let fileName = url.replace("https://media.discordapp.net/attachments/", "");
    fileName = fileName.replaceAll("/", "-");
    const filePath = path.join(mediaDir, fileName);

    const res = await fetch(url);
    const data = await res.buffer();
    if (res.ok) {
        fs.writeFileSync(filePath, data);
        console.log(`File saved to ${filePath}`);
    } else console.error(`Failed to download deleted media (${url}): ${res.status} ${res.statusText}`);
}

export const art = `
 ██████╗ ███████╗██╗███╗   ██╗████████╗ ██████╗ ██████╗ ██████╗ ██████╗ 
██╔═══██╗██╔════╝██║████╗  ██║╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗
██║   ██║███████╗██║██╔██╗ ██║   ██║   ██║     ██║   ██║██████╔╝██║  ██║
██║   ██║╚════██║██║██║╚██╗██║   ██║   ██║     ██║   ██║██╔══██╗██║  ██║
╚██████╔╝███████║██║██║ ╚████║   ██║   ╚██████╗╚██████╔╝██║  ██║██████╔╝
 ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝     v${packagejson.version}
=============\t\t\t$MODE MODE\t\t\t=============`;
