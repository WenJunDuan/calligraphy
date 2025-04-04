<template>
  <div class="sheet-page" :style="printMarginStyles">
    <AppHeader />

    <div class="sheet-content">
      <!-- 字帖预览区域 -->
      <div class="sheet-preview" ref="previewContainerRef">
        <div class="page" v-for="(pageCells, pageIndex) in paginatedCells" :key="`page-${pageIndex}`">
          <div class="paper" :style="paperStyle">
            <template v-if="pageCells.length > 0">
              <div class="character-grid" :style="gridContainerStyle">
                <div v-for="(item, index) in pageCells" :key="`char-${pageIndex}-${index}`" class="character-cell"
                  :class="{ 'row-first': item.isRowFirst }" :style="cellStyle">
                  <template v-if="showPinyin && item.char !== ' ' && item.isRowFirst">
                    <div class="pinyin-area">
                      <small>{{ getPinyin(item.char) }}</small>
                    </div>
                  </template>

                  <div class="character" :style="getCharacterStyle(item)">
                    {{ item.char }}
                  </div>

                  <div class="grid-background" :class="gridType"></div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="character-grid" :style="gridContainerStyle">
                <div v-for="index in defaultGridCount" :key="`empty-${index}`" class="character-cell"
                  :style="cellStyle">
                  <div class="grid-background" :class="gridType"></div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="panel-actions">
          <n-button class="export-btn" @click="handleExport">导出</n-button>
          <n-button type="primary" class="print-btn" @click="handlePrint">打印</n-button>
        </div>

        <div class="panel-content">
          <n-input v-model:value="inputText" type="textarea" placeholder="输入要练习的文字" :rows="4" class="text-input" />

          <div class="setting-item">
            <div class="setting-label">方格大小</div>
            <n-slider v-model:value="gridSize" :min="32" :max="80" :step="4" />
            <div class="setting-value">{{ gridSize }}px</div>
          </div>

          <div class="setting-item">
            <div class="setting-label">字体大小</div>
            <n-slider v-model:value="fontSize" :min="40" :max="100" :step="5" />
            <div class="setting-value">{{ fontSize }}%</div>
          </div>

          <div class="setting-item">
            <div class="setting-label">练习字数</div>
            <n-slider v-model:value="charsPerRow" :min="2" :max="30"/>
            <div class="setting-value">{{ charsPerRow }}个</div>
          </div>

          <div class="setting-item">
            <div class="setting-label">字体类型</div>
            <n-select v-model:value="fontFamily" :options="fontsStore.fontOptions" />
          </div>

          <div class="setting-item">
            <div class="setting-label">方格类型</div>
            <n-select v-model:value="gridType" :options="GRID_OPTIONS" />
          </div>

          <div class="setting-item">
            <div class="setting-label">排版方式</div>
            <n-select v-model:value="layoutType" :options="LAYOUT_OPTIONS" />
          </div>

          <div class="setting-item">
            <div class="setting-label">描红颜色</div>
            <n-select v-model:value="strokeColor" :options="COLOR_OPTIONS" />
          </div>

          <div class="setting-item">
            <div class="setting-label">描红透明度</div>
            <n-slider v-model:value="strokeOpacity" :min="0" :max="100" />
            <div class="setting-value">{{ strokeOpacity }}%</div>
          </div>

          <div class="toggle-group">
            <div class="toggle-item">
              <span class="toggle-label">显示拼音</span>
              <n-switch v-model:value="showPinyin" />
            </div>

            <div class="toggle-item">
              <span class="toggle-label">显示笔画</span>
              <n-switch v-model:value="showStrokes" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, CSSProperties } from 'vue'
import { NButton, NInput, NSelect, NSlider, NSwitch } from 'naive-ui'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useSheetStore, useSettingsStore, useFontsStore } from '@/stores'
import { PinyinService } from '@/services/pinyinService'
import { GridType, LayoutType, CellData } from '@/types'
import {
  GRID_OPTIONS,
  LAYOUT_OPTIONS,
  COLOR_OPTIONS,
  COMMON_CHARACTERS,
  A4_DIMENSIONS,
  DEFAULT_SHEET_SETTINGS
} from '@/constants'
import { printContent, exportAsPDF } from '@/utils/printer'
import {
  calculateCharacterStyle,
  calculateGridContainerStyle,
  calculateCellStyle,
  calculateStrokeStyle,
  paginateCharacters,
  getPinyin
} from '@/utils/sheetUtils'

