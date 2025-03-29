<template>  
  <div class="sheet-page">  
    <AppHeader />  
      
    <div class="sheet-content">  
      <!-- 字帖预览区域 -->  
      <div class="sheet-preview" ref="previewContainerRef">  
        <!-- Loop through pages -->
        <div class="page" v-for="(pageCells, pageIndex) in paginatedCells" :key="`page-${pageIndex}`">
          <div class="paper" :style="paperStyle">  
            <template v-if="pageCells.length > 0">  
              <div class="character-grid" :style="gridContainerStyle">  
                <div   
                  v-for="(item, index) in pageCells"  
                  :key="`char-${pageIndex}-${index}`"  
                  class="character-cell"  
                  :class="{ 'row-first': item.isRowFirst }"  
                  :style="cellStyle"  
                >  
                  <!-- 顶部拼音，在行首字上显示 -->  
                  <template v-if="showPinyin && item.char !== ' ' && item.isRowFirst">
                    <div class="pinyin-area">  
                      <small>{{ getPinyin(item.char) }}</small>  
                    </div>
                  </template>  
                    
                  <!-- 中间汉字 -->  
                  <div   
                    class="character"  
                    :style="getCharacterStyle(item)"  
                  >  
                    {{ item.char }}  
                  </div>  
                    
                  <!-- 背景网格 -->  
                  <div   
                    class="grid-background"  
                    :class="gridType"  
                  ></div>  
                </div>  
              </div>  
            </template>  
            <template v-else>  
              <!-- 默认显示空白字帖 -->  
              <div class="character-grid" :style="gridContainerStyle">  
                <div   
                  v-for="index in defaultGridCount"   
                  :key="`empty-${index}`"  
                  class="character-cell"  
                  :style="cellStyle"  
                >  
                  <!-- 背景网格 -->  
                  <div   
                    class="grid-background"  
                    :class="gridType"  
                  ></div>  
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
          <n-input  
            v-model:value="inputText"  
            type="textarea"  
            placeholder="输入要练习的文字"  
            :rows="4"  
            class="text-input"  
          />  

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
            <n-slider v-model:value="charsPerRow" :min="5" :max="20" />  
            <div class="setting-value">{{ charsPerRow }}个</div>  
          </div>  

          <div class="setting-item">  
            <div class="setting-label">字体类型</div>  
            <n-select v-model:value="fontFamily" :options="FONT_OPTIONS" />  
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
            <div class="setting-value">{{ strokeOpacity }}</div>  
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
  </div>  
</template>  
  
<script setup lang="ts">  
import { ref, computed, watch, onMounted, CSSProperties } from 'vue'  
import { NButton, NInput, NSelect, NSlider, NSwitch } from 'naive-ui'  
import AppHeader from '@/components/AppHeader.vue'  
import { useSheetStore } from '@/stores/sheet'  
import { useSettingsStore } from '@/stores/settings'
import { PinyinService } from '@/services/pinyinService'
import { getGridTypeOptions, GridType } from '@/utils/grid'
import { printContent, exportAsPDF } from '@/utils/printer'  

// === 常量定义 ===
// 下拉选项常量
const GRID_OPTIONS = getGridTypeOptions() // 从grid.ts工具获取

const FONT_OPTIONS = [
  { label: '楷体', value: '楷体, KaiTi, STKaiti, serif' },
  { label: '行书', value: '行书, Xingkai SC, serif' },
  { label: '隶书', value: '隶书, LiSu, STLiti, serif' },
  { label: '瘦金体', value: '瘦金体, Shoujin Ti, serif' },
  { label: '田英章楷书', value: '田英章楷书, Tian Yingzhang KaiShu, serif' },
  { label: '吴玉生行书', value: '吴玉生行书, Wu Yushuang Xingshu, serif' }
]

const LAYOUT_OPTIONS = [  
  { label: '网格布局', value: 'grid' },  
  { label: '竖排布局', value: 'vertical' }  
]  
const COLOR_OPTIONS = [  
  { label: '中灰', value: 'gray' },  
  { label: '红色', value: 'red' },  
  { label: '蓝色', value: 'blue' }  
]

