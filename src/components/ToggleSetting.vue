<script setup lang="ts">
import { NSwitch } from 'naive-ui'
import { computed } from 'vue'

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

const emit = defineEmits(['update:modelValue'])

// 创建本地计算属性来处理双向绑定
const checked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="toggle-item">
    <span class="toggle-label">{{ label }}</span>
    <n-switch v-model:value="checked" />
  </div>
</template>