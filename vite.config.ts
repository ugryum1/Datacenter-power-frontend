import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    proxy: {
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
  plugins: [react()],
})
