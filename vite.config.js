import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     vue(),
//     vueDevTools(),
//   ],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     },
//   },
// })

export default defineConfig({
  plugins: [
    vue(),               // 启用 Vue 插件，处理 .vue 文件
    vueDevTools(),       // 启用 Vue 开发工具插件
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.8.184:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/ws/judge': {
        target: 'ws://192.168.8.184:3001',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      // 配置 @ 为 src 文件夹的别名
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
