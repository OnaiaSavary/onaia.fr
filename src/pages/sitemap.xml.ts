import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('The site URL must be configured to generate the sitemap.');
  }

  const staticPages = [
    '',
    'cv/',
    'conferences/',
    'posters/',
    'research/',
    'vulgarisation/'
  ];
  const articles = await getCollection('vulgarisation');
  const pageUrls = [
    ...staticPages.map((path) => new URL(path, site).href),
    ...articles.map((article) => new URL(`vulgarisation/${article.slug}/`, site).href)
  ];

  const urlEntries = pageUrls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};