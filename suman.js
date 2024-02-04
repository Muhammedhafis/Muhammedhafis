const { create, decryptMedia } = require('@adiwajshing/baileys');
const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const { Configuration, OpenAIApi } = require('openai');
const qrcode = require('qrcode-terminal');
const express = require('express');

let setting = require('./api.json');
const BOT_NAME = process.env.BOT_NAME ?? 'hafis';

// Create an Express app for serving the QR code
const app = express();
const port = 3000; // Change this port as needed

// Create an instance of the WhatsApp client
const client = create();

// Function to generate the WhatsApp QR code
const generateQRCode = async () => {
  const qrContent = await client.generateLinkForQRCode();
  qrcode.generate(qrContent, { small: true });
};

// Function to handle incoming WhatsApp messages
const handleMessage = async (m, chatUpdate, store) => {
  // ... Your existing message handling logic here ...

  if (setting.autoAI) {
    // ... Your existing AI chat functionality ...
  }

  if (!setting.autoAI) {
    if (isCmd2) {
      switch (command) {
        case 'ai':
          // ... Your existing AI command handling ...
          break;
        default:
          // ... Your existing default command handling ...
      }
    }
  }
};

// Start the WhatsApp client and handle incoming messages
const startClient = async () => {
  client.ev.on('qr', (qr) => {
    generateQRCode(); // Generate and display the QR code when needed
  });

  client.ev.on('open', () => {
    console.log(chalk.green('Connected to WhatsApp!'));
  });

  client.ev.on('message-new', async (m, chatUpdate, store) => {
    await handleMessage(m, chatUpdate, store);
  });

  await client.connect({ timeoutMs: 60 * 1000 });
};

// Start the Express app to serve the QR code
const startServer = () => {
  app.get('/qr', (req, res) => {
    generateQRCode(); // Generate the QR code on-demand
    const qrImagePath = 'qrcode.png'; // Change this to your desired path and filename
    res.sendFile(qrImagePath, { root: __dirname });
  });

  app.listen(port, () => {
    console.log(`QR code server is running at http://localhost:${port}`);
  });
};

// Call the functions to start the WhatsApp client and Express server
startClient();
startServer();

// Reload the module on file changes
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});

module.exports = sansekai = async (client, m, chatUpdate, store) => {
    try {
        var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        var budy = (typeof m.text == 'string' ? m.text : '')
        // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
        var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
        const isCmd2 = body.startsWith(prefix)
        const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)
        const pushname = m.pushName || "No Name"
        const botNumber = await client.decodeJid(client.user.id)
        const itsMe = m.sender == botNumber ? true : false
        let text = q = args.join(" ")
        const arg = budy.trim().substring(budy.indexOf(' ') + 1)
        const arg1 = arg.trim().substring(arg.indexOf(' ') + 1)

        console.log(m);

        const from = m.chat
        const reply = m.reply
        const sender = m.sender
        const mek = chatUpdate.messages[0]

        const color = (text, color) => {
            return !color ? chalk.green(text) : chalk.keyword(color)(text)
        }

        // Group
        const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch(e => { }) : ''
        const groupName = m.isGroup ? groupMetadata.subject : ''

        // Push Message To Console
        let argsLog = (budy.length > 30) ? `${q.substring(0, 30)}...` : budy

        if (setting.autoAI) {
            // Push Message To Console && Auto Read
            if (argsLog && !m.isGroup) {
                // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`))
            } else if (argsLog && m.isGroup) {
                // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`), chalk.blueBright('IN'), chalk.green(groupName))
            }
        } else if (!setting.autoAI) {
            if (isCmd2 && !m.isGroup) {
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`))
            } else if (isCmd2 && m.isGroup) {
                console.log(chalk.black(chalk.bgWhite('[ LOGS ]')), color(argsLog, 'turquoise'), chalk.magenta('From'), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace('@s.whatsapp.net', '')} ]`), chalk.blueBright('IN'), chalk.green(groupName))
            }
        }





        if (setting.autoAI) {
            if (budy) {
                try {
                    if (setting.keyopenai === 'ISI_APIKEY_OPENAI_DISINI') return reply('Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys')
                    const configuration = new Configuration({
                        apiKey: setting.keyopenai,
                    });
                    const openai = new OpenAIApi(configuration);

                    let prompt_template =
                        "I am artificial intelligence " +
                        BOT_NAME +
                        " developed by a hafis (Online Hacking).\n\nHuman: Hi. How are you?\n" +
                        BOT_NAME +
                        ": I'm well. How can I help you?\nHuman: " +
                        budy +
                        "\n" +
                        BOT_NAME +
                        ": ";

                    const response = await openai.createCompletion({
                        model: "text-davinci-003",
                        prompt: prompt_template,
                        temperature: 0.9,
                        max_tokens: 3000,
                        top_p: 1,
                        frequency_penalty: 0.0,
                        presence_penalty: 0.6,
                    });
                    m.reply(`${response.data.choices[0].text}\n\n`)
                } catch (err) {
                    console.log(err)
                    m.reply('I am getting API Update right now. Please hold on anc check back in a while.')
                }
            }
        }

        if (!setting.autoAI) {
            if (isCmd2) {
                switch (command) {
                    case 'ai':
                        try {
                            if (setting.keyopenai === 'ISI_APIKEY_OPENAI_DISINI') return reply('Api key has not been filled in\n\nPlease fill in the apikey first in the key.json file\n\nThe apikey can be created in website: https://beta.openai.com/account/api-keys')
                            if (!text) return reply(`Chat dengan AI.\n\nContoh:\n${prefix}${command} Apa itu resesi`)
                            const configuration = new Configuration({
                                apiKey: setting.keyopenai,
                            });
                            const openai = new OpenAIApi(configuration);

                            const response = await openai.createCompletion({
                                model: "text-davinci-003",
                                prompt: text,
                                temperature: 0.3,
                                max_tokens: 3000,
                                top_p: 1.0,
                                frequency_penalty: 0.0,
                                presence_penalty: 0.0,
                            });
                            m.reply(`${response.data.choices[0].text}\n\n`)
                        } catch (err) {
                            console.log(err)
                            m.reply('Maaf, sepertinya ada yang error')
                        }
                        break
                    default: {

                        if (isCmd2 && budy.toLowerCase() != undefined) {
                            if (m.chat.endsWith('broadcast')) return
                            if (m.isBaileys) return
                            if (!(budy.toLowerCase())) return
                            if (argsLog || isCmd2 && !m.isGroup) {
                                // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                                console.log(chalk.black(chalk.bgRed('[ ERROR ]')), color('command', 'turquoise'), color(argsLog, 'turquoise'), color('tidak tersedia', 'turquoise'))
                            } else if (argsLog || isCmd2 && m.isGroup) {
                                // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
                                console.log(chalk.black(chalk.bgRed('[ ERROR ]')), color('command', 'turquoise'), color(argsLog, 'turquoise'), color('tidak tersedia', 'turquoise'))
                            }
                        }
                    }
                }
            }
        }

    } catch (err) {
        m.reply(util.format(err))
    }
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})
