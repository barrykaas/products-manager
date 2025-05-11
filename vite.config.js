import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from 'vite-plugin-eslint';


// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), eslint()],
    resolve: {
        alias: {
            'src': '/src'
        }
    },
    server: {
        proxy: {
            '/v2': {
                target: 'http://localhost:8001',
                // changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, '')
            },
            '/media': {
                target: 'http://localhost:8001',
                // changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/media/, '')
            },
        }
    }
})
