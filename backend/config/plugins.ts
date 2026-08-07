import type { Core } from "@strapi/strapi";

const allowedMediaTypes = [
  "image/*",
  "video/*",
  "audio/*",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.*",
  "text/plain",
  "text/csv",
];

const deniedExecutableTypes = [
  "application/vnd.microsoft.portable-executable",
  "application/x-msdownload",
  "application/x-msdos-program",
  "application/x-executable",
  "application/x-dosexec",
  "application/x-sh",
  "text/x-shellscript",
  "application/x-mach-binary",
];

const config = ({
  env,
}: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  "users-permissions": {
    config: {
      /*jwtManagement: 'refresh',
      sessions: {
        httpOnly: true,
      },*/
    },
  },
  upload: {
    config: {
      // Render'ın konteyner diski geçici: her restart/deploy'da sıfırlanıyor ve
      // local provider ile yüklenen dosyalar kayboluyor (DB kaydı kalıyor, dosya gidiyor).
      // Bu yüzden medya Cloudinary'de tutuluyor.
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("CLOUDINARY_NAME"),
        api_key: env("CLOUDINARY_KEY"),
        api_secret: env("CLOUDINARY_SECRET"),
      },
      actionOptions: {
        upload: {
          folder: env("CLOUDINARY_FOLDER", "game-critic"),
        },
        uploadStream: {
          folder: env("CLOUDINARY_FOLDER", "game-critic"),
        },
        delete: {},
      },
      security: {
        allowedTypes: allowedMediaTypes,
        deniedTypes: deniedExecutableTypes,
      },
    },
  },
});

export default config;
