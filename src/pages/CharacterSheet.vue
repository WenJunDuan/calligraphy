<template>
  <SheetContainer>
    <template #preview>
      <SheetPreview :pages="paginatedCells" ref="previewRef">
        <template #content="{ pageCells }">
          <div v-if="pageCells.length > 0" class="character-grid" :style="gridContainerStyle">
            <div v-for="(item, index) in pageCells" 
                :key="`char-${index}`" 
                class="character-cell" 
                :class="{ 'row-first': item.isRowFirst }" 
                :style="cellStyle">
              
              <template v-if="item.isRowFirst && item.char !== ' ' && item.char !== '　'">
                <div class="info-area">
                  <span v-if="showPinyin" class="pinyin-text">{{ getPinyin(item.char) }}</span>
                  
                  <span v-if="showStrokes" class="stroke-text">
                    {{ getStrokeNamesString(item.char) }}
                  </span>
                </div>
              </template>
              
              <div class="character" :style="getCharacterStyle(item)">
                {{ item.char }}
              </div>
              
              <div class="grid-background" :class="gridType"></div>
            </div>
          </div>
          
          <div v-else class="character-grid" :style="gridContainerStyle">
            <div v-for="index in defaultGridCount" 
                 :key="`empty-${index}`" 
                 class="character-cell" 
                 :style="cellStyle">
              <div class="grid-background" :class="gridType"></div>
            </div>
          </div>
        </template>
      </SheetPreview>
    </template>

    <template #control-panel>
      <ControlPanel @print="handlePrint" @export="handleExport">
        <div class="panel-section">
          <n-input v-model:value="inputText" type="textarea" 
                  placeholder="输入要练习的文字" 
                  :autosize="{ minRows: 4, maxRows: 8 }" />
        </div>
        
        <div class="panel-section">
          <h3 class="section-title">基本设置</h3>
          
          <SettingItem label="格子大小">
            <n-slider v-model:value="gridSize" :min="32" :max="80" :step="4" />
            <template #value>{{ gridSize }}px</template>
          </SettingItem>

          <SettingItem label="字体大小">
            <n-slider v-model:value="fontSize" :min="40" :max="100" :step="5" />
            <template #value>{{ fontSize }}%</template>
          </SettingItem>

          <SettingItem label="练习数量">
            <n-slider v-model:value="charsPerRow" :min="2" :max="maxCharsPerRow" />
            <template #value>{{ charsPerRow }}个</template>
          </SettingItem>
        </div>
        
        <div class="panel-section">
          <h3 class="section-title">样式设置</h3>
          
          <SettingItem label="字体">
            <n-select v-model:value="fontFamily" :options="fontsStore.fontOptions" />
          </SettingItem>

          <SettingItem label="格子类型">
            <n-select v-model:value="gridType" :options="GRID_OPTIONS" />
          </SettingItem>

          <SettingItem label="排版方式">
            <n-select v-model:value="layoutType" :options="LAYOUT_OPTIONS" />
          </SettingItem>
        </div>
        
        <div class="panel-section">
          <h3 class="section-title">描红设置</h3>
          
          <SettingItem label="描红颜色">
            <n-select v-model:value="strokeColor" :options="COLOR_OPTIONS" />
          </SettingItem>

          <SettingItem label="描红透明度">
            <n-slider v-model:value="strokeOpacity" :min="10" :max="80" />
            <template #value>{{ strokeOpacity }}%</template>
          </SettingItem>
          
          <div class="toggle-item">
            <span class="toggle-label">显示拼音</span>
            <n-switch v-model:value="showPinyin" />
          </div>
          
          <div class="toggle-item">
            <span class="toggle-label">显示笔顺</span>
            <n-switch v-model:value="showStrokes" />
          </div>
        </div>
      </ControlPanel>
    </template>
  </SheetContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { NInput, NSelect, NSlider, NSwitch } from 'naive-ui'
