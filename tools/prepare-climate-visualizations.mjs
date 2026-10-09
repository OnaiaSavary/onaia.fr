import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';

const sourceFiles = [
  {
    slug: 'zg500_t2m_2026',
    path: process.argv[2] ?? join(homedir(), 'Desktop', 'zg500_t2m_2026.html')
  },
  {
    slug: 'zg500_spi3_2026',
    path: process.argv[3] ?? join(homedir(), 'Desktop', 'zg500_spi3_2026.html')
  }
];

const outputDirectory = resolve('public/visualizations');
const imagePattern = /data:image\/png;base64,([A-Za-z0-9+/=]+)/g;

mkdirSync(outputDirectory, { recursive: true });

for (const source of sourceFiles) {
  const html = readFileSync(source.path, 'utf8');
  const images = [...html.matchAll(imagePattern)];

  if (images.length !== 263) {
    throw new Error(`${basename(source.path)}: expected 263 embedded PNG frames, found ${images.length}`);
  }

  const frameDirectory = join(outputDirectory, source.slug, 'frames');
  const temporaryDirectory = mkdtempSync(join(tmpdir(), `onaia-${source.slug}-`));
  mkdirSync(frameDirectory, { recursive: true });

  try {
    let frameIndex = 0;
    const deployableHtml = html.replace(imagePattern, (_match, payload) => {
      const frameName = `frame-${String(frameIndex).padStart(3, '0')}.webp`;
      const pngPath = join(temporaryDirectory, `frame-${frameIndex}.png`);
      const webpPath = join(frameDirectory, frameName);
      writeFileSync(pngPath, Buffer.from(payload, 'base64'));
      execFileSync('ffmpeg', [
        '-y', '-hide_banner', '-loglevel', 'error', '-i', pngPath,
        '-c:v', 'libwebp', '-lossless', '1', '-compression_level', '6', webpPath
      ], { stdio: 'ignore' });
      frameIndex += 1;
      return `${source.slug}/frames/${frameName}`;
    });

    const htmlPath = join(outputDirectory, `${source.slug}.html`);
    writeFileSync(htmlPath, deployableHtml, 'utf8');
    console.log(`${basename(source.path)} -> ${htmlPath} (${frameIndex} lossless WebP frames)`);
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}