// 默认网格数量（空白时）  
const defaultGridCount = 5 * 10 // 5列10行默认网格  
  
// === 状态管理 ===
// 存储引用  
const sheetStore = useSheetStore()  
const settingsStore = useSettingsStore()
const previewContainerRef = ref<HTMLElement | null>(null);
  
// 输入文本  
const inputText = ref('')  
const characters = computed(() => {  
  if (!inputText.value) return []  
  return Array.from(inputText.value.trim())  
})  

// 字帖设置
const showPinyin = ref(true)  
const showStrokes = ref(true)  
const gridType = ref<GridType>('tian')
const gridSize = ref(64)  
const fontSize = ref(80)  
const fontFamily = ref('楷体, KaiTi, STKaiti, serif') // 固定使用楷体
const strokeColor = ref('lightgray')  
const strokeOpacity = ref(10)  
const layoutType = ref('grid') // grid, vertical  
const charsPerRow = ref(10) // 每列字符数(每个字重复多少行)  
  
// === 计算属性 ===
// A4 dimensions at 96 DPI (approx)
const A4_WIDTH_PX = 795;
const A4_HEIGHT_PX = 1123;

// Computed style for the paper element to mimic A4 with print margins
const paperStyle = computed((): CSSProperties => {
  const margins = settingsStore.printSettings.margins;
  const dpi = 96;
  const mmToPx = (mm: number) => (mm / 25.4) * dpi;

  return {
    width: `${A4_WIDTH_PX}px`,
    height: `${A4_HEIGHT_PX}px`,
    paddingTop: `${mmToPx(margins.top)}px`,
    paddingRight: `${mmToPx(margins.right)}px`,
    paddingBottom: `${mmToPx(margins.bottom)}px`,
    paddingLeft: `${mmToPx(margins.left)}px`,
    boxSizing: 'border-box',
    backgroundColor: 'white',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)'
  };
});

// Cell data structure
interface CellData {
  char: string;
  charGroup: number;
  isRowFirst: boolean;
}

// Calculate paginated cells based on 12-row limit
const paginatedCells = computed((): CellData[][] => {
  if (characters.value.length === 0) return [[]]; // Return one empty page if no input

  const allCells: CellData[] = [];
  const inputChars = characters.value;

  // 1. Generate all cells first (similar to previous processedCharacters logic)
  if (layoutType.value === 'vertical') {
    // Vertical layout processing
    for (let charIndex = 0; charIndex < inputChars.length; charIndex++) {
      for (let rowIndex = 0; rowIndex < charsPerRow.value; rowIndex++) {
        allCells.push({ char: inputChars[charIndex], charGroup: charIndex, isRowFirst: rowIndex === 0 });
      }
    }
  } else {
    // Grid layout processing
    for (let i = 0; i < inputChars.length; i++) {
      const char = inputChars[i];
      for (let j = 0; j < charsPerRow.value; j++) {
        allCells.push({ char, charGroup: i, isRowFirst: j === 0 });
      }
    }
  }

  // 2. Calculate cells per page based on 12-row limit
  const dpi = 96;
  const mmToPx = (mm: number) => (mm / 25.4) * dpi;
  const margins = settingsStore.printSettings.margins;
  const availableWidth = A4_WIDTH_PX - mmToPx(margins.left) - mmToPx(margins.right);
  
  let cellsPerPage: number;
  const maxRowsPerPage = 12;

  if (layoutType.value === 'vertical') {
    const maxCharsPerPageVertical = 12; // Treat 12 rows limit as 12 characters vertically
    cellsPerPage = maxCharsPerPageVertical * charsPerRow.value;
  } else {
    const columnGapValue = 0; // Currently 0 in gridContainerStyle
    const effectiveCellWidth = gridSize.value + columnGapValue;
    const colsPerPage = Math.max(1, Math.floor((availableWidth + columnGapValue) / effectiveCellWidth));
    cellsPerPage = maxRowsPerPage * colsPerPage * charsPerRow.value; // Total cells for 12 rows
    cellsPerPage = maxRowsPerPage * colsPerPage;

  }

  // 3. Split allCells into pages
  const pages: CellData[][] = [];
  for (let i = 0; i < allCells.length; i += cellsPerPage) {
    pages.push(allCells.slice(i, i + cellsPerPage));
  }

  // Handle case where no cells are generated (e.g., initial state)
  if (pages.length === 0 && characters.value.length === 0) {
      return [[]]; // Return a single empty page structure
  }
    
  // If pages is empty but there should be content, add at least one page structure
  if (pages.length === 0 && allCells.length > 0) {
      pages.push(allCells); // Put all cells on the first page if calculation failed somehow
  } else if (pages.length === 0 && characters.value.length > 0 && allCells.length === 0) {
       // Case where input exists but cell generation logic failed? Return empty page.
       return [[]];
  }

  return pages;
});

