// A tiny inline SVG data URI -- no asset dependency for stories/tests, deterministic
// output for the visual snapshot.
export const placeholderSrc =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <rect width="100" height="100" fill="#7c6bd1" />
      <circle cx="50" cy="40" r="22" fill="#f2c94c" />
      <path d="M10 100 L40 60 L65 85 L100 55 L100 100 Z" fill="#4a3f8f" />
    </svg>`,
  )
