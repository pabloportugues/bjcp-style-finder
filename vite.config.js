import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/bjcp-style-finder/', // Replace 'bjcp-style-finder' with your exact repo name if different
})
