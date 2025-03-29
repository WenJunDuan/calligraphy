<template>
  <div class="sheet-page">
    <AppHeader />
    
    <div class="sheet-content">
      <!-- 字帖预览区域 -->
      <div class="sheet-preview">
        <div class="paper" ref="paperRef">
          <template v-if="characters.length > 0">
            <div class="character-grid" :style="gridContainerStyle">
              <div 
                v-for="(char, index) in characters" 
                :key="`char-${index}`"
                class="character-cell"
                :style="cellStyle"
              >
                <!-- 顶部拼音 -->
                <div v-if="showPinyin" class="pinyin-area">
                  <small>{{ getPinyin(char) }}</small>
                </div>
                
                <!-- 中间汉字 -->
                <div 
                  class="character"
                  :style="characterStyle"
                >
                  {{ char }}
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
          <n-button class="export-btn">导出</n-button>
          <n-button type="primary" class="print-btn">打印</n-button>
        </div>
        
        <div class="panel-section">
          <n-input
            v-model:value="inputText"
            type="textarea"
            placeholder="输入要练习的文字"
            :rows="4"
            class="text-input"
          />
        </div>
        
        <div class="panel-section">
          <div class="toggle-group">
            <div class="toggle-item">
              <span class="toggle-label">显示拼音</span>
              <n-switch v-model:value="showPinyin" />
            </div>
            
            <div class="toggle-item">
              <span class="toggle-label">显示笔画</span>
              <n-switch v-model:value="showStrokes" />
            </div>
            
            <div class="toggle-item">
              <span class="toggle-label">嵌入文字</span>
              <n-switch v-model:value="embedText" />
            </div>
          </div>
        </div>
        
        <div class="panel-section">
          <div class="setting-item">
            <div class="setting-label">中文字体</div>
            <n-select v-model:value="fontFamily" :options="fontOptions" />
          </div>
          
          <div class="setting-item">
            <div class="setting-label">方格类型</div>
            <n-select v-model:value="gridType" :options="gridOptions" />
          </div>
          
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
            <div class="setting-label">上下位置</div>
            <n-slider v-model:value="verticalOffset" :min="-10" :max="10" />
            <div class="setting-value">{{ verticalOffset }}px</div>
          </div>
          
          <div class="setting-item">
            <div class="setting-label">字体颜色</div>
            <n-select v-model:value="fontColor" :options="colorOptions" />
          </div>
          
          <div class="setting-item">
            <div class="setting-label">描红颜色</div>
            <n-select v-model:value="strokeColor" :options="colorOptions" />
          </div>
          
          <div class="setting-item">
            <div class="setting-label">描红透明度</div>
            <n-slider v-model:value="strokeOpacity" :min="0" :max="100" />
            <div class="setting-value">{{ strokeOpacity }}</div>
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
import { useFontsStore } from '@/stores/fonts'
import { PinyinService } from '@/services/pinyinService'
import { CncharService } from '@/services/cncharService'

// 存储引用
const sheetStore = useSheetStore()
const fontsStore = useFontsStore()
const paperRef = ref(null)

// 默认网格数量（空白时）
const defaultGridCount = 100 // 10x10的网格

// 输入文本
const inputText = ref('')
const characters = computed(() => {
  if (!inputText.value) return []
  return Array.from(inputText.value.trim())
})

// 字帖设置 - 默认开启拼音和笔画
const showPinyin = ref(true)
const showStrokes = ref(true)
const embedText = ref(false)
const gridType = ref('tian') // tian, mi, hui
const gridSize = ref(64)
const fontSize = ref(80)
const verticalOffset = ref(0)
const fontFamily = ref('楷体')
const fontColor = ref('black')
const strokeColor = ref('lightgray')
const strokeOpacity = ref(10)

// 拼音缓存
const pinyinCache = ref<Record<string, string>>({})

// 选项
const gridOptions = [
  { label: '田字格', value: 'tian' },
  { label: '米字格', value: 'mi' },
  { label: '回宫格', value: 'hui' }
]

const fontOptions = computed(() => {
  return fontsStore.allFonts.map(font => ({
    label: font.name,
    value: font.family
  }))
})

const colorOptions = [
  { label: '淡灰', value: 'lightgray' },
  { label: '中灰', value: 'gray' },
  { label: '黑色', value: 'black' },
  { label: '红色', value: 'red' },
  { label: '蓝色', value: 'blue' }
]

