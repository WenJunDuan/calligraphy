<template>
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md"
        :class="{ 'dark:bg-gray-800 dark:text-white': isDarkMode }">
        <div class="container mx-auto px-4 py-4 flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <svg class="w-8 h-8 text-primary-600" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path
                        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z"
                        stroke="currentColor" stroke-width="2" />
                    <path d="M9 12H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M9 16H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                <h1 class="text-xl font-bold">汉字练习字帖生成器</h1>
            </div>

            <div class="flex items-center space-x-4">
                <button @click="toggleDarkMode"
                    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    :title="isDarkMode ? '切换为亮色模式' : '切换为暗色模式'">
                    <svg v-if="isDarkMode" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z">
                        </path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z">
                        </path>
                    </svg>
                </button>

                <button @click="printSheet"
                    class="flex items-center space-x-1 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
                        </path>
                    </svg>
                    <span>打印字帖</span>
                </button>

                <button @click="resetSettings"
                    class="flex items-center space-x-1 px-3 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                        </path>
                    </svg>
                    <span>重置设置</span>
                </button>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useHanziStore } from '@/stores/hanziStore';

const store = useHanziStore();
const isDarkMode = computed(() => store.isDarkMode);

const toggleDarkMode = () => {
    store.toggleDarkMode();
};

const printSheet = () => {
    window.print();
};

const resetSettings = () => {
    if (confirm('确定要重置所有设置吗？这将丢失您的所有自定义设置。')) {
        store.resetSettings();
    }
};
</script>