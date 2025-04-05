<template>
  <SheetContainer>
    <!-- 预览区域 -->
    <template #preview>
      <SheetPreview :pages="paginatedContent" ref="previewRef">
        <template #content="{ pageCells, pageIndex }">
          <div class="poetry-content" :class="{ 'vertical-layout': layoutType === 'vertical' }">
            <!-- 按行或列渲染内容 -->
            <template v-if="formattedLines.length > 0">
              <div v-for="(line, lineIndex) in getPageLines(pageIndex)" :key="`line-${pageIndex}-${lineIndex}`"
                class="poetry-line" :style="lineStyle">
                <div v-for="(char, charIndex) in line" :key="`char-${pageIndex}-${lineIndex}-${charIndex}`"
                  class="character-cell" :style="cellStyle">
                  <!-- 背景网格 -->
                  <div v-if="char !== ' ' && char !== '　'" class="grid-background" :class="gridType"></div>

                  <div v-if="char !== ' ' && char !== '　'" class="character-reference" :style="characterStyle">
                    {{ char }}
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="empty-state">
              请在右侧输入要练习的诗词
            </div>
          </div>
        </template>
      </SheetPreview>
    </template>

    <!-- 控制面板 -->
    <template #control-panel>
      <ControlPanel @print="handlePrint" @export="handleExport">
        <!-- 输入区域 -->
        <div class="panel-section">
          <n-input v-model:value="inputText" type="textarea" placeholder="输入要练习的诗词"
            :autosize="{ minRows: 4, maxRows: 8 }" class="poetry-input" />
        </div>

        <!-- 布局设置 -->
        <div class="panel-section">
          <h3 class="section-title">布局设置</h3>

          <SettingItem label="排版方式">
            <n-select v-model:value="layoutType" :options="LAYOUT_OPTIONS" />
          </SettingItem>

          <SettingItem label="格子类型">
            <n-select v-model:value="gridType" :options="GRID_OPTIONS" />
          </SettingItem>

          <SettingItem label="方格大小">
            <n-slider v-model:value="gridSize" :min="32" :max="80" :step="4" />
            <template #value>{{ gridSize }}px</template>
          </SettingItem>
        </div>

        <!-- 字体设置 -->
        <div class="panel-section">
          <h3 class="section-title">字体设置</h3>

          <SettingItem label="字体类型">
            <n-select v-model:value="fontFamily" :options="fontsStore.fontOptions" />
          </SettingItem>

          <SettingItem label="字体大小">
            <n-slider v-model:value="fontSize" :min="40" :max="100" :step="5" />
            <template #value>{{ fontSize }}%</template>
          </SettingItem>
        </div>

        <!-- 描红样式 -->
        <div class="panel-section">
          <h3 class="section-title">描红样式</h3>

          <SettingItem label="描红颜色">
            <n-select v-model:value="guideColor" :options="COLOR_OPTIONS" />
          </SettingItem>

          <SettingItem label="描红透明度">
            <n-slider v-model:value="guideOpacity" :min="0" :max="100" />
            <template #value>{{ guideOpacity }}%</template>
          </SettingItem>
        </div>
      </ControlPanel>
    </template>
  </SheetContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { NInput, NSelect, NSlider } from 'naive-ui'
import SheetContainer from '@/components/SheetContainer.vue'
import SheetPreview from '@/components/SheetPreview.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import SettingItem from '@/components/SettingItem.vue'
import { useSheetStore, useSettingsStore, useFontsStore } from '@/stores'
import { LayoutType, GridType } from '@/types'
import { GRID_OPTIONS, LAYOUT_OPTIONS, COLOR_OPTIONS, A4_DIMENSIONS } from '@/constants'
import { printContent, exportAsPDF } from '@/utils/printer'

// 页面常量
const A4_WIDTH = A4_DIMENSIONS.WIDTH_PX
const A4_HEIGHT = A4_DIMENSIONS.HEIGHT_PX
const PAGE_MARGIN = 30
const SIDE_MARGIN = 30

