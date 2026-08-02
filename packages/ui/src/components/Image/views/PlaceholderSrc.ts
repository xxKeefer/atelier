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

// A distinct 2x variant -- lets density-descriptor stories/tests assert the
// browser actually swaps asset, not just resolution.
export const placeholderSrc2x =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="800" height="600" fill="#4a3f8f" />
      <circle cx="240" cy="220" r="80" fill="#f2c94c" />
      <path d="M0 440 L280 240 L460 400 L600 300 L800 460 L800 600 L0 600 Z" fill="#7c6bd1" />
    </svg>`,
  )
