<template>
  <div class="min-h-screen" :class="{ 'bg-gray-100': !isDarkMode, 'bg-gray-900 text-gray-200': isDarkMode }">
    <AppHeader />
    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- 左侧设置面板 -->
        <div class="lg:col-span-4">
          <SettingsPanel />
        </div>

        <!-- 右侧预览区域 -->
        <div class="lg:col-span-8">
          <PreviewPanel />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import SettingsPanel from '@/components/SettingsPanel.vue';
import PreviewPanel from '@/components/PreviewPanel.vue';
import { useHanziStore } from '@/stores/hanziStore';

const store = useHanziStore();
const isDarkMode = computed(() => store.isDarkMode);

onMounted(() => {
  // 从本地存储加载设置
  store.loadFromLocalStorage();

  // 添加打印样式
  const style = document.createElement('style');
  style.innerHTML = `
    @media print {
      body * {
        visibility: hidden;
      }
      .print-container, .print-container * {
        visibility: visible;
      }
      .print-container {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .no-print {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
});
</script>