import SheetContainer from '@/components/SheetContainer.vue'
import SheetPreview from '@/components/SheetPreview.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import SettingItem from '@/components/SettingItem.vue'
import { useSheetStore, useSettingsStore, useFontsStore } from '@/stores'
import { PinyinService } from '@/services/pinyinService'
import { CncharService } from '@/services/cncharService'
import { GridType, LayoutType, CellData } from '@/types'
import {
  GRID_OPTIONS,
  LAYOUT_OPTIONS,
  COLOR_OPTIONS,
  COMMON_CHARACTERS,
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

const defaultGridCount = 50
const sheetStore = useSheetStore()
const settingsStore = useSettingsStore()
const fontsStore = useFontsStore()
const previewRef = ref(null)

// 笔画缓存 - 临时使用，保证页面响应性
const strokeCache = ref(new Map<string, string>())

const inputText = ref('')
const characters = computed(() => inputText.value ? Array.from(inputText.value.trim()) : [])

const showPinyin = ref(true)
const showStrokes = ref(false)
const gridType = ref<GridType>('tian')
const gridSize = ref(64)
const fontSize = ref(80)
const fontFamily = ref('楷体, KaiTi, STKaiti, serif')
const strokeColor = ref('lightgray')
const strokeOpacity = ref(10)
const layoutType = ref<LayoutType>('grid')
const charsPerRow = ref(10)

const maxCharsPerRow = computed(() => layoutType.value === 'vertical' ? 20 : 30)

watch(layoutType, (newValue) => {
  if (newValue === 'vertical') {
    charsPerRow.value = Math.min(charsPerRow.value, 20)
  }
}, { immediate: true })

const paginatedCells = computed(() => {
  return paginateCharacters({
    characters: characters.value,
    layoutType: layoutType.value,
    charsPerRow: charsPerRow.value,
    gridSize: gridSize.value,
    printSettings: settingsStore.printSettings
  })
})

const gridContainerStyle = computed(() => {
  return calculateGridContainerStyle({
    layoutType: layoutType.value,
    gridSize: gridSize.value,
    charsPerRow: charsPerRow.value
  })
})

const cellStyle = computed(() => {
  const baseStyle = calculateCellStyle(gridSize.value)
  const rowGap = (showPinyin.value || showStrokes.value) ? '30px' : '0px'
  
  return {
    ...baseStyle,
    marginTop: rowGap
  }
})

const characterStyle = computed(() => {
  return calculateCharacterStyle({
    gridSize: gridSize.value,
    fontSize: fontSize.value,
    fontFamily: fontFamily.value,
    fontColor: 'black',
    layoutType: layoutType.value
  })
})

function getCharacterStyle(item: CellData) {
  if (!item.isRowFirst) {
    return calculateStrokeStyle(
      characterStyle.value,
      strokeColor.value,
      strokeOpacity.value
    )
  }
  return characterStyle.value
}

// 获取笔画名称字符串
function getStrokeNamesString(char: string): string {
  if (!char || char === ' ' || char === '　') {
    return ''
  }

  // 检查缓存
  if (strokeCache.value.has(char)) {
    return strokeCache.value.get(char) || ''
  }

  try {
    // 获取笔画数据
    const strokeData = CncharService.getStrokeData(char)
    
    if (strokeData && strokeData.strokeNames && strokeData.strokeNames.length > 0) {
      // 直接使用笔画符号，无需转换
      const result = getStrokeSymbols(strokeData.strokeNames).join('')
      strokeCache.value.set(char, result)
      return result
    }
  } catch (error) {
    console.error(`获取"${char}"的笔画失败:`, error)
  }
  
  return ''
}

// 将笔画名称转换为笔画符号
function getStrokeSymbols(strokeNames: string[]): string[] {
  return strokeNames.map(name => {
    if (name.includes('横')) return '一'
    if (name.includes('竖')) return '丨'
    if (name.includes('撇')) return '丿'
    if (name.includes('点')) return '丶'
    if (name.includes('捺')) return '㇏'
    if (name.includes('提')) return '㇀'
    if (name.includes('钩')) return '亅'
    if (name.includes('折')) return '乛'
    return name.charAt(0)
  })
}

// 预加载当前文本的笔画数据
function preloadStrokeData() {
  if (!inputText.value) return
  
  const chars = new Set(inputText.value.trim())
  
  chars.forEach(char => {
    if (!strokeCache.value.has(char)) {
      // 异步获取笔画数据，不阻塞UI
      setTimeout(() => {
        getStrokeNamesString(char)
      }, 0)
    }
  })
}

function handlePrint() {
  if (!previewRef.value) return
  
  printContent({
    title: `汉字练习 - ${inputText.value || '空白字帖'}`,
    content: previewRef.value.previewContainerRef,
    callback: () => console.log('打印完成')
  })
}

function handleExport() {
  if (!previewRef.value) return
  
  exportAsPDF(`汉字练习 - ${inputText.value || '空白字帖'}`, 
              previewRef.value.previewContainerRef)
}

function loadFromStore() {
  const settings = sheetStore.settings
  
  if (settings) {
    gridType.value = settings.gridType || DEFAULT_SHEET_SETTINGS.gridType
    gridSize.value = settings.gridSize || DEFAULT_SHEET_SETTINGS.gridSize
    fontSize.value = settings.fontSize || DEFAULT_SHEET_SETTINGS.fontSize
    strokeColor.value = settings.guideColor || DEFAULT_SHEET_SETTINGS.guideColor
    strokeOpacity.value = settings.guideOpacity || DEFAULT_SHEET_SETTINGS.guideOpacity
    showPinyin.value = settings.showPinyin ?? DEFAULT_SHEET_SETTINGS.showPinyin
    showStrokes.value = settings.showGuides ?? DEFAULT_SHEET_SETTINGS.showGuides
    layoutType.value = settings.layoutType as LayoutType || DEFAULT_SHEET_SETTINGS.layoutType
    charsPerRow.value = settings.charsPerRow || DEFAULT_SHEET_SETTINGS.charsPerRow
    fontFamily.value = settings.fontFamily || DEFAULT_SHEET_SETTINGS.fontFamily
  }
  
  if (sheetStore.inputText) {
    inputText.value = sheetStore.inputText
  }
}

watch([
  gridType, gridSize, fontSize, strokeColor,
  strokeOpacity, showPinyin, showStrokes,
  layoutType, charsPerRow, fontFamily
], () => {
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
    pinyinFontSize: 14,
    pinyinColor: '#666666',
    layoutType: layoutType.value,
    charsPerRow: charsPerRow.value,
    isSingleCharMode: true
  })
})