// 计算样式  
const gridContainerStyle = computed(() => {
  // 基本设置 - 适用于所有布局
  const baseStyle = {
    paddingTop: '20px', // 增加顶部空间，确保拼音显示
    rowGap: '30px',     // 增加行间距，确保拼音有足够空间
    columnGap: '0px',  // 增加列间距，提高可读性
  };
  
  if (layoutType.value === 'vertical') {  
    // 竖排布局，按列排列，首行是所有行首字
    const charCount = characters.value.length || 1;
    return {  
      ...baseStyle,
      display: 'grid',
      gridTemplateColumns: `repeat(${charCount}, ${gridSize.value}px)`,
      gridTemplateRows: `repeat(${charsPerRow.value}, ${gridSize.value}px)`,
      justifyContent: 'center'
    }  
  } else { // grid (默认)
    // 网格布局
    return {  
      ...baseStyle,
      display: 'grid',  
      gridTemplateColumns: `repeat(auto-fill, ${gridSize.value}px)`,  
      gridAutoRows: `${gridSize.value}px`, // 固定高度
      justifyContent: 'center'
    }  
  }  
})  
  
const cellStyle = computed((): CSSProperties => {  
  return {  
    width: `${gridSize.value}px`,  
    height: `${gridSize.value}px`,
    position: 'relative'
  }  
})  
  
const characterStyle = computed((): CSSProperties => {  
  return {  
    fontFamily: fontFamily.value,  
    fontSize: `${fontSize.value * gridSize.value / 100}px`,  
    color: 'black', // 将颜色固定为黑色
    opacity: 1, // Add default opacity
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }  
})  
  
// === 方法 ===
// 获取字符样式
function getCharacterStyle(item: {char: string, isRowFirst: boolean}) {  
  const style: CSSProperties = { ...characterStyle.value }  
    
  // 非行首字使用描红样式
  if (!item.isRowFirst) {  
    style.opacity = strokeOpacity.value / 100 // Assign number, not string
    style.color = strokeColor.value  
  }  
    
  return style  
}  
  
// 获取拼音 - 使用服务类
function getPinyin(char: string): string {  
  const data = PinyinService.getPinyinData(char);
  return data ? data.pinyinWithTone : '';
}  
  
// 导出与打印功能  
function handlePrint() {  
  if (!previewContainerRef.value) return  
    
  printContent({  
    title: `汉字练习 - ${inputText.value || '空白字帖'}`,  
    content: previewContainerRef.value,
    callback: () => {  
      console.log('打印完成')  
    }
  })  
}  
  
function handleExport() {  
  if (!previewContainerRef.value) return  
    
  exportAsPDF(`汉字练习 - ${inputText.value || '空白字帖'}`, previewContainerRef.value)  
}  
  
// 加载状态从Store  
function loadFromStore() {  
  const settings = sheetStore.settings  
    
  // 只有当store中有值时才加载  
  if (settings) {  
    gridType.value = settings.gridType as GridType || 'tian'  
    gridSize.value = settings.gridSize || 64  
    fontSize.value = settings.fontSize || 80  
    strokeColor.value = settings.guideColor || 'lightgray'  
    strokeOpacity.value = settings.guideOpacity || 10  
    showPinyin.value = settings.showPinyin !== undefined ? settings.showPinyin : true  
    showStrokes.value = settings.showGuides !== undefined ? settings.showGuides : true  
    layoutType.value = settings.layoutType === 'horizontal' ? 'grid' : settings.layoutType || 'grid'
    charsPerRow.value = settings.charsPerRow || 10  
  }  
    
  // 加载上次输入的文本  
  if (sheetStore.inputText) {  
    inputText.value = sheetStore.inputText  
  }  
}  
  
