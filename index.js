const mineflayer = require('mineflayer')

const config = require('./config.json')
var DB = require('./jsonPull.js');

function createBot(){
    var partystatus = "disbanded"
    
    const bot = mineflayer.createBot({
        host: 'proxy.hypixel.net',
        port: '25565',
        version: '1.12.2',
        username: config.email,
        password: config.password,
        logErrors: true
    })
    
    console.log(`Log > I joined hypixel`)
    
    bot.addChatPatternSet(
        "GUILD_MESSAGE",
        [/^Guild > (?:\[(.+\+?\+?)\] )?(.+): (.+)$/],
        {
            parse: true
        }
    )
    
    bot.addChatPatternSet(
        "PRIVATE_MESSAGE",
        [/^From (?:\[(.+\+?\+?)\] )?(.+): (.+)$/],
        {
            parse: true
        }
    )
    
    bot.addChatPatternSet(
        "PARTY_ACCEPT",
        [/^(?:\[(.+\+?\+?)\] )?(.+) joined the party./],
        {
            parse: true
        }
    )
    
    bot.addChatPatternSet(
        "PARTY_INVITE",
        [/^-----------------------------\n(?:\[(.+\+?\+?)\] )?(.+) has invited you to join their party!\nYou have 60 seconds to accept. Click here to join!\n-----------------------------/],
        {
            parse: true
        }
    )
    
    bot.addChatPatternSet(
        "PARTY_WARP",
        [/^Party Leader, (?:\[(.+\+?\+?)\] )?(.+), summoned you to their server./],
        {
            parse: true
        }
    )
    
    function waity(seconds){
        var waitTill = new Date(new Date().getTime() + seconds * 1000);
        while(waitTill > new Date()){}
    }
    
    // debuger
   
    if(config.debug == "on"){
        bot.on('message', (jsonMsg) => {
            console.log(`Debug > ${jsonMsg.toString()}`)
        })
    }
    
    function leaveparty() {
        bot.chat(`/p leave`)
        console.log(`Log > Left the party`)
        partystatus = "disbanded"
    }
    function returntohub() {
        waity(5)
        console.log(`Log > Returnung to limbo`)
        bot.chat(`/achat §c`)
    }
    
    bot.on('chat:PARTY_WARP', ([[rank, username]]) => {
        if(bot.username == username){return}
        if(!rank){rank = "Non"};
        waity(0.2)
        bot.chat(`/msg ${username} ${config.warpmessage}`)
        console.log(`Log > ${username} tried to warp the party`)
        waity(0.2)
        leaveparty()
        returntohub()
    })
    
    bot.on('chat:PARTY_INVITE', ([[rank, username]]) => {
        if(bot.username == username){return}
        if(!rank){rank = "Non"};
        
        if(DB.GetUser(username.toLowerCase())){
            if(partystatus == "busy"){
                waity(0.2)
                console.log(`Log > [${rank}] ${username} sent me a party invite but I was busy`);
                bot.chat(`/msg ${username} Hi ${username}. I am currently in a party, please try again in a moment.`)
            }else{
                console.log(`Log > [${rank}] ${username} sent me a party invite`);
                bot.chat(`/p accept ${username}`);
                partystatus = "busy"
                console.log(`Log > I accepted the invite`)
                waity(0.2)
                console.log(`Log > Begin intro`)
                bot.chat(`/pc ${config.intro1}`)
                waity(0.2)
                bot.chat(`/pc ${config.intro2}`)
                console.log(`Log > End intro`)
                waity(0.5)
                bot.chat(`/pc I will be leaving this party in ${config.timeinparty} seconds...`)
                setTimeout(leaveparty, config.timeinparty*100);
                returntohub()
            }
        }else{
            waity(0.2)
            bot.chat(`/msg ${username} You are not whitelisted, please contact ${config.owner} if you think this is an error.`)
            return
        }
    })
    
    bot.on('chat:GUILD_MESSAGE', ([[rank, username, message]]) => {
        if(!rank){rank = "Non"};
        username = username.replace(/.(\[.+\])/,'') //removes roles
        username = username.replace(/(:.*)/,'') //removes weird colon and username thing
        // console.log(`Guild > [${rank}] ${username}: ${message}`);
        
        if (message == `${config.prefix} ireadthecode`) {
            bot.chat(`/msg ${username} you sure did!`);
            console.log(`Log > ${username} read the code!`);
        }

        if(message == `${config.prefix} help`){
            if(username.toLowerCase() == config.owner.toLowerCase()){
                console.log(`Log > ${username} asked for owner help`)
                bot.chat(`/gc ----------Commands----------- "`)
                waity(0.1)
                bot.chat(`/gc ${config.prefix} whitelist me: whitelist yourself.`)
                waity(0.1)
                bot.chat(`/gc ${config.prefix} blacklist <player>: removes the given player from the whitelist`)
                waity(0.1)
                bot.chat(`/gc ${config.prefix} whitelist <player>: adds the given player to the whitelist`)
                waity(0.1)
                bot.chat(`/gc -----------------------------`)
            }else{
                bot.chat(`/gc ----------Commands-----------`)
                waity(0.1)
                bot.chat(`/gc ${config.prefix} whitelist me: whitelist yourself.`)
                waity(0.1)
                bot.chat(`/gc -----------------------------`)
                console.log(`Log > ${username} asked for help`)
            }
        }

        if(message == `${config.prefix} whitelist me`){
            if(DB.GetUser(username)){
                bot.chat(`/gc ${username} is already whitelisted`)
                console.log(`Log > ${username} asked to be whitelisted but already was`)
                return
            }else{
                DB.AddUser(username.toLowerCase(), "w")
                bot.chat(`/gc ${username} is now whitelisted`)
                console.log(`Log > ${username} asked to be whitelisted and was`)
            }
        }else{
            if(message.startsWith(`${config.prefix} whitelist `)){
                if(username.toLowerCase() == config.owner.toLowerCase()){
                    message = message.replace(/^[^\s]+./,'')
                    message = message.replace(/whitelist /,'').toLowerCase()
                    if(DB.GetUser(message)){
                        bot.chat(`/gc ${message} is already whitelisted`)
                        console.log(`Log > ${config.owner} asked for ${message} to be whitelisted but they already were`)
                        return
                    }else{
                        DB.AddUser(message.replace(/${prefix} whitelist /,'').toLowerCase(), "w")
                        console.log(`Log > ${config.owner} asked for ${message} to be whitelisted and they were`)
                        bot.chat(`/gc ${message} is now whitelisted`)
                    }
                }
            }
        }

        if(message.startsWith(`${config.prefix} blacklist `)){
            if(username.toLowerCase() == config.owner.toLowerCase()){
                message = message.replace(/^[^\s]+./,'')
                message = message.replace(/blacklist /,'').toLowerCase()
                if(DB.GetUser(message)){
                    DB.RemoveUser(message).toLowerCase()
                    bot.chat(`/gc ${message} is now blacklisted`)
                    console.log(`Log > ${config.owner} asked for ${message} to be blacklisted and they were`)
                }else{
                    bot.chat(`/gc ${message} is already blacklisted`)
                    console.log(`Log > ${config.owner} asked for ${message} to be blacklisted but they already were`)
                    return
                }
            }
        }

    })
    
    bot.on('spawn', () => {
        returntohub()
    })

    bot.on('error', (err) => console.log(err))
    bot.on('end', createBot)
}

createBot();
