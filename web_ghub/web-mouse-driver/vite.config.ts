import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    // localhost 被视为安全上下文，无需 HTTPS
    port: 5173
  },
  build: {
    target: 'esnext'
  }
})
