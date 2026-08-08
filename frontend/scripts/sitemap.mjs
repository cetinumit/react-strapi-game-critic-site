// Sitemap üretici — build'in bir parçası olarak otomatik çalışır.
//
// TASARIM KURALI: bu script hiçbir koşulda deploy'u düşürmez.
//  - Strapi'ye ulaşılamazsa (Render uykuda, ağ hatası, 500) mevcut
//    public/sitemap.xml dosyasına DOKUNMAZ; bir önceki sürüm yayına gider.
//  - Hiçbir hata dışarı sızmaz, çıkış kodu her zaman 0'dır.
// Yani en kötü senaryo "sitemap birkaç gün eski kalır", "site yayına
// çıkamaz" değil.
//
// Elle çalıştırmak istersen: npm run sitemap

import { writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SITE = "https://techcritic.netlify.app";
// Netlify'da VITE_STRAPI_URL tanımlıysa onu kullanıyoruz (frontend'le aynı
// kaynak); yoksa üretim adresine düşüyoruz. Sondaki / varsa temizleniyor.
const API = (
  process.env.VITE_STRAPI_URL || "https://react-strapi-game-critic-site.onrender.com"
).replace(/\/+$/, "");
const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "sitemap.xml",
);

// Render'daki ücretsiz servis uykudaysa uyanması ~1 dakika sürebiliyor.
// Beklemeye değer, çünkü başarısızlık zaten zararsız.
const TIMEOUT_MS = 90_000;

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

const fetchReviewUrls = async () => {
  const res = await fetch(
    `${API}/api/reviews?fields[0]=slug&fields[1]=updatedAt&pagination[pageSize]=500`,
    { signal: AbortSignal.timeout(TIMEOUT_MS) },
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  return (json.data || [])
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
};

const main = async () => {
  let reviewUrls;

  try {
    reviewUrls = await fetchReviewUrls();
    console.log(`[sitemap] ${reviewUrls.length} inceleme bulundu.`);
  } catch (err) {
    console.warn(`[sitemap] UYARI: incelemeler alınamadı (${err.message}).`);
    if (existsSync(OUT)) {
      // Elimizdeki eksik veriyle üzerine yazmak, mevcut sitemap'i bozmak olur
      console.warn("[sitemap] Mevcut sitemap.xml korunuyor, deploy sürüyor.");
      return;
    }
    console.warn("[sitemap] Dosya hiç yok; yalnızca ana sayfayla oluşturuluyor.");
    reviewUrls = [];
  }

  const urls = [...staticUrls, ...reviewUrls];
  writeFileSync(OUT, render(urls), "utf8");
  console.log(`[sitemap] sitemap.xml yazıldı — toplam ${urls.length} URL`);
};

// Son güvenlik ağı: beklenmedik bir hata bile (disk, izin, vs.) build'i düşürmesin
try {
  await main();
} catch (err) {
  console.warn(`[sitemap] UYARI: atlandı (${err.message}). Deploy sürüyor.`);
}
process.exit(0);
