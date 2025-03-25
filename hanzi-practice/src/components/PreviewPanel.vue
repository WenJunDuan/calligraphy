<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md"
        :class="{ 'dark:bg-gray-800 dark:text-white': isDarkMode }">
        <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 class="text-lg font-semibold">字帖预览</h2>
            <div class="flex space-x-2">
                <span v-if="totalPages > 1" class="px-2 py-1 text-sm text-gray-600 dark:text-gray-300">
                    第 {{ currentPage + 1 }} / {{ totalPages }} 页
                </span>
                <button v-if="totalPages > 1" @click="prevPage" :disabled="currentPage === 0"
                    class="p-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    title="上一页">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                </button>
                <button v-if="totalPages > 1" @click="nextPage" :disabled="currentPage === totalPages - 1"
                    class="p-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    title="下一页">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                </button>
                <button @click="print"
                    class="flex items-center space-x-1 px-3 py-1 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z">
                        </path>
                    </svg>
                    <span class="text-sm">打印</span>
                </button>
            </div>
        </div>

        <!-- 页面预览区域 -->
        <div ref="previewContainerRef" class="p-4 print-container">
            <!-- 设置预览的纸张样式 -->
            <div class="preview-paper mx-auto bg-white shadow-md" :class="[
            paperOrientation === 'portrait' ? 'paper-portrait' : 'paper-landscape',
            `paper-${paperSize.toLowerCase()}`
        ]" :style="paperStyle">
                <!-- 当前页的内容 -->
                <div class="grid grid-cols-1" :style="gridContainerStyle">
                    <!-- 根据每行字数和当前页内容计算每一行 -->
                    <div v-for="(rowChars, rowIndex) in currentPageRows" :key="`row-${rowIndex}`"
                        class="flex justify-center" :style="rowStyle">
                        <div v-for="(char, charIndex) in rowChars" :key="`char-${rowIndex}-${charIndex}`"
                            class="grid-item" :style="gridItemStyle">
                            <CharacterGrid :character="char" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useHanziStore } from '@/stores/hanziStore';
import CharacterGrid from '@/components/CharacterGrid.vue';

const store = useHanziStore();
const settings = computed(() => store.settings);
const isDarkMode = computed(() => store.isDarkMode);

const currentPage = ref(0);
const previewContainerRef = ref<HTMLElement | null>(null);

// 计算当前页内容和总页数
const characters = computed(() => settings.value.text.split(''));
const charsPerPage = computed(() => store.pageCharacterCount);
const charsPerLine = computed(() => settings.value.charsPerLine);

const totalPages = computed(() => {
    if (characters.value.length === 0) return 1;
    return Math.ceil(characters.value.length / charsPerPage.value);
});

// 获取当前页的字符
const currentPageChars = computed(() => {
    const startIndex = currentPage.value * charsPerPage.value;
    const endIndex = Math.min(startIndex + charsPerPage.value, characters.value.length);
    return characters.value.slice(startIndex, endIndex);
});

// 根据每行字数将当前页字符分成行
const currentPageRows = computed(() => {
    const rows = [];
    const chars = currentPageChars.value;

    for (let i = 0; i < chars.length; i += charsPerLine.value) {
        rows.push(chars.slice(i, i + charsPerLine.value));
    }

    return rows;
});

// 纸张相关
const paperSize = computed(() => settings.value.paperSize);
const paperOrientation = computed(() => settings.value.paperOrientation);
const paperMargin = computed(() => settings.value.paperMargin);

// 纸张样式
const paperStyle = computed(() => {
    return {
        marginTop: `${paperMargin.value.top}mm`,
        marginRight: `${paperMargin.value.right}mm`,
        marginBottom: `${paperMargin.value.bottom}mm`,
        marginLeft: `${paperMargin.value.left}mm`,
    };
});

// 网格容器样式
const gridContainerStyle = computed(() => {
    return {
        rowGap: `${settings.value.lineSpacing * 0.5}rem`,
    };
});

// 行样式
const rowStyle = computed(() => {
    return {
        marginBottom: `${settings.value.lineSpacing * 0.5}rem`,
    };
});

// 单个字的网格样式
const gridItemStyle = computed(() => {
    return {
        margin: `0 ${settings.value.characterSpacing * 0.25}rem`,
    };
});

// 页面导航
const prevPage = () => {
    if (currentPage.value > 0) {
        currentPage.value--;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value - 1) {
        currentPage.value++;
    }
};

// 打印功能
const print = () => {
    window.print();
};

// 当总页数变化时重置当前页码
watch(totalPages, (newTotal) => {
    if (currentPage.value >= newTotal) {
        currentPage.value = Math.max(0, newTotal - 1);
    }
});

// 监听字符数变化重新计算页数
watch(() => characters.value.length, () => {
    currentPage.value = 0;
});

// 初始化
onMounted(() => {
    // 确保打印时隐藏不必要的元素
    document.documentElement.style.setProperty('--printing-content', 'none');
});
</script>

<style scoped>
/* 纸张尺寸 - 按比例缩放，实际尺寸在打印时使用 */
.preview-paper {
    transition: all 0.3s ease;
    border-radius: 4px;
    overflow: hidden;
    box-sizing: border-box;
}

/* A4 纸张 (210mm x 297mm) */
.paper-a4.paper-portrait {
    width: 210mm;
    max-width: 100%;
    aspect-ratio: 210 / 297;
}

.paper-a4.paper-landscape {
    width: 297mm;
    max-width: 100%;
    aspect-ratio: 297 / 210;
}

/* A3 纸张 (297mm x 420mm) */
.paper-a3.paper-portrait {
    width: 297mm;
    max-width: 100%;
    aspect-ratio: 297 / 420;
}

.paper-a3.paper-landscape {
    width: 420mm;
    max-width: 100%;
    aspect-ratio: 420 / 297;
}

/* B5 纸张 (176mm x 250mm) */
.paper-b5.paper-portrait {
    width: 176mm;
    max-width: 100%;
    aspect-ratio: 176 / 250;
}

.paper-b5.paper-landscape {
    width: 250mm;
    max-width: 100%;
    aspect-ratio: 250 / 176;
}

.grid-item {
    display: inline-flex;
    justify-content: center;
    align-items: center;
}

@media print {
    .preview-paper {
        width: 100% !important;
        max-width: 100% !important;
        box-shadow: none !important;
    }

    .paper-a4.paper-portrait {
        width: 210mm !important;
        height: 297mm !important;
    }

    .paper-a4.paper-landscape {
        width: 297mm !important;
        height: 210mm !important;
    }

    .paper-a3.paper-portrait {
        width: 297mm !important;
        height: 420mm !important;
    }

    .paper-a3.paper-landscape {
        width: 420mm !important;
        height: 297mm !important;
    }

    .paper-b5.paper-portrait {
        width: 176mm !important;
        height: 250mm !important;
    }

    .paper-b5.paper-landscape {
        width: 250mm !important;
        height: 176mm !important;
    }
}
</style>