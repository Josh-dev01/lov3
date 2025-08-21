const config = require('../config');
const moment = require('moment-timezone');
const { cmd, commands } = require('../command');
const axios = require('axios');

const smallCaps = {
  "A": "ᴀ",
  "B": "ʙ",
  "C": "ᴄ",
  "D": "ᴅ",
  "E": "ᴇ",
  "F": "ꜰ",
  "G": "ɢ",
  "H": "ʜ",
  "I": "ɪ",
  "J": "ᴊ",
  "K": "ᴋ",
  "L": "ʟ",
  "M": "ᴍ",
  "N": "ɴ",
  "O": "ᴏ",
  "P": "ᴘ",
  "Q": "ǫ",
  "R": "ʀ",
  "S": "s",
  "T": "ᴛ",
  "U": "ᴜ",
  "V": "ᴠ",
  "W": "ᴡ",
  "X": "x",
  "Y": "ʏ",
  "Z": "ᴢ"
};

const toSmallCaps = (text) => {
  return text.split('').map(char => smallCaps[char.toUpperCase()] || char).join('');
};

cmd({
  pattern: "menu",
  alias: ["allmenu", "prince"],
  use: '.menu',
  desc: "Show all bot commands",
  category: "menu",
  react: "💫",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const totalCommands = commands.length;
    const date = moment().tz("America/Port-au-Prince").format("dddd, DD MMMM YYYY");

    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}h ${m}m ${s}s`;
    };

    let menuText = `*╭━━*『✦𝗕𝗢𝗬𝗞𝗔-𝗫𝗗✦』
*┃* ❃ *ᴜsᴇʀ* : @${m.sender.split("@")[0]}
*┃* ❃ *ʀᴜɴᴛɪᴍᴇ* : ${uptime()}
*┃* ❃ *ᴍᴏᴅᴇ* : ${config.MODE}
*┃* ❃ *ᴘʀᴇғɪx* : [${config.PREFIX}]
*┃* ❃ *ᴩʟᴜɢɪɴ* : ${totalCommands}
*┃* ❃ *ᴅᴇᴠ* : *\`‎☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘\`*
*┃* ❃ *ᴠᴇʀsɪᴏɴs* : 2.0.0
*╰────────────────❍*
`;

    let category = {};
    for (let cmd of commands) {
      if (!cmd.category) continue;
      if (!category[cmd.category]) category[cmd.category] = [];
      category[cmd.category].push(cmd);
    }

    const keys = Object.keys(category).sort();
    for (let k of keys) {
      menuText += `\n*╭─ 「 \`${k.toUpperCase()} MENU\`* 」`;
      const cmds = category[k].filter(c => c.pattern).sort((a, b) => a.pattern.localeCompare(b.pattern));
      cmds.forEach((cmd) => {
        const usage = cmd.pattern.split('|')[0];
        menuText += `\n*│⤷ ${config.PREFIX}${toSmallCaps(usage)}*`;
      });
      menuText += `\n*╰──────────────⭑━➤*`;
    }

    const selectedStyle = menuText;

    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/f5is4e.jpeg' },
      caption: selectedStyle,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363347365643318@newsletter',
          newsletterName: '‎🅑︎🅞︎🅨︎🅚︎🅐︎ 🅧︎🅓︎︎',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });
    // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/f5is4e.jpeg' },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text');
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        // Function to send menu audio with timeout
        const sendMenuAudio = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay after image
                await conn.sendMessage(from, {
                    audio: { url: 'https://files.catbox.moe/vpnqp7.mp3' },
                    mimetype: 'audio/mp4',
                    ptt: true,
                }, { quoted: mek });
            } catch (e) {
                console.log('Audio send failed, continuing without it');
            }
        };

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
