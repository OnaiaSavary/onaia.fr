import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// MDX remark/rehype for KaTeX
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://onaia.fr',
  integrations: [
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex]
    })
  ],
  vite: {
    css: {
      preprocessorOptions: {}
    }
  }
});
