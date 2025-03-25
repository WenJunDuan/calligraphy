<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md"
        :class="{ 'dark:bg-gray-800 dark:text-white': isDarkMode }">
        <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h2 class="text-lg font-semibold">字帖设置</h2>
            <div class="flex space-x-2">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                    class="px-3 py-1 rounded-md text-sm transition-colors" :class="activeTab === tab.id ?
            'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' :
            'hover:bg-gray-100 dark:hover:bg-gray-700'">
                    {{ tab.name }}
                </button>
            </div>
        </div>

        <div class="p-4">
            <!-- 文本内容设置 -->
            <div v-show="activeTab === 'text'" class="space-y-4">
                <div class="form-group">
                    <label for="text-input" class="form-label">练习文本</label>
                    <textarea id="text-input" v-model="settings.text"
                        class="textarea dark:bg-gray-700 dark:text-white dark:border-gray-600" rows="5"
                        placeholder="请输入您要练习的汉字..."></textarea>
                    <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        字数：{{ settings.text.length }}
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">每行字数</label>
                    <div class="flex items-center space-x-2">
                        <input type="range" v-model.number="settings.charsPerLine" min="1" max="20"
                            class="form-range flex-grow" />
                        <span class="w-8 text-center">{{ settings.charsPerLine }}</span>
                    </div>
                </div>
            </div>

            <!-- 网格设置 -->
            <div v-show="activeTab === 'grid'" class="space-y-4">
                <div class="form-group">
                    <label class="form-label">字帖背景类型</label>
                    <select v-model="settings.gridType"
                        class="select dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <option v-for="grid in gridTypes" :key="grid.value" :value="grid.value">
                            {{ grid.name }} - {{ grid.description }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">网格大小</label>
                    <div class="flex items-center space-x-2">
                        <input type="range" v-model.number="settings.gridSize" min="40" max="120" step="10"
                            class="form-range flex-grow" />
                        <span class="w-12 text-center">{{ settings.gridSize }}px</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">线条样式</label>
                    <div class="grid grid-cols-3 gap-2">
                        <div v-for="style in lineStyles" :key="style.value"
                            @click="settings.gridLineStyle = style.value"
                            class="flex items-center justify-center p-2 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                            :class="settings.gridLineStyle === style.value ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : 'border-gray-300 dark:border-gray-600'">
                            <div class="w-full h-1" :class="{
            'border-t': style.value === 'solid',
            'border-t border-dashed': style.value === 'dashed',
            'border-t border-dotted': style.value === 'dotted'
        }"></div>
                            <span class="ml-1 text-xs">{{ style.name }}</span>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">线条粗细</label>
                    <div class="flex items-center space-x-2">
                        <input type="range" v-model.number="settings.gridLineWidth" min="1" max="5"
                            class="form-range flex-grow" />
                        <span class="w-10 text-center">{{ settings.gridLineWidth }}px</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">线条颜色</label>
                    <div class="flex space-x-2">
                        <input type="color" v-model="settings.gridLineColor"
                            class="w-10 h-10 rounded p-1 cursor-pointer" />
                        <span class="flex-grow py-2">{{ settings.gridLineColor }}</span>
                    </div>
                </div>

                <div class="form-group">
                    <div class="flex items-center">
                        <input type="checkbox" id="grid-sublines" v-model="settings.gridSublines"
                            class="form-checkbox" />
                        <label for="grid-sublines" class="ml-2 text-sm font-medium">
                            显示辅助线
                        </label>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        部分网格类型（如田字格、米字格）支持辅助线
                    </p>
                </div>
            </div>

            <!-- 字体设置 -->
            <div v-show="activeTab === 'font'" class="space-y-4">
                <div class="form-group">
                    <label class="form-label">字体</label>
                    <select v-model="settings.fontFamily"
                        class="select dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <option v-for="font in fonts" :key="font.name" :value="font.name"
                            :style="{ fontFamily: font.family }">
                            {{ font.name }} {{ font.type === 'custom' ? '(自定义)' : '' }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">字体大小</label>
                    <div class="flex items-center space-x-2">
                        <input type="range" v-model.number="settings.fontSize" min="20" max="80" step="4"
                            class="form-range flex-grow" />
                        <span class="w-12 text-center">{{ settings.fontSize }}px</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">字体颜色</label>
                    <div class="flex space-x-2">
                        <input type="color" v-model="settings.fontColor" class="w-10 h-10 rounded p-1 cursor-pointer" />
                        <span class="flex-grow py-2">{{ settings.fontColor }}</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">字体透明度</label>
                    <div class="flex items-center space-x-2">
                        <input type="range" v-model.number="settings.fontOpacity" min="0.1" max="1" step="0.1"
                            class="form-range flex-grow" />
                        <span class="w-12 text-center">{{ Math.round(settings.fontOpacity * 100) }}%</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">字间距</label>
                    <div class="flex items-center space-x-2">
                        <input type="range" v-model.number="settings.characterSpacing" min="0" max="2" step="0.1"
                            class="form-range flex-grow" />
                        <span class="w-12 text-center">{{ settings.characterSpacing.toFixed(1) }}</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">行间距</label>
                    <div class="flex items-center space-x-2">
                        <input type="range" v-model.number="settings.lineSpacing" min="1" max="3" step="0.1"
                            class="form-range flex-grow" />
                        <span class="w-12 text-center">{{ settings.lineSpacing.toFixed(1) }}</span>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">上传自定义字体</label>
                    <input type="file" ref="fontFileInput" @change="handleFontUpload" accept=".ttf,.otf"
                        class="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 dark:file:bg-primary-900 dark:file:text-primary-200 hover:file:bg-primary-100 dark:hover:file:bg-primary-800" />
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        支持 .ttf 和 .otf 格式的字体文件
                    </p>
                </div>

                <div v-if="customFonts.length > 0" class="form-group">
                    <label class="form-label">自定义字体管理</label>
                    <div class="mt-2 space-y-2">
                        <div v-for="font in customFonts" :key="font.name"
                            class="flex items-center justify-between p-2 border rounded dark:border-gray-700">
                            <span :style="{ fontFamily: font.family }">{{ font.name }}</span>
                            <button @click="removeCustomFont(font.name)"
                                class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                title="删除字体">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                    </path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 页面设置 -->
            <div v-show="activeTab === 'page'" class="space-y-4">
                <div class="form-group">
                    <label class="form-label">纸张大小</label>
                    <select v-model="settings.paperSize"
                        class="select dark:bg-gray-700 dark:text-white dark:border-gray-600">
                        <option v-for="size in paperSizes" :key="size.value" :value="size.value">
                            {{ size.name }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">纸张方向</label>
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        <div @click="settings.paperOrientation = 'portrait'"
                            class="flex flex-col items-center p-3 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                            :class="settings.paperOrientation === 'portrait' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : 'border-gray-300 dark:border-gray-600'">
                            <div class="w-10 h-14 border-2 border-gray-400 dark:border-gray-500 rounded"></div>
                            <span class="mt-2 text-sm">纵向</span>
                        </div>
                        <div @click="settings.paperOrientation = 'landscape'"
                            class="flex flex-col items-center p-3 border rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                            :class="settings.paperOrientation === 'landscape' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : 'border-gray-300 dark:border-gray-600'">
                            <div class="w-14 h-10 border-2 border-gray-400 dark:border-gray-500 rounded"></div>
                            <span class="mt-2 text-sm">横向</span>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">页边距</label>
                    <div class="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <label class="text-xs text-gray-500 dark:text-gray-400">上边距 (mm)</label>
                            <input type="number" v-model.number="settings.paperMargin.top" min="0" max="50"
                                class="input mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        </div>
                        <div>
                            <label class="text-xs text-gray-500 dark:text-gray-400">右边距 (mm)</label>
                            <input type="number" v-model.number="settings.paperMargin.right" min="0" max="50"
                                class="input mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        </div>
                        <div>
                            <label class="text-xs text-gray-500 dark:text-gray-400">下边距 (mm)</label>
                            <input type="number" v-model.number="settings.paperMargin.bottom" min="0" max="50"
                                class="input mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        </div>
                        <div>
                            <label class="text-xs text-gray-500 dark:text-gray-400">左边距 (mm)</label>
                            <input type="number" v-model.number="settings.paperMargin.left" min="0" max="50"
                                class="input mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- 笔画设置 -->
            <div v-show="activeTab === 'stroke'" class="space-y-4">
                <div class="form-group">
                    <div class="flex items-center">
                        <input type="checkbox" id="show-strokes" v-model="settings.showStrokes" class="form-checkbox" />
                        <label for="show-strokes" class="ml-2 text-sm font-medium">
                            显示笔画
                        </label>
                    </div>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        启用后将显示汉字笔画信息（仅支持常用汉字）
                    </p>
                </div>

                <div v-if="settings.showStrokes" class="space-y-4">
                    <div class="form-group">
                        <div class="flex items-center">
                            <input type="checkbox" id="stroke-numbering" v-model="settings.strokeNumbering"
                                class="form-checkbox" />
                            <label for="stroke-numbering" class="ml-2 text-sm font-medium">
                                显示笔顺序号
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="flex items-center">
                            <input type="checkbox" id="stroke-colors" v-model="settings.strokeColors"
                                class="form-checkbox" />
                            <label for="stroke-colors" class="ml-2 text-sm font-medium">
                                使用彩色笔画
                            </label>
                        </div>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            不同类型的笔画使用不同颜色显示
                        </p>
                    </div>

                    <div class="form-group">
                        <label class="form-label">笔画透明度</label>
                        <div class="flex items-center space-x-2">
                            <input type="range" v-model.number="settings.strokeOpacity" min="0.1" max="1" step="0.1"
                                class="form-range flex-grow" />
                            <span class="w-12 text-center">{{ Math.round(settings.strokeOpacity * 100) }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useHanziStore } from '@/stores/hanziStore';
import type { Font } from '@/types';

const store = useHanziStore();
const settings = store.settings;
const fonts = computed(() => store.fonts);
const gridTypes = computed(() => store.gridTypes);
const lineStyles = computed(() => store.lineStyles);
const paperSizes = computed(() => store.paperSizes);
const isDarkMode = computed(() => store.isDarkMode);

// 筛选出自定义字体
const customFonts = computed(() => fonts.value.filter(font => font.type === 'custom'));

// 设置标签页
const tabs = [
    { id: 'text', name: '文本' },
    { id: 'grid', name: '网格' },
    { id: 'font', name: '字体' },
    { id: 'page', name: '页面' },
    { id: 'stroke', name: '笔画' },
];
const activeTab = ref('text');

// 字体上传相关
const fontFileInput = ref<HTMLInputElement | null>(null);

const handleFontUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        if (!e.target || typeof e.target.result !== 'string') return;

        // 创建字体名称（去掉扩展名）
        const fontName = file.name.replace(/\.[^/.]+$/, '');

        // 创建字体样式
        const fontFace = new FontFace(fontName, e.target.result);

        // 字体加载
        fontFace.load().then((loadedFace) => {
            // 添加字体到document
            document.fonts.add(loadedFace);

            // 添加字体到store
            store.addCustomFont({
                name: fontName,
                family: fontName,
                type: 'custom',
                url: e.target.result,
            });

            // 自动选择上传的字体
            store.updateSettings({ fontFamily: fontName });

            // 重置文件输入
            if (fontFileInput.value) {
                fontFileInput.value.value = '';
            }
        }).catch((error) => {
            console.error('字体加载失败:', error);
            alert(`字体加载失败: ${error.message}`);
        });
    };

    reader.readAsDataURL(file);
};

const removeCustomFont = (fontName: string) => {
    if (confirm(`确定要删除自定义字体 "${fontName}" 吗？`)) {
        store.removeCustomFont(fontName);
    }
};
</script>