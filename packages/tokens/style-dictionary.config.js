/** @type {import('style-dictionary').Config} */
export default {
  source: ['src/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { selector: ':root' },
        },
        {
          // Tailwind v4 surface: same vars wrapped in @theme so semantic
          // --color-* / --text-* / --radius-* etc. generate utilities.
          destination: 'theme.css',
          format: 'css/variables',
          options: { selector: '@theme' },
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/',
      files: [
        { destination: 'index.js', format: 'javascript/esm' },
        { destination: 'index.d.ts', format: 'typescript/module-declarations' },
      ],
    },
  },
}