// 组件引用
const previewRef = ref(null)

// 存储引用
const sheetStore = useSheetStore()
const settingsStore = useSettingsStore()
const fontsStore = useFontsStore()

// 输入文本
const inputText = ref('')

// 布局设置
const layoutType = ref<LayoutType>('vertical')
const gridType = ref<GridType>('fang')
const gridSize = ref(48)

// 字体设置
const fontFamily = ref('楷体, KaiTi, STKaiti, serif')
const fontSize = ref(80)

// 描红设置
const guideColor = ref('red')
const guideOpacity = ref(10)

// 获取颜色值映射
function getColorValue(colorName: string): string {
  switch (colorName) {
    case 'red': return '#ff6666'
    case 'blue': return '#6666ff'
    case 'gray': return '#aaaaaa'
    default: return '#ff6666'
  }
}

// 格式化诗词 - 计算每行字符并自动换行
const formattedLines = computed(() => {
  if (!inputText.value) return []

  const lines = inputText.value.split('\n')
  const result = []

  const contentWidth = A4_WIDTH - (PAGE_MARGIN * 2)
  const contentHeight = A4_HEIGHT - (PAGE_MARGIN * 2)

  const charsPerRow = layoutType.value === 'vertical'
    ? Math.floor(contentHeight / gridSize.value)
    : Math.floor(contentWidth / gridSize.value)

  lines.forEach(line => {
    if (!line.trim()) return

    const chars = Array.from(line.trim())

    if (layoutType.value === 'vertical') {
      for (let i = 0; i < chars.length; i += charsPerRow) {
        const columnChars = chars.slice(i, i + charsPerRow)
        if (columnChars.length > 0) {
          result.push(columnChars)
        }
      }
    } else {
      for (let i = 0; i < chars.length; i += charsPerRow) {
        const rowChars = chars.slice(i, i + charsPerRow)
        if (rowChars.length > 0) {
          result.push(rowChars)
        }
      }
    }
  })

  return result
})

// 计算内容区域的有效尺寸
const contentDimensions = computed(() => {
  const contentWidth = A4_WIDTH - (SIDE_MARGIN * 2)
  const contentHeight = A4_HEIGHT - (PAGE_MARGIN * 2)

  const charsPerRow = layoutType.value === 'vertical'
    ? Math.floor(contentHeight / gridSize.value)
    : Math.floor(contentWidth / gridSize.value)

  const rowsPerPage = layoutType.value === 'vertical'
    ? Math.floor(contentWidth / gridSize.value)
    : Math.floor(contentHeight / gridSize.value)

  return {
    width: contentWidth,
    height: contentHeight,
    charsPerRow,
    rowsPerPage,
    charsPerPage: charsPerRow * rowsPerPage
  }
})

// 分页功能 - 将内容分成多个页面
const paginatedContent = computed(() => {
  if (!formattedLines.value || formattedLines.value.length === 0) {
    return [[]]
  }

  const pages = []
  let currentPage = []
  let currentLineCount = 0

  const { rowsPerPage } = contentDimensions.value

  formattedLines.value.forEach(line => {
    if (currentLineCount >= rowsPerPage) {
      pages.push(currentPage)
      currentPage = []
      currentLineCount = 0
    }

    currentPage.push(line)
    currentLineCount++
  })

  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages.length > 0 ? pages : [[]]
})

// 获取特定页面的行
function getPageLines(pageIndex: number) {
  if (!paginatedContent.value || !paginatedContent.value[pageIndex]) {
    return []
  }
  return paginatedContent.value[pageIndex]
}

// 计算样式
const lineStyle = computed(() => ({
  display: 'flex',
  flexDirection: layoutType.value === 'vertical' ? 'column' : 'row',
  margin: '0'
}))

const cellStyle = computed(() => ({
  width: `${gridSize.value}px`,
  height: `${gridSize.value}px`,
  position: 'relative',
  margin: '0'
}))

