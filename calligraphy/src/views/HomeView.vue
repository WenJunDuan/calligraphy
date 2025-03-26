<script setup lang="ts">
import { ref } from 'vue'

const title = ref('书法练习系统')
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Logo和标语区域 -->
    <div class="container mx-auto px-4 pt-20 pb-16 text-center">
      <div class="mb-8">
        <img src="../assets/logo.png" alt="Z2H字帖" class="h-24 mx-auto mb-6" />
      </div>
      <h2 class="text-gray-800 text-xl mb-4">用正确的方法刻意练习</h2>
      <p class="text-gray-600 mb-8">每个人都能写出一手漂亮的字</p>
      <router-link 
        to="/practice" 
        class="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        开始生成
      </router-link>
    </div>

    <!-- 功能卡片区域 -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 class="text-lg font-medium mb-2">汉字字帖</h3>
          <p class="text-gray-600 text-sm">对着个性化字帖反复练习，加深肌肉记忆</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 class="text-lg font-medium mb-2">词组字帖</h3>
          <p class="text-gray-600 text-sm">练习词组时让学习习惯自然又顺畅</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 class="text-lg font-medium mb-2">段落字帖</h3>
          <p class="text-gray-600 text-sm">练习段落时，加强文字之间的整体美感</p>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <footer class="container mx-auto px-4 py-8 text-center text-gray-500 text-sm">
      <p>Z2H = Zero to Hero</p>
      <p class="mt-2">Copyright © 2024 Z2H.CN</p>
    </footer>
  </div>
</template>

<style scoped>
/* 自定义样式 */
</style> 