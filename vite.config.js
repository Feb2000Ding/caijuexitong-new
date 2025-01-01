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
        target: 'http://192.168.43.234',   // 后端服务器地址
        changeOrigin: true,                 // 修改请求头中的 origin 字段
        secure: false,                      // 如果是 https 服务器，可以设置为 true
        rewrite: (path) => path.replace(/^\/api/, ''), // 可选：移除路径中的 `/api` 前缀
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
