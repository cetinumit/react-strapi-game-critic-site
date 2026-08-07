import React from "react";

const base = "w-4 h-4";
const sw = "1.4";

/* ============ ERİŞİM / GİRİŞ ============ */

// Navbar'daki "Editör Girişi" butonu — küçük versiyon
export const AccessIcon = ({ className = base }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    <path
      d="M2 2H5M2 2V5M14 2H11M14 2V5M2 14H5M2 14V11M14 14H11M14 14V11"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
    <circle cx="8" cy="8" r="1.3" fill="currentColor" />
  </svg>
);

// Login sayfasındaki büyük ikon — AccessIcon'un aynı ailesinden, büyütülmüş
export const SecureNodeIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M4 4H8M4 4V8M20 4H16M20 4V8M4 20H8M4 20V16M20 20H16M20 20V16"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="2.2" fill="currentColor" />
  </svg>
);

// Şifre input'u içinde — anahtar
export const KeyMarkIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth={sw} />
    <path
      d="M9.2 9.2L15 15M12 12L14 10M14 14L16 12"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// E-posta input'u içinde — giden kanal
export const ChannelIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M3 10H13"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
    <path
      d="M10 6L14 10L10 14"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 6V14"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

// Login hata mesajı — üçgen uyarı, elle çizilmiş
export const WarningIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M10 3L18 16H2L10 3Z"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinejoin="round"
    />
    <path
      d="M10 8V11.5"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
    <circle cx="10" cy="13.6" r="0.9" fill="currentColor" />
  </svg>
);

/* ============ NAVİGASYON ============ */

export const AddEntryIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <rect
      x="3"
      y="3"
      width="14"
      height="14"
      stroke="currentColor"
      strokeWidth={sw}
    />
    <path
      d="M10 6.5V13.5"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
    <path
      d="M6.5 10H13.5"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
  </svg>
);

export const ExitIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <rect
      x="4"
      y="4"
      width="8"
      height="12"
      stroke="currentColor"
      strokeWidth={sw}
    />
    <path
      d="M10 10H17"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
    <path
      d="M14 7L17 10L14 13"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const OperatorIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <rect
      x="5"
      y="5"
      width="10"
      height="10"
      stroke="currentColor"
      strokeWidth={sw}
    />
    <circle cx="10" cy="10" r="1.6" fill="currentColor" />
  </svg>
);

export const ReturnIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M14 4V16"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      opacity="0.4"
    />
    <path
      d="M9 7L5 10L9 13"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 10H12"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
  </svg>
);

export const AdvanceIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M4 10H14"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
    <path
      d="M11 5L16 10L11 15"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ============ İNCELEME DETAYI ============ */

// "Editör İncelemesi" etiketi — imza çizgisi
export const SignatureIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M3 14c2-1 3-4 4-4s1 3 3 3 2-5 4-5 2 3 3 3"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Tarih — zaman çizgisi üzerinde işaret
export const TimestampIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <line
      x1="2"
      y1="10"
      x2="18"
      y2="10"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      opacity="0.4"
    />
    <path
      d="M10 10V4"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
    <circle cx="10" cy="10" r="1.8" fill="currentColor" />
  </svg>
);

// Düzenle — revizyon açısı
export const RevisionIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M4 16L13 7"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
    <path
      d="M13 7V4M13 7H16"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
    <path
      d="M4 16V13M4 16H7"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
  </svg>
);

// Sil — red damgası
export const RejectStampIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <rect
      x="3"
      y="3"
      width="14"
      height="14"
      stroke="currentColor"
      strokeWidth={sw}
    />
    <path
      d="M6.5 6.5L13.5 13.5"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
  </svg>
);

// Hata durumu — arızalı ölçüm işareti
export const FaultIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth={sw} />
    <path
      d="M7.3 7.3L12.7 12.7M12.7 7.3L7.3 12.7"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
  </svg>
);

// Artıları — yükselen ölçüm grafiği
export const GainIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M4 13L8 7L12 11L16 5"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 5H16V9"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Eksileri — düşen ölçüm grafiği
export const LossIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M4 7L8 13L12 9L16 15"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 15H16V11"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ============ HERO / KART ============ */

// "Öne Çıkan İnceleme" — grafik zirvesi
export const PeakIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M3 14L8 6L12 11L17 4"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="17" cy="4" r="1.6" fill="currentColor" />
  </svg>
);

/* ============ KÜNYE (ABOUT) ============ */

// Geliştirme & Yönetim — devre izi
export const TraceIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <circle cx="4" cy="16" r="1.4" fill="currentColor" />
    <circle cx="16" cy="4" r="1.4" fill="currentColor" />
    <path
      d="M4 16V10H10V4H16"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Yayın Kadrosu — sayfa düzeni ızgarası
export const LayoutMarkIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <rect
      x="3"
      y="3"
      width="14"
      height="14"
      stroke="currentColor"
      strokeWidth={sw}
    />
    <path d="M3 8H17" stroke="currentColor" strokeWidth={sw} />
    <path d="M8 8V17" stroke="currentColor" strokeWidth={sw} />
  </svg>
);

// Bize Ulaşın — sinyal/yayın
export const SignalIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <circle cx="5" cy="15" r="1.4" fill="currentColor" />
    <path
      d="M5 11C8 11 9 12 9 15"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
    <path
      d="M5 7C11 7 13 9 13 15"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

// Yönetim Yeri — koordinat işareti
export const CoordinateIcon = ({ className = base }) => (
  <svg viewBox="0 0 20 20" fill="none" className={className}>
    <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth={sw} />
    <path
      d="M10 2V5M10 15V18M2 10H5M15 10H18"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
    />
    <circle cx="10" cy="10" r="1.3" fill="currentColor" />
  </svg>
);