const defaultGridCount = 50 // 默认网格数量（空白时）  

// 状态管理
const sheetStore = useSheetStore()
const settingsStore = useSettingsStore()
const fontsStore = useFontsStore()
const previewContainerRef = ref<HTMLElement | null>(null)

// 输入文本  
const inputText = ref('')
const characters = computed(() => inputText.value ? Array.from(inputText.value.trim()) : [])

// 字帖设置
const showPinyin = ref(true)
const showStrokes = ref(true)
const gridType = ref<GridType>('tian')
const gridSize = ref(64)
const fontSize = ref(80)
const fontFamily = ref('楷体, KaiTi, STKaiti, serif')
const strokeColor = ref('lightgray')
const strokeOpacity = ref(10)
const layoutType = ref<LayoutType>('grid')
const charsPerRow = ref(12) // 每列字符数

// 监听布局类型变化，设置默认描红字数
watch(layoutType, (newValue) => {
  charsPerRow.value = newValue === 'vertical' ? 16 : 12;
}, { immediate: true });

// A4尺寸常量
const A4_WIDTH_PX = A4_DIMENSIONS.WIDTH_PX;
const A4_HEIGHT_PX = A4_DIMENSIONS.HEIGHT_PX;

// 纸张样式
const paperStyle = computed((): CSSProperties => ({
  width: `${A4_WIDTH_PX}px`,
  minHeight: `${A4_HEIGHT_PX}px`,
  padding: '30px',
  boxSizing: 'border-box',
  backgroundColor: 'white',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
}));

// 打印边距样式
const printMarginStyles = computed(() => {
  const margins = settingsStore.printSettings.margins;
  return {
    '--print-margin-top': `${margins.top}mm`,
    '--print-margin-right': `${margins.right}mm`,
    '--print-margin-bottom': `${margins.bottom}mm`,
    '--print-margin-left': `${margins.left}mm`,
  };
});

// 计算分页单元格数据
const paginatedCells = computed((): CellData[][] => {
  return paginateCharacters({
    characters: characters.value,
    layoutType: layoutType.value,
    charsPerRow: charsPerRow.value,
    gridSize: gridSize.value,
    printSettings: settingsStore.printSettings
  });
});

// 计算网格容器样式
const gridContainerStyle = computed(() => 
  calculateGridContainerStyle({
    layoutType: layoutType.value,
    gridSize: gridSize.value,
    charsPerRow: charsPerRow.value
  })
);

// 计算单元格样式
const cellStyle = computed(() => calculateCellStyle(gridSize.value));

// 基础字符样式
const characterStyle = computed(() => 
  calculateCharacterStyle({
    gridSize: gridSize.value,
    fontSize: fontSize.value,
    fontFamily: fontFamily.value,
    fontColor: 'black',
    layoutType: layoutType.value
  })
);

// 获取字符样式
function getCharacterStyle(item: CellData) {
  if (!item.isRowFirst) {
    return calculateStrokeStyle(
      characterStyle.value,
      strokeColor.value,
      strokeOpacity.value
    );
  }
  return characterStyle.value;
}

// 打印功能  
function handlePrint() {
  if (!previewContainerRef.value) return;

  printContent({
    title: `汉字练习 - ${inputText.value || '空白字帖'}`,
    content: previewContainerRef.value,
    callback: () => console.log('打印完成')
  });
}

// 导出功能
function handleExport() {
  if (!previewContainerRef.value) return;
  exportAsPDF(`汉字练习 - ${inputText.value || '空白字帖'}`, previewContainerRef.value);
}

// 从Store加载设置  
function loadFromStore() {
  const settings = sheetStore.settings;
  if (!settings) return;
  
  gridType.value = settings.gridType || 'tian';
  gridSize.value = settings.gridSize || DEFAULT_SHEET_SETTINGS.gridSize;
  fontSize.value = settings.fontSize || DEFAULT_SHEET_SETTINGS.fontSize;
  strokeColor.value = settings.guideColor || DEFAULT_SHEET_SETTINGS.guideColor;
  strokeOpacity.value = settings.guideOpacity || DEFAULT_SHEET_SETTINGS.guideOpacity;
  showPinyin.value = settings.showPinyin !== undefined ? settings.showPinyin : true;
  showStrokes.value = settings.showGuides !== undefined ? settings.showGuides : true;
  layoutType.value = settings.layoutType as LayoutType || 'grid';
  charsPerRow.value = settings.charsPerRow || DEFAULT_SHEET_SETTINGS.charsPerRow;
  fontFamily.value = settings.fontFamily || DEFAULT_SHEET_SETTINGS.fontFamily;

  if (sheetStore.inputText) {
    inputText.value = sheetStore.inputText;
  }
}

