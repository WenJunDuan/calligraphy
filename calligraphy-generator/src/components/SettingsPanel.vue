<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-lg font-semibold mb-6">字帖设置</h2>
    
    <!-- 基本设置 -->
    <div class="space-y-6">
      <!-- 网格类型 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          网格类型
        </label>
        <select
          v-model="settings.gridType"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option
            v-for="style in gridStyles"
            :key="style.value"
            :value="style.value"
          >
            {{ style.name }}
          </option>
        </select>
        <p class="mt-1 text-sm text-gray-500">
          {{ gridStyles.find(s => s.value === settings.gridType)?.description }}
        </p>
      </div>

      <!-- 字体选择 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          字体
        </label>
        <select
          v-model="settings.fontFamily"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option
            v-for="font in fonts"
            :key="font.name"
            :value="font.name"
          >
            {{ font.name }}
          </option>
        </select>
      </div>

      <!-- 字体大小 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          字体大小
        </label>
        <input
          type="range"
          v-model="settings.fontSize"
          min="12"
          max="72"
          class="w-full"
        />
      </div>

      <!-- 颜色 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          颜色
        </label>
        <input
          type="color"
          v-model="settings.color"
          class="w-full h-8 rounded-md"
        />
      </div>

      <!-- 透明度 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          透明度
        </label>
        <input
          type="range"
          v-model="settings.opacity"
          min="0.1"
          max="1"
          step="0.1"
          class="w-full"
        />
      </div>

      <!-- 行间距 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          行间距
        </label>
        <input
          type="range"
          v-model="settings.lineSpacing"
          min="1"
          max="3"
          step="0.1"
          class="w-full"
        />
      </div>

      <!-- 字间距 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          字间距
        </label>
        <input
          type="range"
          v-model="settings.characterSpacing"
          min="0"
          max="2"
          step="0.1"
          class="w-full"
        />
      </div>

      <!-- 纸张设置 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          纸张大小
        </label>
        <select
          v-model="settings.paperSize"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="A4">A4</option>
          <option value="A3">A3</option>
          <option value="B5">B5</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          方向
        </label>
        <select
          v-model="settings.orientation"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="portrait">纵向</option>
          <option value="landscape">横向</option>
        </select>
      </div>
    </div>

    <!-- 自定义字体上传 -->
    <div class="mt-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        上传自定义字体
      </label>
      <input
        type="file"
        accept=".ttf,.otf"
        @change="handleFontUpload"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCalligraphyStore } from '../stores/calligraphy';
import { storeToRefs } from 'pinia';

const store = useCalligraphyStore();
const { settings, fonts, gridStyles } = storeToRefs(store);

const handleFontUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const fontName = file.name.replace(/\.[^/.]+$/, '');
    store.addCustomFont({
      name: fontName,
      file: URL.createObjectURL(file),
      type: 'custom',
    });
  }
};
</script> 