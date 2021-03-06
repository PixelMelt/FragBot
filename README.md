# FragBot
A hypixel skyblock bot that allows a user to run dungeons without a party. There are whitelist and blacklisting options to share the bot with your friends or guildmates.

# New hypixel changes
While the bot still works, due to the new changes to limbo the bot may get stuck and not be able to recieve party invites, it will try to fix this itself but if it fails you may need to run the `fix` command. (see bottom of readme for commands)

# Setup
To use this bot in perticular you need... 

#1 An alt account in the same hypixel guild as you. (could be changed in later updates, make an issue request if you would like party funtionality to be implemented)

#2 Nodejs and NPM installed on your computer.

#3 Intelligence.

# Prerequisites and Install

Git clone this repository.  -  `git clone https://github.com/PixelMelt/FragBot.git`

Change directory into the cloned repository.  -  `cd FragBot/src`

Install the npm package mineflayer.  -  `npm i mineflayer`

Fill out config.json with your alt accounts information and other customisations.

run index.js  -  `node index.js`

# Configuration

There are a few things you can customize about this frag bot. They are all located in the config.json file.

email - The email for your alt account.

password - The password for your alt account.

owner - The user who can whitelist/blacklist any player from using the bot.

intro1 - The first message the bot sends when joining a party.

intro2 - The second message the bot sends when joining a party.

warpmessage - The message that the bot will send if the party is warped.

timeinparty - The amount of time the bot will spend in the party before leaving.

prefix - The prefix the bot uses to determine what commands are for example if you changed the prefix to `123` to run help you would type `123 help`.

debug - You will most lkely not need to turn this on and if you do turn it on you probably know what you are doing anyways.

# Using the bot

**The bot will ONLY respond to commands sent in guild chat**

The default prefix for this bot is `frag` if you have not changed it please use that before commands

Commands the bot responds to are as follows:

<prefix> help  -  Prints out a help menu. The contents of the menu change based on if you are specified as the owner in the config file.

<prefix> blacklist <player>  -  This owner only command will remove the specified user from the whitelist. Users not whitelisted are automaticly blacklisted.

<prefix> whitelist <player>  -  This owner only command will add the specified user to the whitelist. Allowing them to party the bot at any time.

<prefix> whitelist me  -  This command is avalable to anyone in your guild and will add the user who invokes it to the whitelist. Allowing them to party the bot at any time.

<prefix> fix  -  This command is avalable to anyone in your guild and will attempt to get the bot un stuck from limbo.
  
  
# Example usage
  
![Example of a user using the bot](https://raw.githubusercontent.com/PixelMelt/FragBot/main/usagepic.png)
 
