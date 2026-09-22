import fs from 'fs';

const path = './cv_text.txt';
if (!fs.existsSync(path)) {
  console.error('cv_text.txt not found');
  process.exit(1);
}
let raw = fs.readFileSync(path);
// Try UTF-16LE first, fallback to utf8
let s = raw.toString('utf16le');
// Keep printable characters (basic Latin + Latin-1 accents) and newlines
s = s.replace(/[^\n\r\t\x20-\x7E\xA0-\xFF]/g, '');
// Collapse repeated whitespace
s = s.replace(/[ \t]{2,}/g,' ').replace(/\n{2,}/g,'\n\n').trim();
fs.writeFileSync('cv_clean2.txt', s, 'utf8');
console.log('wrote cv_clean2.txt');
