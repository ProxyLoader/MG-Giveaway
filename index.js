const express = require('express')
const app = express();
const port = 3000
app.get('/', (req, res) => res.send('MEGA GIVEAWAYS'))

app.listen(port, () =>
console.log('Connected')
           
);


const Discord = require('discord.js');
const client = new Discord.Client();

const { MessageEmbed } = require("discord.js");
const ms = require('ms') // make sure package ms is downloaded in console, to do this, simply type:   npm i ms     in your terminal
      const prefix = "mg/" // this can be any prefix you want

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
  client.user.setActivity("⚡｜giveaway | " + prefix + "ghelp");
});

client.on("message", async message => {
    let args = message.content.substring(prefix.length).split(" ")

    if ((message.content.startsWith(`${prefix}giveaway`)) || message.content.startsWith(prefix + "start")) { // this condition can be changed to any command you'd like, e.g. `${prefix}gstart`
        if (message.member.hasPermission("ADMINSTRATOR")) { // user must have a role named Giveaway to start giveaway
        let duration = args[1];
        let winnerCount = args[2];

        if (!duration) 
            return message.channel.send('**Please provide a duration for the giveaway!\nThe abbreviations for units of time are: `d (days), h (hours), m (minutes), s (seconds)`**');
        if (
            !args[1].endsWith("d") &&
            !args[1].endsWith("h") &&
            !args[1].endsWith("m") &&
            !args[1].endsWith("s") 
        )
            return message.channel.send('**Please provide a duration for the giveaway!\nThe abbreviations for units of time are: `d (days), h (hours), m (minutes), s (seconds)`**');

        if (!winnerCount) return message.channel.send('**Please provide the number of winners for the giveaway! E.g. `1w`**')

        if (isNaN(args[2].toString().slice(0, -1)) || !args[2].endsWith("w")) // if args[2]/winnerCount is not a number (even after removing end 'w') or args[2] does not end with 'w', condition returns:
            return message.channel.send('**Please provide the number of winners for the giveaway! E.g. `3w`**');
                if ((args[2].toString().slice(0, -1)) <= 0)   
                    return message.channel.send('**The number of winners cannot be less than 1!**');

            let giveawayChannel = message.mentions.channels.first();
            if (!giveawayChannel || !args[3]) return message.channel.send("**Please provide a valid channel to start the giveaway!**")

            let prize = args.slice(4).join(" ");
            if (!prize) return message.channel.send('**Please provide a prize to start the giveaway!**');

            let startGiveawayEmbed = new Discord.MessageEmbed()
                .setTitle("🎉 || " + prize + " || 🎉")
                .setDescription(`**React with 🎉 to participate in the giveaway!\nWinners: ${winnerCount.toString().slice(0, -1)}\nTime Remaining: ${duration}\nHosted By: ${message.author}**`)
                .setColor('RANDOM')
                .setTimestamp(Date.now() + ms(args[1])) // Displays time at which the giveaway will end
                      
                .setFooter("Giveaway started");
          
            let embedGiveawayHandle = await giveawayChannel.send(startGiveawayEmbed)
            embedGiveawayHandle.react("🎉").catch(console.error); 

            setTimeout(() => {
                if (embedGiveawayHandle.reactions.cache.get("🎉").count <= 1) {
                    return giveawayChannel.send(":x: | **Nobody joined the giveaway :(**")
                }
                if (embedGiveawayHandle.reactions.cache.get("🎉").count <= winnerCount.toString().slice(0, -1)) { // this if-statement can be removed
                    return giveawayChannel.send(":x: | **There's not enough people in the giveaway to satisfy the number of winners!**")
                }

                let winner = embedGiveawayHandle.reactions.cache.get("🎉").users.cache.filter((users) => !users.bot).random(winnerCount.toString().slice(0, -1)); 

                const endedEmbedGiveaway = new Discord.MessageEmbed()
                .setTitle("🎉 GIVEAWAY 🎉")
                .setDescription(`${prize}\n\nWinner(s): ${winner}\nHosted By: **${message.author}**\nWinners: **${winnerCount.toString().slice(0, -1)}**\nParticipants: **${embedGiveawayHandle.reactions.cache.get("🎉").count - 1}**\nDuration: **${duration}**`)
                .setColor('#FFFFFF')
                .setTimestamp(Date.now() + ms(args[1])) // Displays time at which the giveaway ended
                .setFooter("Giveaway ended"); 

                embedGiveawayHandle.edit(endedEmbedGiveaway); // edits original giveaway message to show that the giveaway ended successfully

                const congratsEmbedGiveaway = new Discord.MessageEmbed()
                .setDescription(`🥳 Congratulations ${winner}! You just won **${prize}**!`)
                .setColor('#FFFFFF')

                giveawayChannel.send(congratsEmbedGiveaway).catch(console.error); 
            }, ms(args[1]));

        } else {
          message.channel.send("**You dont have permission**")
        } // end "Giveaway" role condition


    } else if(message.content.startsWith(prefix + "ghelp")){
      const lll = new MessageEmbed()
      .setColor("RANDOM")
      .addField("🎉 Giveaway", "| **" + prefix + "giveaway <time> <winners> <#channel> <prize>**")
      .addField("🔥", "| **You can see more about that bot by react with emoji blow**")

      message.channel.send(lll).then(msg => {
        msg.react("🎉")
        let reactionFilter = (reaction, user) =>
        reaction.emoji.name == "🎉" && user.id == message.author.id;

        let reactionXXX = msg.createReactionCollector(reactionFilter)
        reactionXXX.on("collect", v =>{
            const llll = new MessageEmbed()
      .setColor("RANDOM")
      .addField("🧿 About" , "**That bot its developed and compiled by ByteBuf, react with 🧿**")
        msg.edit(llll).then(sage =>{
          sage.react("🧿")
          let sageFilter = (reaction, user) =>
            reaction.emoji.name == "🧿" && user.id == message.author.id;
          let sageReact = sage.createReactionCollector(sageFilter)

          sageReact.on("collect", s =>{
                        const lllll = new MessageEmbed()
      .setColor("RANDOM")
      .addField("🧿 Products" , "**More products find it when you dm ByteBuf#3270**")
            sage.edit(lllll)
          })
        })
        })
      })
    }
});

client.login(process.env.TOKEN);
