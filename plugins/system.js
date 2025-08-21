
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');
const pkg = require('../package.json');

cmd({
    pattern: "uptime",
    alias: ["runtime", "run"],
    desc: "Show bot uptime with stylish formats",
    category: "main",
    react: "❇️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const uptime = runtime(process.uptime());
        const seconds = Math.floor(process.uptime());
        const startTime = new Date(Date.now() - seconds * 1000);
        const version = pkg.version || "1.0.0";

        const styles = [
`╭──『 *\`‎✦𝗕𝗢𝗬𝗞𝗔 𝗫𝗗✦\`* 』
│ ⏱️ ${uptime}
│ 🧭 ${seconds} seconds
│ 🚀 Started: ${startTime.toLocaleString()}
╰──────────────⭑─➤
> *𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘*`,

`╭─ 「 *\`‎✦𝗕𝗢𝗬𝗞𝗔 𝗫𝗗✦\`* 」
│♢ ʀᴜɴɴɪɴɢ: ${uptime}
│♢ sᴇᴄᴏɴᴅs: ${seconds}
│♢ sɪɴᴄᴇ: ${startTime.toLocaleDateString()}
╰──────────────⭑─➤
> *𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘*`,

`╭─ 「 *\`‎🅑︎🅞︎🅨︎🅚︎🅐︎ 🅧︎🅓︎\`* 」
│ • ᴛɪᴍᴇ: ${uptime}
│ • sᴇᴄᴏɴᴅs: ${seconds}
│ • sᴛᴀʀᴛᴇᴅ: ${startTime.toLocaleString()}
╰━━━━━━━━━━━━━━⭑━➤
> *𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘*`,

`╭─ 「 *\`‎✦𝗕𝗢𝗬𝗞𝗔 𝗫𝗗✦\`* 」
│ ⏳ ${uptime}
│ 🕰️ ${startTime.toLocaleString()}
│ 🔢 ${seconds} sᴇᴄᴏɴᴅs
╰──────────────⭑─➤
> *𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘*`,

`
╭─ 「 *\`‎✦𝗕𝗢𝗬𝗞𝗔 𝗫𝗗✦\`* 」
│  ʀᴜɴᴛɪᴍᴇ: ${uptime}
│  sᴇᴄᴏɴᴅs:: ${seconds}
│  sɪɴᴄᴇʀᴇʟʏ: ${startTime.toLocaleString()}
╰━━━━━━━━━━━━━━⭑━➤
> *𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘*`,

`> ╭━ 「 *\`‎✦𝗕𝗢𝗬𝗞𝗔 𝗫𝗗✦\`* 」
> ┃🟢 ᴏɴʟɪɴᴇ ғᴏʀ: ${uptime}
> ┃🔢 sᴇᴄᴏɴᴅs: ${seconds}
> ┃📅 sɪɴᴄᴇ: ${startTime.toLocaleString()}
> ╰━━━━━━━━━━━━━━⭑━➤
> *𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘*`,

`╭─ 「 *\`‎✦𝗕𝗢𝗬𝗞𝗔 𝗫𝗗✦\`* 」
│◈ ᴅᴜʀᴀᴛɪᴏɴ: ${uptime}
│◈ sᴇᴄᴏɴᴅs: ${seconds}
│◈ sᴛᴀʀᴛ ᴛɪᴍᴇs: ${startTime.toLocaleString()}
│◈ sᴛᴀʙɪʟɪᴛʏ: 100%
╰────────────────❂
> *𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘*`
        ];

        let selectedStyle;
        if (args[0] && args[0].toLowerCase().startsWith("style")) {
            const index = parseInt(args[0].replace("style", "")) - 1;
            if (!isNaN(index) && styles[index]) {
                selectedStyle = styles[index];
            } else {
                return reply(`❌ Style not found.\n✅ Use: style1 to style${styles.length}`);
            }
        } else {
            selectedStyle = styles[Math.floor(Math.random() * styles.length)];
        }

        await conn.sendMessage(from, {
            image: { url: 'https://i.ibb.co/tp3jnw3s/jpg.jpg' },
            caption: selectedStyle,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363347365643318@newsletter',
                    newsletterName: 'ʙᴏʏᴋᴀ xᴅ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Uptime Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
