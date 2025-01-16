import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'


export default defineConfig({
  plugins: [react(),
    istanbul({
      include: 'src/**/*.js',
      exclude: ['node_modules', 'test/**', 'dist'],
    })
  ],
  test: {
    globals: true,
    environment: 'node',
  },
  server: {
    host: true
  }
})