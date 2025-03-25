<template>
  <div class="relative w-full h-full">
    <!-- 网格背景 -->
    <div
      class="absolute inset-0"
      :class="{
        'grid-tian': settings.gridType === 'tian',
        'grid-mi': settings.gridType === 'mi',
        'grid-huigong': settings.gridType === 'huigong',
      }"
    ></div>
    
    <!-- 文字内容 -->
    <div
      class="relative z-10 flex items-center justify-center w-full h-full"
      :style="{
        fontSize: `${settings.fontSize}px`,
        fontFamily: settings.fontFamily,
        color: settings.color,
        opacity: settings.opacity,
        lineHeight: `${settings.lineSpacing}em`,
        letterSpacing: `${settings.characterSpacing}em`,
      }"
    >
      {{ character }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCalligraphyStore } from '../stores/calligraphy';
import { storeToRefs } from 'pinia';

const store = useCalligraphyStore();
const { settings } = storeToRefs(store);

defineProps<{
  character: string;
}>();
</script>

<style scoped>
.grid-tian {
  background-image: linear-gradient(to right, #ddd 1px, transparent 1px),
    linear-gradient(to bottom, #ddd 1px, transparent 1px);
  background-size: 50% 50%;
}

.grid-mi {
  background-image: linear-gradient(to right, #ddd 1px, transparent 1px),
    linear-gradient(to bottom, #ddd 1px, transparent 1px),
    linear-gradient(45deg, #ddd 1px, transparent 1px),
    linear-gradient(-45deg, #ddd 1px, transparent 1px);
  background-size: 50% 50%;
}

.grid-huigong {
  background-image: linear-gradient(to right, #ddd 1px, transparent 1px),
    linear-gradient(to bottom, #ddd 1px, transparent 1px),
    linear-gradient(to right, #ddd 1px, transparent 1px) 25%,
    linear-gradient(to bottom, #ddd 1px, transparent 1px) 25%;
  background-size: 50% 50%;
}
</style> 