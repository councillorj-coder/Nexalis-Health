import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves from /Nexalis-Health/ subdirectory
// Use the base path in production, root path in development
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/Nexalis-Health/' : '/',
  plugins: [react()],
}))
