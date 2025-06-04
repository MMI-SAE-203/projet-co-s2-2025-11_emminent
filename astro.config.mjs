// astro.config.mjs

import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import alpinejs from '@astrojs/alpinejs';
import netlify from '@astrojs/netlify';

export default defineConfig({
  experimental: {
    svg: true,
    session: true, 
  },
  output: 'server',
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [alpinejs()],
});
