// astro.config.mjs


import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import alpinejs from '@astrojs/alpinejs';

export default defineConfig({
  experimental: { svg: true },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [alpinejs()],
  output: "server"
});
