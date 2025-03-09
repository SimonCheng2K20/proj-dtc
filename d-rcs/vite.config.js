import { defineConfig } from 'vite'
const vuePlugin = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')
const { resolve } = require('path')
import { injectHtml } from 'vite-plugin-html'
require('dotenv').config({ path: './.env' })

export default defineConfig({
  plugins: [
    vuePlugin(),
    vueJsx(),
    injectHtml({
      injectData: {
        version: new Date(),
        publicTitle: '遠距醫療會診平臺',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      comps: resolve(__dirname, 'src/components/'),
      views: resolve(__dirname, 'src/views/'),
      layouts: resolve(__dirname, 'src/layouts'),
      styles: resolve(__dirname, 'src/styles/'),
      imgs: resolve(__dirname, 'src/assets/images/'),
      Service: resolve(__dirname, 'src/service/'),
      utils: resolve(__dirname, 'src/utils'),
      api: resolve(__dirname, 'src/service/apis.js'),
    },
  },
  server: {
    proxy: {
      '^/rmeeting/.*': {
        target: 'https://rmeeting.datacom.com.tw',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rmeeting/, ''),
      },
    },
  },
  base: './',
})
