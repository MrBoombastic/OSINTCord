```
 ██████╗ ███████╗██╗███╗   ██╗████████╗ ██████╗ ██████╗ ██████╗ ██████╗ 
██╔═══██╗██╔════╝██║████╗  ██║╚══██╔══╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗
██║   ██║███████╗██║██╔██╗ ██║   ██║   ██║     ██║   ██║██████╔╝██║  ██║
██║   ██║╚════██║██║██║╚██╗██║   ██║   ██║     ██║   ██║██╔══██╗██║  ██║
╚██████╔╝███████║██║██║ ╚████║   ██║   ╚██████╗╚██████╔╝██║  ██║██████╔╝
 ╚═════╝ ╚══════╝╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝
 
 Just get data of (nearly) all of Discord guild members.
```

## Usage:

- By using binaries (experimental = using old dependencies):
    - Download binary from "Releases" tab.
    - Fill in the `config.json` file.
        - `guildID`: The guild ID you want to get data from.
        - `channelID`: The channel ID, which also will be used to get data from.
        - `spacing`: Spacing between columns in output file.
        - `token`: Your Discord account token.
        - `delay`: Delay between *some* requests.
    - Run the binary.
- By using source code:
    - Clone this repository.
    - Make sure that you have Node.JS v17+ installed.
    - **IMPORTANT**: In `package.json` REPLACE `"discord.js-selfbot-v13": "2.8.14"`
      with `"discord.js-selfbot-v13": "2.10.5""` (this is
      a temporary solution, until `vercel/pkg` will finally support ESM).
    - Install dependencies by `npm i`.
    - Fill in the `config.json` file as above and place it in `src` directory.
    - Run `node src/index.js` in the cloned directory.

## Worth reading

- https://github.com/aiko-chan-ai/discord.js-selfbot-v13/blob/main/Document/FetchGuildMember.md