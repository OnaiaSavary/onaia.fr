import fs from 'fs';
import pdf from 'pdf-parse';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node extract-pdf.js path/to/file.pdf');
  process.exit(2);
}

(async () => {
  try {
    const dataBuffer = fs.readFileSync(file);
    const data = await pdf(dataBuffer);
    // write full text to stdout
    console.log(data.text);
  } catch (err) {
    console.error('Error extracting PDF:', err);
    process.exit(1);
  }
})();
