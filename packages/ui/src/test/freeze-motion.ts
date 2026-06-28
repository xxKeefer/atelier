// Kill all animation + transition motion so visual snapshots are deterministic.
// Vitest's screenshotOptions doesn't expose Playwright's `animations: 'disabled'`,
// and the matcher's stability retry never settles on an infinite animation
// (spinner, skeleton pulse) -- it fails as `unstable-screenshot`. Inject this
// before toMatchScreenshot. Idempotent; safe to call per test.
let injected = false;

export function freezeMotion(): void {
  if (injected) return;
  const style = document.createElement('style');
  style.dataset.freezeMotion = '';
  style.textContent = `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
      caret-color: transparent !important;
    }
  `;
  document.head.appendChild(style);
  injected = true;
}
