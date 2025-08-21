const axios = require("axios");
const { cmd } = require("../command");


cmd({
    pattern: "adult",
    alias: ["adultmenu","nfw"],
    desc: "menu the bot",
    category: "menu",
    react: "🎀",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        let dec = `╭───「 *18+ CMD🔞* 」
├⬡ *.xᴠɪᴅᴇᴏ*
├⬡ *.ᴘᴏʀɴ*
├⬡ *.xᴠɪᴅᴇᴏs*
├⬡ *.ʀᴀɴᴅᴏᴍᴘᴏʀɴ*
├⬡ *.ʀᴀɴᴅᴏᴍxᴠɪᴅᴇᴏ*
╰───────────────❍`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://i.ibb.co/tp3jnw3s/jpg.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363347365643318@newsletter',
                        newsletterName: "☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
