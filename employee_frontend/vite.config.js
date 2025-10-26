import { defineConfig } from 'vite'
import fs from 'fs'
import react from '@vitejs/plugin-react'
import csp from 'vite-plugin-csp';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    csp({
      policies: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'"],
        'connect-src': ["'self'"],
        'img-src': ["'self'", "data:"],
        'object-src': ["'none'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': [],
      }
    })
  ],
  server: {
    https: {
      key: fs.readFileSync('./certs/localhost+1-key.pem'),
      cert: fs.readFileSync('./certs/localhost+1.pem')
    }
  }
})