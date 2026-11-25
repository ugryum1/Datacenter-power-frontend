import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command, mode }) => {
  const pages = mode === 'pages'
  const lan = mode === 'lan' && command === 'serve'
  const base = pages ? '/Datacenter-power-frontend/' : '/'

  return {
    base,
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: lan },
        manifest: {
          name: 'Оборудование ЦОД',
          short_name: 'ЦОД',
          lang: 'ru',
          start_url: base,
          display: 'standalone',
          theme_color: '#1A2663',
          background_color: '#F0F3F8',
          icons: [
            { src: 'datacenter-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'datacenter-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{html,js,css,png,jpg,webm}'],
          navigateFallbackDenylist: [/^\/api\//, /^\/datacenter-media\//],
        },
      }),
    ],
    server: {
      port: 3000,
      host: lan ? '0.0.0.0' : undefined,
      https: lan ? {
        key: readFileSync(new URL('./cert.key', import.meta.url)),
        cert: readFileSync(new URL('./cert.crt', import.meta.url)),
      } : undefined,
      proxy: pages ? undefined : {
        '/api': {
          target: process.env.DATACENTER_API_TARGET || 'http://localhost:8080',
          changeOrigin: true,
        },
        '/datacenter-media': {
          target: 'http://localhost:9000',
          changeOrigin: true,
        },
      },
    },
  }
})
