<template>  
  <div class="sheet-page">  
    <AppHeader />  
      
    <div class="sheet-content">  
      <!-- 字帖预览区域 -->  
      <div class="sheet-preview">  
        <div class="paper" ref="paperRef">  
          <template v-if="processedCharacters.length > 0">  
            <div class="character-grid" :style="gridContainerStyle">  
              <div   
                v-for="(item, index) in processedCharacters"   
                :key="`char-${index}`"  
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
import { ref, computed, watch, onMounted } from 'vue'  
import { NButton, NInput, NSelect, NSlider, NSwitch } from 'naive-ui'  
import AppHeader from '@/components/AppHeader.vue'  
import { useSheetStore } from '@/stores/sheet'  
import { PinyinService } from '@/services/pinyinService'
import { getGridTypeOptions, GridType } from '@/utils/grid'
import { printContent, exportAsPDF } from '@/utils/printer'  

// === 常量定义 ===
// 下拉选项常量
const GRID_OPTIONS = getGridTypeOptions() // 从grid.ts工具获取
const LAYOUT_OPTIONS = [  
  { label: '网格布局', value: 'grid' },  
  { label: '竖排布局', value: 'vertical' }  
]  
const COLOR_OPTIONS = [  
  { label: '淡灰', value: 'lightgray' },  
  { label: '中灰', value: 'gray' },  
  { label: '黑色', value: 'black' },  
  { label: '红色', value: 'red' },  
  { label: '蓝色', value: 'blue' }  
]

// 默认网格数量（空白时）  
const defaultGridCount = 5 * 10 // 5列10行默认网格  
  
// === 状态管理 ===
// 存储引用  
const sheetStore = useSheetStore()  
const paperRef = ref(null)  
  
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
// 处理后的字符（根据模式处理）  
const processedCharacters = computed(() => {  
  if (characters.value.length === 0) return []  
  
  const result: Array<{  
    char: string,       // 字符  
    charGroup: number,  // 字符组索引
    isRowFirst: boolean // 是否是行首字
  }> = [];  
  
  // 根据排版方式处理
  if (layoutType.value === 'vertical') {
    // 竖排模式 - 首行全是行首字，从左到右
    // 先添加所有的行首字（第一行）
    for (let charIndex = 0; charIndex < characters.value.length; charIndex++) {
      result.push({
        char: characters.value[charIndex],
        charGroup: charIndex,
        isRowFirst: true
      });
    }
    
    // 然后按列添加剩余的练习格子
    for (let rowIndex = 1; rowIndex < charsPerRow.value; rowIndex++) {
      for (let charIndex = 0; charIndex < characters.value.length; charIndex++) {
        result.push({
          char: characters.value[charIndex],
          charGroup: charIndex,
          isRowFirst: false
        });
      }
    }
  } else {
    // 网格模式 - 默认行优先排序
    for (let i = 0; i < characters.value.length; i++) {
      const char = characters.value[i];
        
      // 为每个字符创建练习格（第一个是首字，其余是描红）
      for (let j = 0; j < charsPerRow.value; j++) {
        result.push({
          char,
          charGroup: i,
          isRowFirst: j === 0 // 每个字的第一个位置是行首
        });
      }
    }
  }
  
  return result;  
})  
  
