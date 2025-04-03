<template>
    <div class="setting-item">
      <!-- 设置标签 -->
      <div class="setting-label">{{ label }}</div>
      
      <!-- 设置控件插槽 -->
      <div class="setting-control">
        <slot></slot>
      </div>
      
      <!-- 设置值显示 -->
      <div v-if="showValue" class="setting-value">
        <slot name="value">{{ value }}</slot>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    // 设置项标签
    label: {
      type: String,
      required: true
    },
    // 设置项值（用于显示）
    value: {
      type: [String, Number],
      default: ''
    },
    // 是否显示值
    showValue: {
      type: Boolean,
      default: true
    }
  })
  </script>
  
  <style scoped>
  .setting-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .setting-label {
    flex: 0 0 70px;
    margin-bottom: 0;
    font-size: 14px;
    color: #666;
  }
  
  .setting-control {
    flex: 1 1 auto;
  }
  
  .setting-value {
    flex: 0 0 50px;
    text-align: right;
    margin-top: 0;
    font-size: 12px;
    color: #999;
  }
  </style>