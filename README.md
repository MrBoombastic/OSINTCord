![img.png](img.png)
[![CodeFactor](https://www.codefactor.io/repository/github/mrboombastic/osintcord/badge)](https://www.codefactor.io/repository/github/mrboombastic/osintcord)

Just get data of (nearly) all of Discord guild members.

## Warning:

This app uses [fork of discord.js-selfbot-v13](https://github.com/MrBoombastic/discord.js-selfbot-v13/tree/old-deps).

"I don't take any responsibility for blocked Discord accounts that used this module.
Using this on a user account is prohibited by the Discord TOS and can lead to the account block."

## Usage:

- By using binaries:
  - Download binary from [Releases](https://github.com/MrBoombastic/OSINTCord/releases) tab.
  - Fill in the `config.json` file.
  - Run the binary.
- By using source code:
  - Clone this repository.
  - Make sure that you have Node.JS v18 installed.
  - Install dependencies by using `yarn`.
  - Fill in the `config.json` file and place it in `src` directory.
  - Run `npm start`.

## Options:

You can use some default options from [config.example.json](config.example.json).

- `guildID`: The guild ID you want to get data from.
- `channelID`: The channel ID, which also will be used to get data from.
- `spacing`: Spacing between columns in output file.
- `token`: Your Discord account token.
- `delay`: Delay between *some* requests.
- `dictionary`: Characters used by the bruteforce method. Case-insensitive, duplicates are ignored.
- `dateFormat`: format of the parsed date (refer to the [Day.js manual](https://day.js.org/docs/en/display/format)).
- `dateLocale`: locale used in the parsed
  date ([list of supported locales](https://github.com/iamkun/dayjs/tree/dev/src/locale)).

## FAQ:

- Q: I'm getting `GUILD_MEMBERS_TIMEOUT` errors. Help!<br>A: Increase `delay` time in config.

## Worth reading:

- https://github.com/aiko-chan-ai/discord.js-selfbot-v13/blob/main/Document/FetchGuildMember.md
