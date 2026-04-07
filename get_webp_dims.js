const fs = require('fs');
const path = require('path');
const dir = 'C:\Users\Usuario\iCloudDrive\Portfolio 2026\00 Código\images';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));
files.forEach(file => {
  const buf = fs.readFileSync(path.join(dir, file));
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buf.toString('ascii', 12, 16);
    let w, h;
    if (chunk === 'VP8 ') {
      w = buf.readUInt16LE(26) & 0x3FFF;
      h = buf.readUInt16LE(28) & 0x3FFF;
    } else if (chunk === 'VP8L') {
      const b0 = buf[17], b1 = buf[18], b2 = buf[19], b3 = buf[20];
      w = 1 + (((b1 & 0x3F) << 8) | b0);
      h = 1 + ((((b3 & 0xF) << 10) | (b2 << 2) | ((b1 & 0xC0) >> 6)));
    } else if (chunk === 'VP8X') {
      w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
      h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
    } else {
      console.log(file + ': chunk desconocido ' + chunk);
      return;
    }
    console.log(file + ': ' + w + 'x' + h + ' (chunk: ' + chunk.trim() + ')');
  } else {
    console.log(file + ': no es WebP valido');
  }
});
