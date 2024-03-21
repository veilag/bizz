import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/static/webapp/",
  build: {
    outDir: "../../static/webapp",
    emptyOutDir: true
  }
})
