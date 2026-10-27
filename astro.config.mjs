import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  session: {
    driver: 'memory',
  },
  devToolbar: {
    enabled: false,
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  vite: {
    ssr: {
      external: ['node:sqlite', 'node:fs', 'node:path'],
    },
  },
});
