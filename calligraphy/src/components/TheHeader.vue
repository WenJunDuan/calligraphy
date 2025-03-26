<template>
  <header class="bg-white border-b border-gray-100">
    <nav class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center">
          <img src="../assets/logo.png" alt="Z2H字帖" class="h-8" />
        </router-link>

        <!-- 导航链接 -->
        <div class="flex items-center space-x-8">
          <router-link 
            to="/practice" 
            class="text-gray-700 hover:text-gray-900 transition-colors"
          >
            汉字练习
          </router-link>
          <router-link 
            to="/control" 
            class="text-gray-700 hover:text-gray-900 transition-colors"
          >
            控笔练习
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
// 组件逻辑
</script> 