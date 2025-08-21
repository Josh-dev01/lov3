const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

cmd({
  pattern: "ad",
  alias: ["adedit"],
  react: '📸',
  desc: "Scan and remove bg from images",
  category: "img_edit",
  use: ".ad [reply to image]",
  filename: __filename
}, async (conn, message, m,  { reply, mek }) => {
  try {
    // Check if quoted message exists and has media
    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
    
    if (!mimeType || !mimeType.startsWith('image/')) {
      return reply("*ᴘʟᴇᴀsᴇ ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ ғɪʟᴇ (ᴊᴘᴇɢ/ᴘɴɢ)*");
    }

    // Download the media
    const mediaBuffer = await quotedMsg.download();
    const fileSize = formatBytes(mediaBuffer.length);
    
    // Get file extension based on mime type
    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else {
      return reply("*ᴜɴsᴜᴘᴘᴏʀᴛᴇᴅ ɪᴍᴀɢᴇ ғᴏʀᴍᴀᴛ. ᴘʟᴇᴀsᴇ ᴜsᴇ ᴊᴘᴇɢ ᴏʀ ᴘɴɢ*");
    }

    const tempFilePath = path.join(os.tmpdir(), `imgscan_${Date.now()}${extension}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // Upload to Catbox
    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(tempFilePath), `image${extension}`);
    form.append('reqtype', 'fileupload');

    const uploadResponse = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    const imageUrl = uploadResponse.data;
    fs.unlinkSync(tempFilePath); // Clean up temp file

    if (!imageUrl) {
      throw "Failed to upload image to Catbox";
    }

    // Scan the image using the API
    const apiUrl = `https://api.popcat.xyz/v2/ad?image=${encodeURIComponent(imageUrl)}`;
    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("*ᴇʀʀᴏʀ: ᴛʜᴇ ᴀᴘɪ ᴅɪᴅ ɴᴏᴛ ʀᴇᴛᴜʀɴ ᴀ ᴠᴀʟɪᴅ ɪᴍᴀɢᴇ. ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ*");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `> *𝗣𝗢𝗪𝗘𝗥𝗘𝗗 𝗕𝗬 ‎☘🆃︎🅴︎🅻︎🅺︎🅸︎🅽︎🅶︎☘*`
    });

  } catch (error) {
    console.error("Ad Error:", error);
    reply(`An error occurred: ${error.response?.data?.message || error.message || "Unknown error"}`);
  }
});
