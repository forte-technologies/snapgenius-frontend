import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['2ee257c68587.ngrok.app'],
    port: 5175,
    historyApiFallback: true, // Add this line
  }
})
