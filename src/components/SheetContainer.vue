<template>
    <div class="sheet-page" :style="printMarginStyles">
      <AppHeader />
      
      <div class="sheet-content">
        <!-- 预览区域插槽 -->
        <slot name="preview"></slot>
        
        <!-- 控制面板插槽 -->
        <slot name="control-panel"></slot>
      </div>
      
      <AppFooter />
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import AppHeader from '@/components/AppHeader.vue'
  import AppFooter from '@/components/AppFooter.vue'
  import { useSettingsStore } from '@/stores/settings'
  
  // 获取设置存储
  const settingsStore = useSettingsStore()
  
  // 打印边距样式
  const printMarginStyles = computed(() => {
    const margins = settingsStore.printSettings.margins
    return {
      '--print-margin-top': `${margins.top}mm`,
      '--print-margin-right': `${margins.right}mm`,
      '--print-margin-bottom': `${margins.bottom}mm`,
      '--print-margin-left': `${margins.left}mm`,
    }
  })
  </script>
  
  <style scoped>
  .sheet-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #f5f7fa;
  }
  
  .sheet-content {
    display: flex;
    flex: 1;
    padding: 12px;
    gap: 16px;
    max-width: 1144px;
    margin: 0 auto;
    width: 100%;
  }
  
  /* 打印样式 */
  @media print {
    @page {
      margin: 0;
      size: A4;
    }
  
    body {
      margin: 0;
      background-color: white !important;
    }
  
    .sheet-page {
      min-height: unset;
    }
  
    .sheet-content {
      padding: 0;
      display: block;
      max-width: none;
      margin: 0;
    }
  }
  </style>