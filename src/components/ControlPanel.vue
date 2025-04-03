<template>
    <div class="control-panel">
      <!-- 操作按钮区域 -->
      <div class="panel-actions">
        <slot name="actions">
          <n-button class="export-btn" @click="$emit('export')">导出</n-button>
          <n-button type="primary" class="print-btn" @click="$emit('print')">打印</n-button>
        </slot>
      </div>
      
      <!-- 面板内容区域 -->
      <div class="panel-content">
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { NButton } from 'naive-ui'
  
  // 定义组件事件
  defineEmits(['print', 'export'])
  </script>
  
  <style scoped>
  .control-panel {
    width: 300px;
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .panel-actions {
    display: flex;
    gap: 8px;
  }
  
  .export-btn, .print-btn {
    flex: 1;
  }
  
  .panel-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
  }
  
  @media print {
    .control-panel {
      display: none;
    }
  }
  </style>