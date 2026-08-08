// Sitemap üretici — BUILD'E BAĞLI DEĞİL, elle çalıştırılır: npm run sitemap
//
// Bilerek build dışında tutuldu: Render'daki Strapi uykudayken derleme
// yapılırsa istek zaman aşımına uğrar ve deploy komple düşerdi. Sitemap'in
// birkaç gün eski olması, sitenin yayına çıkamamasından iyidir.
//
// Yeni inceleme ekledikten sonra çalıştırıp commit'lemen yeterli.

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SITE = "https://techcritic.netlify.app";
const API = "https://react-strapi-game-critic-site.onrender.com";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "sitemap.xml");

// Her zaman yazılacak sabit sayfalar (editör alanları robots.txt ile zaten dışarıda)
const staticUrls = [{ loc: `${SITE}/`, priority: "1.0", changefreq: "daily" }];

const iso = (v) => (v ? new Date(v).toISOString().slice(0, 10) : undefined);

const render = (urls) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) =>
      [
        "  <url>",
        `    <loc>${u.loc}</loc>`,
        u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : null,
        u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>` : null,
        u.priority ? `    <priority>${u.priority}</priority>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n"),
    ),
    "</urlset>",
    "",
  ].join("\n");

const main = async () => {
  let reviewUrls = [];

  try {
    const res = await fetch(
      `${API}/api/reviews?fields[0]=slug&fields[1]=updatedAt&pagination[pageSize]=500`,
      { signal: AbortSignal.timeout(90_000) },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    reviewUrls = (json.data || [])
      .map((item) => {
        const d = item.attributes || item;
        return d.slug
          ? {
              loc: `${SITE}/review/${encodeURIComponent(d.slug)}`,
              lastmod: iso(d.updatedAt),
              changefreq: "weekly",
              priority: "0.8",
            }
          : null;
      })
      .filter(Boolean);

    console.log(`${reviewUrls.length} inceleme bulundu.`);
  } catch (err) {
    // Strapi'ye ulaşılamazsa sitemap'i boş bırakmıyoruz; en azından ana sayfa yazılsın
    console.warn(`UYARI: incelemeler alınamadı (${err.message}).`);
    console.warn("Sitemap yalnızca sabit sayfalarla yazılıyor.");
  }

  const urls = [...staticUrls, ...reviewUrls];
  writeFileSync(OUT, render(urls), "utf8");
  console.log(`sitemap.xml yazıldı — toplam ${urls.length} URL`);
};

main();
