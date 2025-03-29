import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        },
        {
          '@vueuse/core': [
            'useMouse',
            'useWindowSize',
            'useStorage',
            'useFullscreen',
            'useColorMode',
            'useDark',
            'usePreferredDark'
          ]
        }
      ],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // 优化打包配置
    target: 'esnext', // 为Bun优化输出
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // 拆分代码块
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'naive-ui-vendor': ['naive-ui'],
          'libs': ['@vueuse/core'],
          'cnchar': ['cnchar', 'cnchar-draw', 'cnchar-order', 'cnchar-poly', 'cnchar-trad'],
          'pinyin': ['pinyin-pro']
        }
      }
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 设置最大资源内联阈值
    assetsInlineLimit: 4096,
  },
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  // Bun优化配置
  optimizeDeps: {
    // Bun已经很快了，可以减少预构建优化
    esbuildOptions: {
      target: 'esnext'
    }
  }
})