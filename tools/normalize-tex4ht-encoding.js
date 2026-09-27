import fs from 'node:fs';

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error('Usage: node normalize-tex4ht-encoding.js input.html output.html');
  process.exit(2);
}

const bytes = fs.readFileSync(inputPath);
const utf8 = new TextDecoder('utf-8', { fatal: true });
const windows1252 = new TextDecoder('windows-1252');
let output = '';

for (let index = 0; index < bytes.length;) {
  const byte = bytes[index];
  let length = 0;

  if (byte < 0x80) {
    output += String.fromCharCode(byte);
    index += 1;
    continue;
  }

  if (byte >= 0xc2 && byte <= 0xdf) length = 2;
  else if (byte >= 0xe0 && byte <= 0xef) length = 3;
  else if (byte >= 0xf0 && byte <= 0xf4) length = 4;

  if (length > 0 && index + length <= bytes.length) {
    try {
      output += utf8.decode(bytes.subarray(index, index + length));
      index += length;
      continue;
    } catch {
    }
  }

  output += windows1252.decode(bytes.subarray(index, index + 1));
  index += 1;
}

output = output.replace(
  /<img\b[^>]*\bsrc=['"]S8\/PRG\.png['"][^>]*>/,
  '<p>[Source figure S8/PRG.png is not present in the supplied files.]</p>'
);

fs.writeFileSync(outputPath, output, 'utf8');