watch(inputText, (newText) => {
  if (newText) {
    sheetStore.setInputText(newText)
    // 当文本变化时预加载笔画数据
    preloadStrokeData()
  }
})

// 监听笔画显示状态变化
watch(showStrokes, (newVal) => {
  if (newVal) {
    // 当开启笔画显示时，预加载当前文本的笔画数据
    preloadStrokeData()
  }
})

onMounted(() => {
  loadFromStore()
  PinyinService.preloadCommonCharacters(COMMON_CHARACTERS)
  
  // 如果已启用笔画显示，预加载笔画数据
  if (showStrokes.value && inputText.value) {
    preloadStrokeData()
  }
})
</script>

<style scoped>
.panel-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 10px;
  color: #333;
}

.character-grid {
  width: 100%;
}

.character-cell {
  position: relative;
}

.row-first {
  font-weight: 500;
  color: #000;
}

.info-area {
  position: absolute;
  top: -20px;
  left: 0;
  width: 120%;
  max-width: 120%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  white-space: nowrap;
  transform: translateX(-10%);
}

.pinyin-text {
  font-size: 12px;
  color: #666;
  margin-right: 4px;
}

.stroke-text {
  font-size: 11px;
  color: #888;
}

.character {
  z-index: 1;
  user-select: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px 0;
}

.toggle-label {
  font-size: 14px;
  color: #333;
}

@media print {
  .character-cell, 
  .grid-background,
  .character,
  .info-area,
  .pinyin-text,
  .stroke-text {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>