import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import testingLibrary from 'eslint-plugin-testing-library'
import prettier from 'eslint-config-prettier'
import globals from 'globals'

// Ban TS features that don't lower to native JS. Keeps the source closer to
// runnable JavaScript and avoids enum/namespace emit semantics.
const noNonNativeTs = {
  'no-restricted-syntax': [
    'error',
    {
      selector: 'TSEnumDeclaration',
      message: 'Avoid TS enums (not native JS). Use a union type or `as const` object.',
    },
    {
      selector: 'TSModuleDeclaration[kind="namespace"]',
      message: 'Avoid TS namespaces (not native JS). Use ES modules.',
    },
  ],
}

export default defineConfigWithVueTs(
  { ignores: ['**/dist/**', '**/.vitepress/cache/**', '**/storybook-static/**'] },

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.strictTypeChecked,
  vueTsConfigs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      ...noNonNativeTs,
      '@typescript-eslint/prefer-for-of': 'error',
    },
  },

  // Config and build scripts run outside the typed project graph. Disable the
  // type-aware rules *and* the project-service lookup -- these files live outside
  // every tsconfig `include`, so the service can't find a project for them.
  {
    files: ['**/*.config.{js,ts,mjs}', '**/.storybook/**', '**/.vitepress/**'],
    extends: [vueTsConfigs.disableTypeChecked],
    languageOptions: { parserOptions: { projectService: false } },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    extends: [testingLibrary.configs['flat/vue']],
  },

  prettier,
)
