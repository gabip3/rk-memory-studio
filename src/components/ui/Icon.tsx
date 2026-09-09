/**
 * The single icon family for the whole site.
 *
 * One visual language: 24x24 viewBox, 1.4 stroke, round caps and joins, no
 * fills. Never use emoji as an icon - they are font-dependent, inconsistent
 * across platforms and cannot be themed.
 *
 * Icons are decorative by default (`aria-hidden`). Pass a `title` only when the
 * icon is the sole carrier of meaning; otherwise label the parent control.
 */

export type IconName =
  | "camera"
  | "heart"
  | "gift"
  | "sparkle"
  | "cart"
  | "upload"
  | "hands"
  | "magnet"
  | "key"
  | "search"
  | "user"
  | "close"
  | "menu"
  | "chevron-down"
  | "chevron-right"
  | "arrow-right"
  | "arrow-left"
  | "check"
  | "check-circle"
  | "plus"
  | "minus"
  | "trash"
  | "image"
  | "alert"
  | "info"
  | "instagram"
  | "facebook"
  | "mail"
  | "pin"
  | "calendar"
  | "truck";

const paths: Record<IconName, React.ReactNode> = {
  camera: (
    <>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2.2a1 1 0 0 0 .83-.45l.94-1.4A1 1 0 0 1 9.3 4.7h5.4a1 1 0 0 1 .83.45l.94 1.4a1 1 0 0 0 .83.45h2.2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="12.6" r="3.4" />
    </>
  ),
  heart: (
    <path d="M12 20s-7.5-4.35-7.5-9.6A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8C19.5 15.65 12 20 12 20z" />
  ),
  gift: (
    <>
      <path d="M3.8 11.4h16.4v7.2a1.4 1.4 0 0 1-1.4 1.4H5.2a1.4 1.4 0 0 1-1.4-1.4z" />
      <path d="M3 8.2h18v3.2H3z" />
      <path d="M12 8.2V20" />
      <path d="M12 8.2S10.6 4 8.4 4a2.1 2.1 0 0 0 0 4.2z" />
      <path d="M12 8.2S13.4 4 15.6 4a2.1 2.1 0 0 1 0 4.2z" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5l1.55 4.55a2 2 0 0 0 1.25 1.25L19.35 11l-4.55 1.7a2 2 0 0 0-1.25 1.25L12 18.5l-1.55-4.55a2 2 0 0 0-1.25-1.25L4.65 11l4.55-1.7a2 2 0 0 0 1.25-1.25z" />
      <path d="M18.4 16.2l.55 1.5 1.5.55-1.5.55-.55 1.5-.55-1.5-1.5-.55 1.5-.55z" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4.5h1.9a1 1 0 0 1 .98.8L6.3 7.4m0 0l1.62 8.05a1.4 1.4 0 0 0 1.37 1.12h8.05a1.4 1.4 0 0 0 1.37-1.1L20.2 7.4z" />
      <circle cx="9.6" cy="19.6" r="1.3" />
      <circle cx="17.4" cy="19.6" r="1.3" />
    </>
  ),
  upload: (
    <>
      <path d="M4 15.5v2.9A1.6 1.6 0 0 0 5.6 20h12.8a1.6 1.6 0 0 0 1.6-1.6v-2.9" />
      <path d="M12 15.2V4.2" />
      <path d="M7.9 8.3L12 4.2l4.1 4.1" />
    </>
  ),
  hands: (
    <>
      <path d="M12 19.4S7 16.4 7 12.9a2.7 2.7 0 0 1 5-1.45 2.7 2.7 0 0 1 5 1.45c0 3.5-5 6.5-5 6.5z" />
      <path d="M4.2 10.6l-1.1 3.1a1.5 1.5 0 0 0 .8 1.85l2.2 1" />
      <path d="M19.8 10.6l1.1 3.1a1.5 1.5 0 0 1-.8 1.85l-2.2 1" />
    </>
  ),
  magnet: (
    <>
      <path d="M6 4.5h3.6v8.2a2.4 2.4 0 0 0 4.8 0V4.5H18v8.2a6 6 0 0 1-12 0z" />
      <path d="M6 9.4h3.6M14.4 9.4H18" />
    </>
  ),
  key: (
    <>
      <circle cx="8.4" cy="8.4" r="4.4" />
      <path d="M11.6 11.6L20 20" />
      <path d="M17.2 17.2l1.9-1.9M14.8 14.8l1.9-1.9" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="M15.4 15.4L20 20" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.4" r="3.8" />
      <path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" />
    </>
  ),
  close: <path d="M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />,
  menu: <path d="M3.6 7h16.8M3.6 12h16.8M3.6 17h16.8" />,
  "chevron-down": <path d="M6 9.5l6 5.4 6-5.4" />,
  "chevron-right": <path d="M9.5 6l5.4 6-5.4 6" />,
  "arrow-right": (
    <>
      <path d="M4 12h15.4" />
      <path d="M14 6.6L19.4 12 14 17.4" />
    </>
  ),
  "arrow-left": (
    <>
      <path d="M20 12H4.6" />
      <path d="M10 6.6L4.6 12 10 17.4" />
    </>
  ),
  check: <path d="M4.8 12.6l4.6 4.6L19.2 7.4" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M8.2 12.3l2.7 2.7 5-5.2" />
    </>
  ),
  plus: <path d="M12 4.8v14.4M4.8 12h14.4" />,
  minus: <path d="M4.8 12h14.4" />,
  trash: (
    <>
      <path d="M4.4 6.6h15.2" />
      <path d="M9.4 6.6V5.2a1.2 1.2 0 0 1 1.2-1.2h2.8a1.2 1.2 0 0 1 1.2 1.2v1.4" />
      <path d="M6.4 6.6l.85 12.1a1.4 1.4 0 0 0 1.4 1.3h6.7a1.4 1.4 0 0 0 1.4-1.3l.85-12.1" />
      <path d="M10.3 10.2v6M13.7 10.2v6" />
    </>
  ),
  image: (
    <>
      <rect x="3.4" y="5" width="17.2" height="14" rx="1.6" />
      <circle cx="8.6" cy="9.8" r="1.5" />
      <path d="M3.9 16.6l4.4-4.1a1.6 1.6 0 0 1 2.2 0l3.6 3.4" />
      <path d="M13.6 14.2l2-1.9a1.6 1.6 0 0 1 2.2 0l2.4 2.3" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.4l8.4 14.6H3.6z" />
      <path d="M12 10v3.6" />
      <path d="M12 16.4h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 11.2v5" />
      <path d="M12 8.2h.01" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4.6" />
      <circle cx="12" cy="12" r="3.9" />
      <path d="M16.9 7.1h.01" />
    </>
  ),
  facebook: (
    <path d="M14.6 8.4h2.2V5.3h-2.4c-2.2 0-3.6 1.5-3.6 3.8v1.7H8.6v3.1h2.2V21h3.2v-7.1h2.3l.4-3.1h-2.7V9.5c0-.7.3-1.1.6-1.1z" />
  ),
  mail: (
    <>
      <rect x="3.2" y="5.4" width="17.6" height="13.2" rx="1.7" />
      <path d="M3.8 7l7.3 5.3a1.5 1.5 0 0 0 1.8 0L20.2 7" />
    </>
  ),
  pin: (
    <>
      <path d="M12 20.6s6.2-5.4 6.2-9.7A6.2 6.2 0 1 0 5.8 10.9c0 4.3 6.2 9.7 6.2 9.7z" />
      <circle cx="12" cy="10.7" r="2.4" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.6" y="5.4" width="16.8" height="15" rx="1.7" />
      <path d="M3.6 10h16.8" />
      <path d="M8.2 3.4v3.6M15.8 3.4v3.6" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7.2a1.2 1.2 0 0 1 1.2-1.2h9.4v9.6H3z" />
      <path d="M13.6 9.4h3.6l2.8 3.1v3.1h-6.4z" />
      <circle cx="7.4" cy="17.6" r="1.7" />
      <circle cx="16.6" cy="17.6" r="1.7" />
    </>
  ),
};

export type IconProps = {
  name: IconName;
  /** Rendered size in px. Use the token sizes: 16, 20, 24, 32. */
  size?: number;
  className?: string;
  strokeWidth?: number;
  /**
   * Accessible name. Supply ONLY when the icon carries meaning on its own -
   * otherwise leave undefined and label the surrounding control.
   */
  title?: string;
};

export function Icon({
  name,
  size = 24,
  className,
  strokeWidth = 1.4,
  title,
}: IconProps) {
  const isDecorative = !title;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={isDecorative || undefined}
      role={isDecorative ? undefined : "img"}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
