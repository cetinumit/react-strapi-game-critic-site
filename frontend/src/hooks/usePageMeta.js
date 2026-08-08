import { useEffect } from "react";

const SITE = "https://techcritic.netlify.app";
const SITE_NAME = "TechCritic";
const DEFAULT_IMAGE = `${SITE}/og-image.png`;

// index.html'deki varsayılanlar; sayfadan ayrılırken bunlara dönüyoruz ki
// bir sonraki sayfa kendi başlığını yazana kadar eski başlık asılı kalmasın
const FALLBACK = {
  title: "TechCritic — Oyun ve Donanım İncelemeleri",
  description:
    "Dijital oyun kültürünü, donanım dünyasını ve e-spor ekosistemini bağımsız, şeffaf ve analitik bir bakış açısıyla inceliyoruz.",
};

const setTag = (selector, attr, value) => {
  if (!value) return;
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

/**
 * Sayfa başlığı ve paylaşım etiketlerini günceller.
 *
 * Not: Site istemci tarafında render edildiği için bu etiketler ancak
 * JavaScript çalıştıktan sonra oluşur. Google çalıştırıyor; sosyal medya
 * botlarının çoğu çalıştırmıyor, onlar index.html'deki varsayılanları görür.
 * Kalıcı çözüm prerender.
 *
 * @param {{title?: string, description?: string, image?: string, path?: string}} meta
 */
export const usePageMeta = ({ title, description, image, path } = {}) => {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : FALLBACK.title;
    const desc = description || FALLBACK.description;
    const url = path ? `${SITE}${path}` : SITE + "/";

    document.title = fullTitle;
    setTag('meta[name="description"]', "content", desc);
    setTag('link[rel="canonical"]', "href", url);

    setTag('meta[property="og:title"]', "content", fullTitle);
    setTag('meta[property="og:description"]', "content", desc);
    setTag('meta[property="og:url"]', "content", url);
    setTag('meta[property="og:image"]', "content", image || DEFAULT_IMAGE);

    setTag('meta[name="twitter:title"]', "content", fullTitle);
    setTag('meta[name="twitter:description"]', "content", desc);
    setTag('meta[name="twitter:image"]', "content", image || DEFAULT_IMAGE);

    return () => {
      document.title = FALLBACK.title;
    };
  }, [title, description, image, path]);
};

export default usePageMeta;
