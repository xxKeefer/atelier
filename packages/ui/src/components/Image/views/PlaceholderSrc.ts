// A tiny inline SVG data URI -- no asset dependency for stories/tests, deterministic
// output for the visual snapshot.
export const placeholderSrc =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <rect width="400" height="300" fill="#7c6bd1" />
      <circle cx="120" cy="110" r="40" fill="#f2c94c" />
      <path d="M0 220 L140 120 L230 200 L300 150 L400 230 L400 300 L0 300 Z" fill="#4a3f8f" />
    </svg>`,
  )
