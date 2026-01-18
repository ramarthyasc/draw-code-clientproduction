import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    server: {
        proxy: {
            '/proPic': 'http://localhost:5000',
            '/draw-login': 'http://localhost:5000',
            '/draw-secure': 'http://localhost:5000',
            '/api/draw-submit': 'http://localhost:5000',
            '/api/refresh-auth': 'http://localhost:5000',
            '/docs/template': 'http://localhost:5000',
            '/docs/questions': 'http://localhost:5000',
            '/admin/questions': 'http://localhost:5000',
            '/admin/new-question': 'http://localhost:5000',
            '/admin/template': 'http://localhost:5000',
            '/admin/new-template': 'http://localhost:5000',
            '/admin/delete-question': 'http://localhost:5000',
        },

    }

})

