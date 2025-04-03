import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// 获取当前文件的目录
const __dirname = dirname(fileURLToPath(import.meta.url))

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
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    // 使用esbuild替代terser，避免依赖问题
    minify: 'esbuild',
    // 为Bun优化输出
    target: 'esnext',
    // 简化分块策略，减少空块问题
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['naive-ui'],
          'utils': ['@vueuse/core'],
          // 合并中文处理相关库
          'chinese-utils': ['cnchar', 'cnchar-draw', 'cnchar-order', 'cnchar-poly', 'cnchar-trad', 'pinyin-pro']
        }
      }
    },
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 设置最大资源内联阈值
    assetsInlineLimit: 4096,
    // 禁用sourcemap以减小构建大小
    sourcemap: false
  },
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  // Bun特定优化
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  }
})