import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    allowedHosts: ['2ee257c68587.ngrok.app'],
    port: 5175,
    historyApiFallback: true, // Add this line
  }
})
