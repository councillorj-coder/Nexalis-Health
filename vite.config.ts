import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages needs a non-root base path when served from /<repo>/.
// Set VITE_BASE in CI (e.g. "/Nexalis_Health/") or leave empty for custom domains.
export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
})
