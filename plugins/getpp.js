const { cmd } = require("../command");

cmd({
  pattern: "getpp",
  alias: ["xpp"],
  use: "pp",
  desc: "Get profile picture of a user (replied user in group, or DM user)",
  category: "tools",
  react: "✅",
  filename: __filename
},
async (conn, mek, m, { from, sender, reply, isGroup }) => {
  try {
    const quotedMsg = mek.message?.extendedTextMessage?.contextInfo?.participant;
    const quotedKey = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    let targetJid;

    if (isGroup) {
      if (quotedMsg && quotedKey) {
        targetJid = quotedMsg;
      } else {
        return reply("❌ Please reply to someone's message to get their profile picture.");
      }
    } else {
      targetJid = from.endsWith("@s.whatsapp.net") ? from : sender;
    }

    let imageUrl;
    try {
      imageUrl = await conn.profilePictureUrl(targetJid, 'image');
    } catch {
      imageUrl = "https://i.ibb.co/7BjSBVP/jpg.jpg";
    }

    const fakeVCard = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "‎☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘︎✅",
          vcard: "BEGIN:VCARD\nVERSION:3.0\nFN: ‎🅑︎🅞︎🅨︎🅚︎🅐︎-🅧︎🅓︎✅\nORG: ‎🅑︎🅞︎🅨︎🅚︎🅐︎-🅧︎🅓︎;\nTEL;type=CELL;type=VOICE;waid=263777756184:+263 73 8403 205\nEND:VCARD",
          jpegThumbnail: Buffer.from([])
        }
      }
    };

    await conn.sendMessage(from, {
      image: { url: imageUrl },
      caption: `✅ ᴘʀᴏғɪʟᴇ ᴘɪᴄᴛᴜʀᴇ ᴏғ @${targetJid.split('@')[0]}`,
      contextInfo: {
        mentionedJid: [targetJid],
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘",
          newsletterJid: "120363347365643318@newsletter"
        }
      }
    }, { quoted: fakeVCard });

  } catch (err) {
    console.error("Error in getpp:", err);
    reply("❌ Failed to fetch profile picture.");
  }
});
      