// 字符样式 - 使用描红颜色
const characterStyle = computed(() => {
  const strokeColorValue = getColorValue(guideColor.value)

  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: `${fontSize.value * gridSize.value / 100}px`,
    fontFamily: fontFamily.value,
    color: strokeColorValue,
    opacity: Math.max(0.1, guideOpacity.value / 100),
    zIndex: 2,
    userSelect: 'none'
  }
})

// 打印和导出方法
function handlePrint() {
  if (!previewRef.value) return

  const strokeColorValue = getColorValue(guideColor.value)

  printContent({
    title: '诗词字帖 - ' + (inputText.value ? inputText.value.substring(0, 20) : '空白练习'),
    content: previewRef.value.previewContainerRef,
    addStyles: `
      .character-cell { page-break-inside: avoid; }
      .character-reference { color: ${strokeColorValue} !important; opacity: ${Math.max(0.1, guideOpacity.value / 100)} !important; }
    `,
    callback: () => {
      console.log('打印完成')
    }
  })
}

function handleExport() {
  if (!previewRef.value) return

  exportAsPDF(
    '诗词字帖 - ' + (inputText.value ? inputText.value.substring(0, 20) : '空白练习'),
    previewRef.value.previewContainerRef
  )
}

// 从Store加载设置
function loadFromStore() {
  const settings = sheetStore.settings

  if (settings) {
    gridType.value = settings.gridType || 'fang'
    gridSize.value = settings.gridSize || 48
    fontFamily.value = settings.fontFamily || '楷体, KaiTi, STKaiti, serif'
    fontSize.value = settings.fontSize || 80
    guideColor.value = settings.guideColor || 'red'
    guideOpacity.value = settings.guideOpacity || 10

    // 诗词特有设置
    const poetrySettings = localStorage.getItem('poetry-settings')
    if (poetrySettings) {
      try {
        const parsed = JSON.parse(poetrySettings)
        layoutType.value = parsed.layoutType || 'vertical'
      } catch (e) {
        console.error('Error parsing poetry settings:', e)
      }
    }

    if (sheetStore.inputText) {
      inputText.value = sheetStore.inputText
    }
  }
}

// 保存设置到Store和localStorage
watch([
  layoutType, gridType, gridSize,
  fontFamily, fontSize,
  guideColor, guideOpacity
], () => {
  sheetStore.updateSettings({
    gridType: gridType.value,
    gridSize: gridSize.value,
    fontFamily: fontFamily.value,
    fontSize: fontSize.value,
    fontColor: 'black',
    showGuides: true,
    guideColor: guideColor.value,
    guideOpacity: guideOpacity.value,
  })

  localStorage.setItem('poetry-settings', JSON.stringify({ layoutType: layoutType.value }))
})

// 保存输入文本
watch(inputText, (newText) => {
  if (newText) {
    sheetStore.setInputText(newText)
  }
})

// 初始化
onMounted(() => {
  loadFromStore()
})
</script>

<style scoped>

/* 预览容器 */
.preview-container {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #f5f7fa;
  border-radius: 8px;
}

/* A4纸样式 */
.a4-paper {
  width: v-bind(A4_WIDTH + 'px');
  height: v-bind(A4_HEIGHT + 'px');
  padding: v-bind(PAGE_MARGIN + 'px');
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  margin: 0 auto;
}

/* 诗词内容容器 */
.poetry-content {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  width: 100%;
  height: 100%;
}

/* 竖向布局 */
.poetry-content.vertical-layout {
  flex-direction: row-reverse;
}

/* 诗词行 */
.poetry-line {
  display: flex;
}

/* 字符单元格 */
.character-cell {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 网格背景 */
.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* 参考字符 */
.character-reference {
  position: absolute;
  z-index: 2;
}

/* 空状态提示 */
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: #aaa;
  font-size: 16px;
}

.panel-section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
}

.poetry-input {
  width: 100%;
  margin-bottom: 12px;
}

/* 打印样式优化 */
@media print {

  .character-cell,
  .grid-background,
  .character-reference {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>