// 保存状态到Store  
watch([  
  gridType, gridSize, fontSize, strokeColor,   
  strokeOpacity, showPinyin, showStrokes,  
  layoutType, charsPerRow  
], () => {  
  sheetStore.updateSettings({  
    gridType: gridType.value,  
    fontFamily: fontFamily.value,  
    gridSize: gridSize.value,  
    fontSize: fontSize.value,  
    fontColor: 'black', // 固定黑色
    guideColor: strokeColor.value,  
    guideOpacity: strokeOpacity.value,  
    verticalOffset: 0, // 固定为0
    showPinyin: showPinyin.value,  
    showGuides: showStrokes.value,  
    withTone: true,  
    pinyinFontSize: 40,  
    pinyinColor: '#666666',  
    layoutType: layoutType.value,  
    charsPerRow: charsPerRow.value,
    isSingleCharMode: true // 固定为单字练习模式
  })  
})  
  
// 保存输入文本  
watch(inputText, (newText) => {  
  if (newText) {  
    sheetStore.setInputText(newText)  
  }  
})  
  
// 初始化  
onMounted(() => {  
  loadFromStore();  
  // 预加载常用汉字拼音
  const commonChars = '的一是在了不和有大这中人上为个所我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部';
  PinyinService.preloadCommonCharacters(commonChars);
})  
</script>  
  
<style scoped>  
/* 页面整体布局 */
.sheet-page {  
  min-height: 100vh;  
  display: flex;  
  flex-direction: column;  
  background-color: #f5f7fa;  
}  
  
.sheet-content {  
  display: flex;  
  flex: 1;  
  padding: 12px; /* Reduce padding from 16px */
  gap: 16px;  
  max-width: 1144px;  
  margin: 0 auto;  
  width: 100%;  
}  
  
/* 预览区域 */
.sheet-preview {  
  flex: 1;  
  background-color: #eef1f5;  
  border-radius: 8px;  
  display: flex;  
  flex-direction: column; /* Stack pages vertically */
  align-items: center; /* Center pages horizontally */
  overflow: auto;  
  gap: 20px; /* Space between pages */
}  
  
.page { 
  /* Styles for the page container if needed, e.g., margin */
}
  
.paper {  
  display: flex;  
  justify-content: center;  
  margin: 0 auto; /* Center paper horizontally if preview area is wider */
}  
  
.character-grid {  
  width: 100%;
}
  
/* 字符单元格 */
.character-cell {  
  position: relative;
}  
  
/* 行首字样式 */
.row-first {
  font-weight: 500; /* 加粗 */
  color: #000; /* 强制黑色 */
}  
  
.pinyin-area {  
  position: absolute;  
  top: -22px; /* 拼音区域上移 */  
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
}  
  
.grid-background {  
  position: absolute;  
  top: 0;  
  left: 0;  
  width: 100%;  
  height: 100%;  
  z-index: 0;  
}  
  
/* 控制面板样式 */
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
  
.export-btn, .print-btn {  
  flex: 1;  
}  

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  
/* 打印样式 */
@media print {  
  /* Add @page rule to remove margins for native print */
  @page {
    margin: 0;
    size: auto; /* Let browser determine size based on content/settings */
  }

  .app-header, .control-panel {  
    display: none;  
  }  
    
  .sheet-content {  
    padding: 0;  
  }  
    
  .sheet-preview {  
    overflow: visible;  
    background-color: white;  
    padding: 0;  
    display: block; /* Reset flex layout for print */
    gap: 0;
  }  
    
  .paper {  
    box-shadow: none;  
    min-height: auto;  
    margin: 0; /* Reset margin for print */
  }
  
  .page {
    page-break-after: always; /* Ensure page breaks between .page elements */
  }

  /* Force printing background graphics for grid */
  .character-cell, .grid-background {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact; /* For older Safari/Chrome */
  }
}  
</style>