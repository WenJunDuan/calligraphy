<template>
    <div class="toggle-item">
      <span class="toggle-label">{{ label }}</span>
      <n-switch v-model:value="modelValue" @update:value="$emit('update:modelValue', $event)" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { NSwitch } from 'naive-ui'
  
  const props = defineProps({
    label: {
      type: String,
      required: true
    },
    modelValue: {
      type: Boolean,
      required: true
    }
  })
  
  defineEmits(['update:modelValue'])
  </script>
  
  <style scoped>
  .toggle-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0;
  }
  
  .toggle-label {
    font-size: 14px;
    color: #333;
  }
  </style>