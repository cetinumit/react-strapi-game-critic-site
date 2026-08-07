import type { Core } from '@strapi/strapi';

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
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
