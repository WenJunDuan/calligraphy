<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">汉字练习字帖生成器</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- 左侧设置面板 -->
      <div class="md:col-span-1">
        <SettingsPanel />
      </div>
      
      <!-- 中间预览区域 -->
      <div class="md:col-span-2">
        <div class="bg-white rounded-lg shadow-md p-6">
          <!-- 文本输入 -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              输入练习文本
            </label>
            <textarea
              v-model="settings.text"
              rows="4"
              class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="请输入要练习的文字..."
            ></textarea>
          </div>
          
          <!-- 预览区域 -->
          <div class="grid grid-cols-4 gap-4">
            <div
              v-for="(char, index) in characters"
              :key="index"
              class="aspect-square border border-gray-200 rounded-lg p-4 bg-white shadow-md"
            >
              <CharacterGrid :character="char" />
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="mt-6 flex justify-end space-x-4">
            <button
              @click="handlePrint"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              打印
            </button>
            <button
              @click="handleDownload"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              下载
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCalligraphyStore } from '../stores/calligraphy';
import { storeToRefs } from 'pinia';
import SettingsPanel from '../components/SettingsPanel.vue';
import CharacterGrid from '../components/CharacterGrid.vue';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const store = useCalligraphyStore();
const { settings } = storeToRefs(store);

const characters = computed(() => settings.value.text.split(''));

const handlePrint = () => {
  window.print();
};

const handleDownload = async () => {
  const element = document.querySelector('.grid');
  if (!element) return;

  const canvas = await html2canvas(element as HTMLElement);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: settings.value.orientation,
    unit: 'mm',
    format: settings.value.paperSize,
  });

  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

  pdf.save('calligraphy.pdf');
};
</script> 