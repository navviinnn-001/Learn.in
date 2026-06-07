import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js — Vite Configuration
// proxy: redirects /api requests from frontend to backend during development
// This way we don't get CORS errors when calling http://localhost:5000/api/...
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
