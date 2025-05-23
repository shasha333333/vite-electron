import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    vue(),
  ],
  base: './', // 确保资源路径是相对路径
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },

})