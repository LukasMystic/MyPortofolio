// Line glyphs drawn to sit next to SF Pro text the way SF Symbols do:
// round caps and joins, one stroke weight, sized to the surrounding font.
const paths = {
  'chevron.right': <path d="M9 5.5 15.5 12 9 18.5" />,
  'chevron.left': <path d="M15 5.5 8.5 12l6.5 6.5" />,
  'arrow.up.right': <path d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15" />,
  'arrow.down': <path d="M12 4.5v14M6.5 13l5.5 5.5 5.5-5.5" />,
  envelope: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </>
  ),
  house: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9v10.5h4.5V15h3v4.5H18V9" />
    </>
  ),
  'square.grid': (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.75" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.75" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.75" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.75" />
    </>
  ),
  'bubble': <path d="M12 4.5c4.7 0 8.5 3 8.5 6.9s-3.8 6.9-8.5 6.9c-.9 0-1.8-.1-2.6-.3L5 19.5l1.2-3.6c-1.7-1.3-2.7-3-2.7-4.5 0-3.9 3.8-6.9 8.5-6.9Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="3.75" />
      <path d="M12 2.75v2M12 19.25v2M2.75 12h2M19.25 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4" />
    </>
  ),
  moon: <path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5S9.7 5.9 12 3.5Z" />
    </>
  ),
  flask: (
    <>
      <path d="M9.5 3.5h5M10.25 3.5v5.25L5 18a1.75 1.75 0 0 0 1.5 2.5h11A1.75 1.75 0 0 0 19 18l-5.25-9.25V3.5" />
      <path d="M7.5 14.5h9" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5c-1.8-1.4-4.6-2-8-1.75v13c3.4-.25 6.2.35 8 1.75 1.8-1.4 4.6-2 8-1.75v-13c-3.4-.25-6.2.35-8 1.75Z" />
      <path d="M12 6.5v13" />
    </>
  ),
  pawprint: (
    <>
      <path d="M12 12.5c-2.6 0-5 2.6-5 4.8 0 1.4 1 2.2 2.3 2.2 1.1 0 1.6-.6 2.7-.6s1.6.6 2.7.6c1.3 0 2.3-.8 2.3-2.2 0-2.2-2.4-4.8-5-4.8Z" />
      <ellipse cx="9" cy="6.75" rx="1.6" ry="2.1" />
      <ellipse cx="15" cy="6.75" rx="1.6" ry="2.1" />
      <ellipse cx="5.25" cy="10.75" rx="1.5" ry="1.9" />
      <ellipse cx="18.75" cy="10.75" rx="1.5" ry="1.9" />
    </>
  ),
  'doc.text': (
    <>
      <path d="M7 3.5h6.5l4.5 4.5v10.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
      <path d="M13.5 3.5V8H18M8.5 12.5h7M8.5 16h5" />
    </>
  ),
  'graduationcap': (
    <>
      <path d="m2.75 9.5 9.25-4.5 9.25 4.5-9.25 4.5-9.25-4.5Z" />
      <path d="M6.5 11.5v4.25c1.5 1.3 3.4 2 5.5 2s4-.7 5.5-2V11.5M21.25 9.5v5" />
    </>
  ),
  checkmark: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  xmark: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  person: (
    <>
      <circle cx="12" cy="8.25" r="3.75" />
      <path d="M4.75 20c.9-3.6 3.8-5.75 7.25-5.75s6.35 2.15 7.25 5.75" />
    </>
  ),
  'exclamationmark.circle': (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5.5M12 16.25v.25" />
    </>
  ),
  gamecontroller: (
    <>
      <path d="M7.5 7.5h9a4.5 4.5 0 0 1 4.4 5.4l-.7 3.6a2.4 2.4 0 0 1-4.2 1.1L14.5 16h-5L8 17.6a2.4 2.4 0 0 1-4.2-1.1l-.7-3.6a4.5 4.5 0 0 1 4.4-5.4Z" />
      <path d="M8 10.5v3M6.5 12h3M15.5 11.25v.25M17 12.75v.25" />
    </>
  ),
};

// Brand marks are filled, as they are in their own guidelines.
const brands = {
  github: (
    <path
      fillRule="evenodd"
      d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.52 1.06 1.52 1.06.89 1.56 2.34 1.11 2.9.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.2 9.2 0 0 1 5 0c1.9-1.32 2.74-1.05 2.74-1.05.56 1.42.21 2.47.1 2.73.64.72 1.02 1.63 1.02 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.69.95.69 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.59.69.49A10.06 10.06 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
      clipRule="evenodd"
    />
  ),
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 8.98h4v12H3v-12Zm7 0h3.8v1.64h.05c.53-.95 1.82-1.95 3.75-1.95 4.01 0 4.75 2.64 4.75 6.08v6.23h-4v-5.52c0-1.32-.03-3.02-1.84-3.02-1.85 0-2.13 1.44-2.13 2.92v5.62h-4v-12Z" />
  ),
};

const Glyph = ({ name, className = 'h-[1.1em] w-[1.1em]', weight = 1.75, title }) => {
  const isBrand = name in brands;
  return (
    <svg
      viewBox="0 0 24 24"
      className={`inline-block shrink-0 ${className}`}
      fill={isBrand ? 'currentColor' : 'none'}
      stroke={isBrand ? 'none' : 'currentColor'}
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      {isBrand ? brands[name] : paths[name]}
    </svg>
  );
};

export default Glyph;
