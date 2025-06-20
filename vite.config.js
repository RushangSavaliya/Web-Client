// FIle: vite.config.js

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,  // This exposes it to LAN
    port: 5173,       // Or any port you want
    allowedHosts: true, // Allow all hosts
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
