import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves from /Nexalis-Health/ subdirectory
export default defineConfig({
  base: '/Nexalis-Health/',
  plugins: [react()],
})
