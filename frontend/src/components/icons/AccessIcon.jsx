const AccessIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 16 16" fill="none" className={className}>
    {/* Sol ve sağ köşe braketleri — "erişim noktası" hissi */}
    <path
      d="M2 2H5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M2 2V5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 2H11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 2V5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M2 14H5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M2 14V11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 14H11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M14 14V11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Ortada tek nokta */}
    <circle cx="8" cy="8" r="1.4" fill="currentColor" />
  </svg>
);

export default AccessIcon;