// 计算样式
const gridContainerStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(auto-fill, minmax(${gridSize.value}px, 1fr))`,
    gap: '8px'
  }
})

const cellStyle = computed(() => {
  return {
    width: `${gridSize.value}px`,
    height: `${gridSize.value}px`
  }
})

const characterStyle = computed(() => {
  return {
    fontFamily: fontFamily.value,
    fontSize: `${fontSize.value * gridSize.value / 100}px`,
    color: fontColor.value,
    transform: `translateY(${verticalOffset.value}px)`
  }
})

// 获取拼音
function getPinyin(char: string): string {
  // 检查缓存
  if (pinyinCache.value[char]) {
    return pinyinCache.value[char]
  }
  
  try {
    // 使用拼音服务获取拼音
    const pinyinData = PinyinService.getPinyinData(char)
    const pinyin = pinyinData?.pinyinWithTone || ''
    
    // 存入缓存
    pinyinCache.value[char] = pinyin
    
    return pinyin
  } catch (error) {
    console.error(`获取"${char}"的拼音失败:`, error)
    return ''
  }
}

// 加载状态从Store
function loadFromStore() {
  const settings = sheetStore.settings
  
  // 只有当store中有值时才加载
  if (settings) {
    gridType.value = settings.gridType || 'tian'
    fontFamily.value = settings.fontFamily || '楷体'
    gridSize.value = settings.gridSize || 64
    fontSize.value = settings.fontSize || 80
    fontColor.value = settings.fontColor || 'black'
    strokeColor.value = settings.guideColor || 'lightgray'
    strokeOpacity.value = settings.guideOpacity || 10
    verticalOffset.value = settings.verticalOffset || 0
    showPinyin.value = settings.showPinyin !== undefined ? settings.showPinyin : true
    showStrokes.value = settings.showGuides !== undefined ? settings.showGuides : true
    embedText.value = settings.enableInput !== undefined ? settings.enableInput : false
  }
  
  // 加载上次输入的文本
  if (sheetStore.inputText) {
    inputText.value = sheetStore.inputText
  }
}

// 保存状态到Store
watch([gridType, fontFamily, gridSize, fontSize, fontColor, strokeColor, strokeOpacity, verticalOffset, showPinyin, showStrokes, embedText], () => {
  sheetStore.updateSettings({
    gridType: gridType.value,
    fontFamily: fontFamily.value,
    gridSize: gridSize.value,
    fontSize: fontSize.value,
    fontColor: fontColor.value,
    guideColor: strokeColor.value,
    guideOpacity: strokeOpacity.value,
    verticalOffset: verticalOffset.value,
    showReference: showPinyin.value,
    showGuides: showStrokes.value,
    enableInput: embedText.value,
    showPinyin: showPinyin.value,
    withTone: true,
    pinyinFontSize: 40,
    pinyinColor: '#666666'
  })
})

// 保存输入文本
watch(inputText, (newText) => {
  if (newText) {
    sheetStore.setInputText(newText)
  }
})

// 预加载笔画数据
function preloadStrokeData() {
  const commonChars = '的一是在了不和有大这中人上为个';
  commonChars.split('').forEach(char => {
    CncharService.getStrokeData(char);
  });
}

// 初始化
onMounted(() => {
  loadFromStore();
  preloadStrokeData();
})
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
  padding: 16px;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.sheet-preview {
  flex: 1;
  background-color: #eef1f5;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: auto;
}

.paper {
  background-color: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  width: 100%;
  min-height: 800px;
}

.character-grid {
  display: grid;
  width: 100%;
}

.character-cell {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pinyin-area {
  position: absolute;
  top: -20px; /* 移动到方格上方 */
  left: 0;
  width: 100%;
  text-align: center;
  color: #666;
  font-size: 12px;
  z-index: 2;
}

.character {
  position: relative;
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

.grid-background.tian {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23aaaaaa' stroke-width='1.5'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%23cccccc' stroke-width='1' /%3E%3C/svg%3E");
  background-size: 100% 100%;
}

.grid-background.mi {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23aaaaaa' stroke-width='1.5'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='0' x2='100' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='100' y1='0' x2='0' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3C/svg%3E");
  background-size: 100% 100%;
}

.grid-background.hui {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23aaaaaa' stroke-width='1.5'/%3E%3Cline x1='33.3' y1='0' x2='33.3' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='66.6' y1='0' x2='66.6' y2='100' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='33.3' x2='100' y2='33.3' stroke='%23cccccc' stroke-width='1' /%3E%3Cline x1='0' y1='66.6' x2='100' y2='66.6' stroke='%23cccccc' stroke-width='1' /%3E%3C/svg%3E");
  background-size: 100% 100%;
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

.export-btn, .print-btn {
  flex: 1;
}

.panel-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.text-input {
  width: 100%;
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