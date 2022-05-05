const { Client, Intents, MessageActionRow, MessageSelectMenu } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const Config = require("./Config.json");//Config読み込み

var request = require('request');

client.login(Config.TOKEN);//DiscordBotログイン

client.on('ready', () => {//コマンド生成
  const data = [{
    name: "Translate",
    type: "MESSAGE"
  }];
  client.application.commands.set(data, Config.ServerID);
  console.log(`login!!(${client.user.tag})`);
});


client.on("interactionCreate", interaction => {

  if (interaction.isContextMenu()) {
    if (interaction.commandName === `Translate`) {
      const message = interaction.options.getMessage("message").content;
      if (message == "") {
        interaction.reply({ content: "そのメッセージは翻訳できません" });
        return;
      }
      const row = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
            .setCustomId('translate')
            .setPlaceholder('言語を選んでください')
            .addOptions([
              {
                label: '英語へ翻訳',
                description: 'EN',
                value: 'en',
              },
              {
                label: '日本語へ翻訳',
                description: 'JA',
                value: 'ja',
              },
            ]),
        );
      interaction.reply({ content: message, components: [row] });
      return;
    }
  }

  if (interaction.isSelectMenu()) {
    if (interaction.customId === 'translate') {
      const message = interaction.message.content;
      let options = {
        url: `${Config.Translate_URL}?text=${encodeURI(message)}&target=${interaction.values[0]}`,
        method: 'GET'
      }
      request(options, function (error, response, body) {
        interaction.reply({ content: body });
      })
    }
  }
});