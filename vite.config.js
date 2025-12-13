import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path cho GitHub Pages: /nuoitoi/
  base: process.env.VITE_BASE ? `/${process.env.VITE_BASE}/` : '/nuoitoi/',
})

