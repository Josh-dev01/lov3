const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363347365643318@newsletter',
            newsletterName: '‎🅑︎🅞︎🅨︎🅚︎🅐︎ 🅧︎🅓︎',
            serverMessageId: 143,
        },
    };
};

const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
];

const GroupEvents = async (conn, update) => {
    try {
        const isGroup = isJidGroup(update.id);
        if (!isGroup) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const desc = metadata.desc || "No Description";
        const groupMembersCount = metadata.participants.length;

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = new Date().toLocaleString();

            let ppUrl;
            // Pata picha ya mtumiaji
            try {
                ppUrl = await conn.profilePictureUrl(num, 'image');  // Picha ya mtumiaji
            } catch {
                // Ikiwa hakuna picha ya mtumiaji, tumia picha ya kundi
                try {
                    ppUrl = await conn.profilePictureUrl(update.id, 'image');
                } catch {
                    ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];
                }
            }

            if (update.action === "add" && config.WELCOME === "true") {
                const WelcomeText = `╭━ 「 *\`‎🅑︎🅞︎🅨︎🅚︎🅐︎ 🅧︎🅓︎\`* 」
┃ ⥤ *ʜɪ ᴅᴇᴀʀ* : @${userName}
┃⥤ *ᴀᴜᴛʜᴏʀ* : *‎✦ᴛᴇʟᴋɪɴɢ✦*
┃⥤ *ɴᴜᴍʙᴇʀ* : *#${groupMembersCount}*
┃⥤ *ᴛɪᴍᴇ* : *${timestamp}*
┃⥤ *ᴍᴜʟᴛɪ ᴅᴇᴠɪᴄᴇ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ*
╰━━━━━━━━━━━━━━━━━━➤
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: WelcomeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "remove" && config.WELCOME === "true") {
                const GoodbyeText = `╭━ 「 *\`‎🅑︎🅞︎🅨︎🅚︎🅐︎ 🅧︎🅓︎\`* 」
┃ ⥤ *ʙʏᴇ ᴅᴇᴀʀ* : @${userName}
┃⥤ *ᴀᴜᴛʜᴏʀ* : *‎✦ᴛᴇʟᴋɪɴɢ✦*
┃⥤ *ɴᴜᴍʙᴇʀ* : *#${groupMembersCount}*
┃⥤ *ᴛɪᴍᴇ* : *${timestamp}*
┃⥤ *ᴍᴜʟᴛɪ ᴅᴇᴠɪᴄᴇ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ*
╰━━━━━━━━━━━━━━━━━━➤
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘*`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: GoodbyeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                const demoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: `${config.PREFIX}promote @${m.sender.split("@")[0]}`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                const promoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: `${config.PREFIX}demote @${m.sender.split("@")[0]}`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
