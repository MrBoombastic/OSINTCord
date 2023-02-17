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

- By using binaries:
    - Download binary from [Releases](https://github.com/MrBoombastic/OSINTCord/releases) tab.
    - Fill in the `config.json` file.
        - `guildID`: The guild ID you want to get data from.
        - `channelID`: The channel ID, which also will be used to get data from.
        - `spacing`: Spacing between columns in output file.
        - `token`: Your Discord account token.
        - `delay`: Delay between *some* requests.
    - Run the binary.
- By using source code:
    - Clone this repository.
    - Make sure that you have Node.JS v16+ installed.
    - Install dependencies by `yarn`.
    - Fill in the `config.json` file as above and place it in `src` directory.
    - Run `node src/index.js`.

## Worth reading:

- https://github.com/aiko-chan-ai/discord.js-selfbot-v13/blob/main/Document/FetchGuildMember.md