// 计算样式  
const gridContainerStyle = computed(() => {
  // 基本设置 - 适用于所有布局
  const baseStyle = {
    paddingTop: '35px', // 增加顶部空间，确保拼音显示
    rowGap: '40px',     // 增加行间距，确保拼音有足够空间
    columnGap: '16px',  // 增加列间距，提高可读性
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
  
const cellStyle = computed(() => {  
  return {  
    width: `${gridSize.value}px`,  
    height: `${gridSize.value}px`,
    position: 'relative'
  }  
})  
  
const characterStyle = computed(() => {  
  return {  
    fontFamily: fontFamily.value,  
    fontSize: `${fontSize.value * gridSize.value / 100}px`,  
    color: 'black', // 将颜色固定为黑色
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }  
})  
  
// === 方法 ===
// 获取字符样式
function getCharacterStyle(item: {char: string, isRowFirst: boolean}) {  
  const style = { ...characterStyle.value }  
    
  // 非行首字使用描红样式
  if (!item.isRowFirst) {  
    style.opacity = (strokeOpacity.value / 100).toString()
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
  if (!paperRef.value) return  
    
  printContent({  
    title: `汉字练习 - ${inputText.value || '空白字帖'}`,  
    content: paperRef.value,
    callback: () => {  
      console.log('打印完成')  
    }
  })  
}  
  
function handleExport() {  
  if (!paperRef.value) return  
    
  exportAsPDF(`汉字练习 - ${inputText.value || '空白字帖'}`, paperRef.value)  
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
  padding: 16px;  
  gap: 16px;  
  max-width: 1400px;  
  margin: 0 auto;  
  width: 100%;  
}  
  
/* 预览区域 */
.sheet-preview {  
  flex: 1;  
  background-color: #eef1f5;  
  border-radius: 8px;  
  display: flex;  
  justify-content: center;  
  align-items: flex-start;  
  overflow: auto;  
}  
  
.paper {  
  background-color: white;  
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);  
  padding: 20px;  
  width: 100%;  
  min-height: 800px;  
  display: flex;  
  justify-content: center;  
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
  
/* 网格背景样式 */
/* 田字格 */
.grid-background.tian {  
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23aaaaaa' stroke-width='1.5'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%23cccccc' stroke-width='1' /%3E%3C/svg%3E");  
  background-size: 100% 100%;  
}  
  
/* 米字格 */
.grid-background.mi {  
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23aaaaaa' stroke-width='1.5'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='0' x2='100' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='100' y1='0' x2='0' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3C/svg%3E");  
  background-size: 100% 100%;  
}  
  
/* 回宫格 */
.grid-background.hui {  
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23aaaaaa' stroke-width='1.5'/%3E%3Cline x1='33.3' y1='0' x2='33.3' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='66.6' y1='0' x2='66.6' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='33.3' x2='100' y2='33.3' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='66.6' x2='100' y2='66.6' stroke='%23cccccc' stroke-width='1' /%3E%3C/svg%3E");  
  background-size: 100% 100%;  
}

/* 九宫格 */
.grid-background.jiu {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23aaaaaa' stroke-width='1.5'/%3E%3Cline x1='33.3' y1='0' x2='33.3' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='66.6' y1='0' x2='66.6' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='33.3' x2='100' y2='33.3' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='66.6' x2='100' y2='66.6' stroke='%23cccccc' stroke-width='1' /%3E%3C/svg%3E");
  background-size: 100% 100%;
}

/* 方格 */
.grid-background.fang {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23aaaaaa' stroke-width='1.5'/%3E%3C/svg%3E");
  background-size: 100% 100%;
}

/* 米田格 */
.grid-background.mitian {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23aaaaaa' stroke-width='1.5'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='0' x2='100' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='100' y1='0' x2='0' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23cccccc' stroke-width='1' /%3E%3C/svg%3E");
  background-size: 100% 100%;
}

/* 四线格 */
.grid-background.si {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='white' stroke-width='0'/%3E%3Cline x1='0' y1='25' x2='100' y2='25' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%23aaaaaa' stroke-width='1.5' /%3E%3Cline x1='0' y1='75' x2='100' y2='75' stroke='%23cccccc' stroke-width='1' /%3E%3C/svg%3E");
  background-size: 100% 100%;
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
  margin-bottom: 16px;  
}  
  
.setting-label {  
  font-size: 14px;  
  color: #666;  
  margin-bottom: 8px;  
}  
  
.setting-value {  
  text-align: right;  
  font-size: 12px;  
  color: #999;  
  margin-top: 4px;  
}  
  
/* 打印样式 */
@media print {  
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
  }  
    
  .paper {  
    box-shadow: none;  
    min-height: auto;  
  }  
}  
</style>