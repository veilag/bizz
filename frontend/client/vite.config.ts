import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // base: "/static/client/",

  build: {
    outDir: "../../static/client",
    emptyOutDir: true,
  }
})
