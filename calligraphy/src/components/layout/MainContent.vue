<template>
  <main class="flex-1 flex mt-16 mb-12">
    <!-- 预览区域 -->
    <div class="flex-1 bg-gray-50 p-6 overflow-auto">
      <div class="bg-white rounded-lg shadow-lg min-h-full p-8">
        <canvas ref="previewCanvas" class="w-full h-full"></canvas>
      </div>
    </div>
    
    <!-- 设置面板 -->
    <div class="w-80 bg-white border-l border-gray-200 overflow-y-auto">
      <div class="p-6 space-y-6">
        <!-- 文本设置 -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold">文本设置</h2>
          <textarea
            class="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入要生成的文字..."
          ></textarea>
        </div>

        <!-- 字体设置 -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold">字体设置</h2>
          <select class="w-full p-2 border border-gray-300 rounded-lg">
            <option value="kaiti">楷体</option>
            <option value="songti">宋体</option>
            <option value="lishu">隶书</option>
          </select>
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">字体大小</label>
            <input type="range" class="w-full" min="20" max="100" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">字体颜色</label>
            <input type="color" class="w-full h-10 rounded-lg" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">透明度</label>
            <input type="range" class="w-full" min="0" max="100" />
          </div>
        </div>

        <!-- 格式设置 -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold">格式设置</h2>
          <select class="w-full p-2 border border-gray-300 rounded-lg">
            <option value="tian">田字格</option>
            <option value="mi">米字格</option>
            <option value="hui">回宫格</option>
            <option value="blank">空白格</option>
          </select>
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">格子大小</label>
            <input type="range" class="w-full" min="30" max="100" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">线条粗细</label>
            <input type="range" class="w-full" min="1" max="5" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">线条颜色</label>
            <input type="color" class="w-full h-10 rounded-lg" />
          </div>
        </div>

        <!-- 布局设置 -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold">布局设置</h2>
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">字间距</label>
            <input type="range" class="w-full" min="0" max="100" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">行间距</label>
            <input type="range" class="w-full" min="0" max="100" />
          </div>
          <div class="space-y-2">
            <label class="block text-sm text-gray-600">每行字数</label>
            <input type="number" class="w-full p-2 border border-gray-300 rounded-lg" min="1" max="20" />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const previewCanvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
  // Canvas初始化逻辑
})
</script> 