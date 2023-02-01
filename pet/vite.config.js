import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // 端口配置
  server:{
    host:'localhost',
    port:8080,
    proxy:{
      "/api":"http://localhost:3000"
    }
  },
  plugins: [vue()]
})
