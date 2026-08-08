import type { Core } from '@strapi/strapi';

/**
 * CORS'a izin verilen kaynaklar.
 *
 * Varsayılan ayar ('*') herhangi bir sitenin tarayıcıdan API'mize istek
 * atmasına izin veriyordu. Aşağıdaki desenler Netlify'daki yayın adresimizi,
 * Netlify'ın otomatik önizleme/dal adreslerini (deploy-preview-3--site.netlify.app
 * gibi), yerel geliştirmeyi ve Strapi'nin kendi adresini kapsıyor.
 *
 * Not: Origin başlığı olmayan istekler (curl, sunucu-sunucu, sitemap scripti)
 * Strapi tarafında zaten serbest; bu liste yalnızca tarayıcıyı ilgilendiriyor.
 * Aynı origin'den gelen admin panel istekleri de tarayıcı tarafından CORS
 * denetimine tabi tutulmaz, yine de listeye ekliyoruz.
 */
const ALLOWED_ORIGINS = [
  /^https:\/\/techcritic\.netlify\.app$/,
  /^https:\/\/[a-z0-9-]+--techcritic\.netlify\.app$/,
  /^https:\/\/react-strapi-game-critic-site\.onrender\.com$/,
  /^http:\/\/localhost:(5173|4173|1337)$/,
  /^http:\/\/127\.0\.0\.1:(5173|4173|1337)$/,
];

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  {
    // Varsayılan CSP yalnızca 'self' kaynaklı görsellere izin veriyor; Cloudinary'ye
    // geçtiğimiz için admin panelindeki Media Library önizlemeleri engellenmesin diye
    // res.cloudinary.com'u img-src/media-src'e ekliyoruz.
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'https://market-assets.strapi.io',
            'strapi-ai-staging.s3.us-east-1.amazonaws.com',
            'strapi-ai-production.s3.us-east-1.amazonaws.com',
            'res.cloudinary.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'strapi-ai-staging.s3.us-east-1.amazonaws.com',
            'strapi-ai-production.s3.us-east-1.amazonaws.com',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      // Strapi origin listesini tam eşleşmeyle karşılaştırıyor, joker desteklemiyor.
      // Fonksiyon biçimi destekleniyor: izin verilenlerde eşleşme varsa isteğin
      // kendi origin'ini, yoksa boş liste döndürüyoruz (tarayıcı isteği engeller).
      origin: (ctx: any) => {
        const requestOrigin = ctx.get('Origin');
        if (!requestOrigin) return ['*'];
        return ALLOWED_ORIGINS.some((pattern) => pattern.test(requestOrigin))
          ? [requestOrigin]
          : [];
      },
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