// 保存设置到Store (使用防抖优化)
let saveSettingsTimeout: number | null = null;
function saveSettingsToStore() {
  if (saveSettingsTimeout) clearTimeout(saveSettingsTimeout);
  
  saveSettingsTimeout = window.setTimeout(() => {
    sheetStore.updateSettings({
      gridType: gridType.value,
      fontFamily: fontFamily.value,
      gridSize: gridSize.value,
      fontSize: fontSize.value,
      fontColor: 'black',
      guideColor: strokeColor.value,
      guideOpacity: strokeOpacity.value,
      verticalOffset: 0,
      showPinyin: showPinyin.value,
      showGuides: showStrokes.value,
      withTone: true,
      pinyinFontSize: 40,
      pinyinColor: '#666666',
      layoutType: layoutType.value,
      charsPerRow: charsPerRow.value,
      isSingleCharMode: true
    });
  }, 300);
}

// 监听设置变更
watch([
  gridType, gridSize, fontSize, strokeColor,
  strokeOpacity, showPinyin, showStrokes,
  layoutType, charsPerRow, fontFamily
], saveSettingsToStore);

// 保存输入文本 (使用防抖优化)
let saveTextTimeout: number | null = null;
watch(inputText, (newText) => {
  if (!newText) return;
  
  if (saveTextTimeout) clearTimeout(saveTextTimeout);
  
  saveTextTimeout = window.setTimeout(() => {
    sheetStore.setInputText(newText);
  }, 500);
});

// 初始化  
onMounted(() => {
  loadFromStore();
  PinyinService.preloadCommonCharacters(COMMON_CHARACTERS);
});
</script>

<style scoped>
.sheet-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.sheet-content {
  display: flex;
  flex: 1;
  padding: 12px;
  gap: 16px;
  max-width: 1144px;
  margin: 0 auto;
  width: 100%;
}

.sheet-preview {
  flex: 1;
  background-color: #eef1f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  gap: 20px;
  will-change: transform;
}

.page {
  display: flex;
  justify-content: center;
  width: 100%;
}

.paper {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

.character-grid {
  width: 100%;
  contain: layout;
}

.character-cell {
  position: relative;
  contain: content;
}

.row-first {
  font-weight: 500;
  color: #000;
}

.pinyin-area {
  position: absolute;
  top: -22px;
  left: 0;
  width: 100%;
  text-align: center;
  color: #666;
  font-size: 14px;
  z-index: 2;
}

.character {
  z-index: 1;
  user-select: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  will-change: transform;
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

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

.export-btn,
.print-btn {
  flex: 1;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  max-height: calc(100vh - 150px);
}

.text-input {
  width: 100%;
  margin-bottom: 16px;
}

.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toggle-label {
  font-size: 14px;
  color: #333;
}

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

.setting-item .n-slider {
  flex: 1 1 auto;
}

.setting-value {
  flex: 0 0 50px;
  text-align: right;
  margin-top: 0;
  font-size: 12px;
  color: #999;
}

@media print {
  @page {
    margin: 0;
    size: A4;
  }

  body {
    margin: 0;
    background-color: white !important;
  }

  .sheet-page {
    min-height: unset;
  }

  .app-header,
  .control-panel,
  .app-footer {
    display: none;
  }

  .sheet-content {
    padding: 0;
    display: block;
    max-width: none;
    margin: 0;
  }

  .sheet-preview {
    overflow: visible;
    background-color: transparent;
    padding: 0;
    display: block;
    gap: 0;
    border-radius: 0;
    height: 100vh;
  }

  .page {
    page-break-after: always;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow: hidden;
    background-color: transparent;
    margin-bottom: 0;
  }

  .paper {
    box-shadow: none;
    margin: 0;
    width: 210mm;
    height: 297mm;
    background-color: white;
    padding-top: var(--print-margin-top);
    padding-right: var(--print-margin-right);
    padding-bottom: var(--print-margin-bottom);
    padding-left: var(--print-margin-left);
    box-sizing: border-box;
  }

  .character-grid {
    width: 100%;
    box-sizing: border-box;
  }

  .character-cell,
  .grid-background {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>