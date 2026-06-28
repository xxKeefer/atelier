import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Atelier',
  description: 'A personal design system and Vue component library, built in public.',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/' },
      { text: 'Components', link: '/components/' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        items: [{ text: 'What is Atelier', link: '/' }],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/xxKeefer/atelier' }],
  },
})
