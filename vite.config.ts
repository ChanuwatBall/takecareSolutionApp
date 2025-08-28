import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(), basicSsl()],
  server: {
    // https: true // This enables HTTPS for the dev server
     host: '0.0.0.0',
  }
})
