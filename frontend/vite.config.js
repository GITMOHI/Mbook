import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({

  server: {
    host: '0.0.0.0', // Ensures Vite can listen on all network interfaces, especially inside Docker
    port: 5173, // Default port for Vite
    watch: {
      usePolling: true, // Ensures Vite detects changes in Docker containers (this may be necessary depending on your setup)
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
