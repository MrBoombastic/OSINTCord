![Logo.png](banner.png)
[![CodeFactor](https://codefactor.io/repository/github/mrboombastic/osintcord/badge)](https://www.codefactor.io/repository/github/mrboombastic/osintcord)

Just get data of (nearly) all of Discord guild members. Or track deleted and edited messages. Or why not both?

> [!WARNING]  
> I don't take any responsibility for blocked Discord accounts that used this module.
> Using this on a user account is prohibited by the Discord TOS and can lead to the account block.

> [!TIP]
> If you are upgrading from the previous version, please make sure you update the dictionary in the`.env` file.
> [Pomelo](https://discord.fandom.com/wiki/Pomelo) has changed the rules for usernames.

## Usage:

- By using source code:
    - Clone this repository.
    - Make sure that you have Node.js v18 installed.
    - Install dependencies by using `yarn`.
    - Fill in the `.env` file and place it in `src` directory.
    - Run `npm start`.

All results will be stored in the `logs` and `media` directories.

There is no prepacked binary - `pkg`/`yao-pkg` and ESM support state is fucked up beyond all recognition.

## Options:

You can use some default options from the already provided [.env](.env.example) file.

- When you want to dump guild members, set `MODE` to `MEMBERS` and
    - `GUILD_ID`: The guild ID you want to get data from.
    - `SPACING`: Spacing between columns in an output file.
    - `TOKEN`: Your Discord account token.
    - `DELAY`: Delay between *some* requests.
    - `DICTIONARY`: Characters used by the bruteforce method. Case-insensitive, duplicates are ignored, sorted
      alphabetically.
    - `DATE_FORMAT`: format of the parsed date (refer to
      the [Day.js manual](https://day.js.org/docs/en/display/format)).
    - `DATE_LOCALE`: locale used in the parsed
      date ([list of supported locales](https://github.com/iamkun/dayjs/tree/dev/src/locale)).
    - `PREFETCH`: fetch 10 000 members at once. Missing info about presences may occur.
- When you want to trace deleted and edited messages, set `MODE` to `WATCHDOG` and
    - `GUILD_ID`: The guild ID you want to get data from. Set to `all`, if you want to receive data from all available
      guilds.
    - `TOKEN`: Your Discord account token.

## FAQ:

- Q: I'm getting `GUILD_MEMBERS_TIMEOUT` errors. Help!<br>A: Increase `delay` time in config.

## Worth reading:

- https://github.com/Merubokkusu/Discord-S.C.U.M/blob/master/docs/using/fetchingGuildMembers.md
