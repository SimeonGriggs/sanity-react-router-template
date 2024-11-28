import {reactRouter} from '@react-router/dev/vite'
import autoprefixer from 'autoprefixer'
import {reactRouterHonoServer} from 'react-router-hono-server/dev' // add this
import tailwindcss from 'tailwindcss'
import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [
    // Multi-deployment hosting server https://github.com/rphlmr/react-router-hono-server
    reactRouterHonoServer(),
    reactRouter(),
    tsconfigPaths(),
  ],
  optimizeDeps: {
    exclude: ['@resvg/resvg-js'],
  },
})
