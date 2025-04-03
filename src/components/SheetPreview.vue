<template>
    <div class="sheet-preview" ref="previewContainerRef">
      <!-- Loop through pages -->
      <div 
        class="page" 
        v-for="(pageCells, pageIndex) in pages" 
        :key="`page-${pageIndex}`"
      >
        <div class="paper" :style="paperStyle">
          <slot 
            name="content" 
            :page-cells="pageCells" 
            :page-index="pageIndex"
          >
            <!-- 默认内容插槽 -->
            <div class="empty-state" v-if="!pageCells || pageCells.length === 0">
              <slot name="empty-state">请在右侧输入要练习的内容</slot>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, CSSProperties, computed, PropType } from 'vue'
  import { useSettingsStore } from '@/stores/settings'
  
  const props = defineProps({
    // 纸张样式
    paperStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({
        width: '795px', // A4 width
        minHeight: '1133px', // A4 height
        padding: '20px',
        boxSizing: 'border-box',
        backgroundColor: 'white',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
      })
    },
    // 分页的内容数组
    pages: {
      type: Array,
      default: () => [[]]
    }
  })
  
  // 预览容器引用，用于打印和导出
  const previewContainerRef = ref<HTMLElement | null>(null)
  
  // 暴露预览容器引用，供父组件访问
  defineExpose({
    previewContainerRef
  })
  
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
  .sheet-preview {  
    flex: 1;  
    background-color: #eef1f5;  
    border-radius: 8px;  
    display: flex;  
    flex-direction: column; /* Stack pages vertically */
    align-items: center; /* Center pages horizontally */
    overflow: auto;  
    gap: 20px; /* Space between pages */
  }
  
  .page {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
  }
  
  .paper {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
  
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    color: #aaa;
    font-size: 16px;
  }
  
  /* 打印样式 */
  @media print {
    @page {
      margin: 0; /* Remove browser default margins */
      size: A4;  /* Explicitly set paper size for print */
    }
  
    .sheet-preview {  
      overflow: visible;  
      background-color: transparent; /* Remove background for print */
      padding: 0;  
      display: block; /* Reset flex layout for print */
      gap: 0;
      border-radius: 0;
      height: 100vh; /* Try setting preview height */
    }  
      
    .page {
      page-break-after: always; /* Ensure page breaks between .page elements */
      width: 100%; /* Ensure page takes full width */
      height: 100%; /* Ensure page takes full height */
      display: flex; /* Use flex to center paper */
      justify-content: center;
      align-items: flex-start; /* Align paper to top */
      overflow: hidden; /* Prevent content spill */
      background-color: transparent; /* Ensure no background interfere */
    }
  
    .paper {  
      box-shadow: none;  
      margin: 0; /* Reset margin for print */
      width: 210mm; /* Explicit A4 width */
      height: 297mm; /* Explicit A4 height */
      background-color: white; /* Ensure background for content */
      /* Apply print margins using padding with CSS variables */
      padding-top: var(--print-margin-top);
      padding-right: var(--print-margin-right);
      padding-bottom: var(--print-margin-bottom);
      padding-left: var(--print-margin-left);
      box-sizing: border-box; 
    }
  }
  </style>