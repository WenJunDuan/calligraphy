<template>
  <SheetContainer>
    <!-- 预览区域 -->
    <template #preview>
      <div class="preview-container">
        <div class="a4-paper" ref="paperRef">
          <!-- 诗词内容 -->
          <div class="poetry-content" :class="{ 'vertical-layout': layoutType === 'vertical' }">
            <!-- 按行或列渲染内容 -->
            <template v-if="formattedLines.length > 0">
              <div v-for="(line, lineIndex) in formattedLines" :key="`line-${lineIndex}`" class="poetry-line"
                :style="lineStyle">
                <div v-for="(char, charIndex) in line" :key="`char-${lineIndex}-${charIndex}`" class="character-cell"
                  :style="cellStyle">
                  <!-- 背景网格 -->
                  <div v-if="char !== ' ' && char !== '　'" class="grid-background" :class="gridType"></div>

                  <!-- 描红字符 -->
                  <div v-if="char !== ' ' && char !== '　'" class="character-guide" :style="guideStyle">
                    {{ char }}
                  </div>

                  <!-- 参考字符 -->
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
        </div>
      </div>
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
import ControlPanel from '@/components/ControlPanel.vue'
import SettingItem from '@/components/SettingItem.vue'
import { useSheetStore, useSettingsStore, useFontsStore } from '@/stores'
import { LayoutType, GridType } from '@/types'
import { GRID_OPTIONS, LAYOUT_OPTIONS, COLOR_OPTIONS, A4_DIMENSIONS } from '@/constants'
import { printContent, exportAsPDF } from '@/utils/printer'

// 页面常量
const A4_WIDTH = A4_DIMENSIONS.WIDTH_PX     // A4宽度 (795px)
const A4_HEIGHT = A4_DIMENSIONS.HEIGHT_PX    // A4高度 (1123px)
const PAGE_MARGIN = 30                      // 统一页面边距

// 组件引用
const paperRef = ref<HTMLElement | null>(null)

// 存储引用
const sheetStore = useSheetStore()
const settingsStore = useSettingsStore()
const fontsStore = useFontsStore()

// 输入文本
const inputText = ref('')

// 布局设置
const layoutType = ref<LayoutType>('vertical') // 默认竖排
const gridType = ref<GridType>('fang')         // 默认方格
const gridSize = ref(48)                       // 默认方格大小

// 字体设置
const fontFamily = ref('楷体, KaiTi, STKaiti, serif')
const fontSize = ref(80)

// 描红设置
const guideColor = ref('red')                 // 描红颜色
const guideOpacity = ref(30)                  // 描红透明度 (百分比)

// 格式化诗词 - 计算每行字符并自动换行
const formattedLines = computed(() => {
  if (!inputText.value) return []

  // 按行分割
  const lines = inputText.value.split('\n')
  const result = []

  // 计算A4纸内容区有效宽度和高度
  const contentWidth = A4_WIDTH - (PAGE_MARGIN * 2)
  const contentHeight = A4_HEIGHT - (PAGE_MARGIN * 2)

  // 计算每行/列能容纳的字符数量
  const charsPerRow = layoutType.value === 'vertical'
    ? Math.floor(contentHeight / gridSize.value) // 竖排模式下一列可容纳的字符数
    : Math.floor(contentWidth / gridSize.value)  // 横排模式下一行可容纳的字符数

  // 处理每行文本
  lines.forEach(line => {
    if (!line.trim()) return // 跳过空行

    const chars = Array.from(line.trim())

    if (layoutType.value === 'vertical') {
      // 竖排模式 - 每一列是一个数组
      for (let i = 0; i < chars.length; i += charsPerRow) {
        const columnChars = chars.slice(i, i + charsPerRow)
        if (columnChars.length > 0) {
          result.push(columnChars)
        }
      }
    } else {
      // 横排模式 - 自动换行
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

// 计算样式
// A4纸样式
const paperStyle = computed(() => ({
  width: `${A4_WIDTH}px`,
  height: `${A4_HEIGHT}px`,
  padding: `${PAGE_MARGIN}px`,
  boxSizing: 'border-box',
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden'
}))

// 行样式
const lineStyle = computed(() => ({
  display: 'flex',
  flexDirection: layoutType.value === 'vertical' ? 'column' : 'row',
  margin: '0'
}))

// 单元格样式
const cellStyle = computed(() => ({
  width: `${gridSize.value}px`,
  height: `${gridSize.value}px`,
  position: 'relative',
  margin: '0'
}))

// 字符样式
const characterStyle = computed(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: `${fontSize.value * gridSize.value / 100}px`,
  fontFamily: fontFamily.value,
  color: 'black',
  zIndex: 3,
  userSelect: 'none'
}))

// 描红样式
const guideStyle = computed(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: `${fontSize.value * gridSize.value / 100}px`,
  fontFamily: fontFamily.value,
  color: guideColor.value,
  opacity: guideOpacity.value / 100,
  zIndex: 2,
  userSelect: 'none',
  pointerEvents: 'none'
}))

// 打印和导出方法
function handlePrint() {
  if (!paperRef.value) return

  printContent({
    title: '诗词字帖',
    content: paperRef.value,
    callback: () => {
      console.log('打印完成')
    }
  })
}

function handleExport() {
  if (!paperRef.value) return

  exportAsPDF('诗词字帖', paperRef.value)
}

// 从Store加载设置
function loadFromStore() {
  const settings = sheetStore.settings

  if (settings) {
    // 布局设置
    gridType.value = settings.gridType || 'fang'
    gridSize.value = settings.gridSize || 48

    // 字体设置
    fontFamily.value = settings.fontFamily || '楷体, KaiTi, STKaiti, serif'
    fontSize.value = settings.fontSize || 80

    // 描红设置
    guideColor.value = settings.guideColor || 'red'
    guideOpacity.value = settings.guideOpacity || 30

    // 诗词特有设置，从本地存储中恢复
    const poetrySettings = localStorage.getItem('poetry-settings')
    if (poetrySettings) {
      try {
        const parsed = JSON.parse(poetrySettings)
        layoutType.value = parsed.layoutType || 'vertical'
      } catch (e) {
        console.error('Error parsing poetry settings:', e)
      }
    }

    // 之前输入的文本
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
  // 保存通用设置到SheetStore
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

  // 保存诗词特有设置到localStorage
  const poetrySettings = {
    layoutType: layoutType.value,
  }

  localStorage.setItem('poetry-settings', JSON.stringify(poetrySettings))
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

  // 记录A4尺寸和容量信息
  const contentWidth = A4_WIDTH - (PAGE_MARGIN * 2)
  const contentHeight = A4_HEIGHT - (PAGE_MARGIN * 2)

  const charsPerRow = Math.floor(contentWidth / gridSize.value)
  const charsPerColumn = Math.floor(contentHeight / gridSize.value)

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
  width: v-bind('A4_WIDTH + "px"');
  height: v-bind('A4_HEIGHT + "px"');
  padding: v-bind('PAGE_MARGIN + "px"');
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
  /* 从右向左排列 */
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

/* 描红字符 */
.character-guide {
  position: absolute;
  z-index: 2;
}

/* 参考字符 */
.character-reference {
  position: absolute;
  z-index: 3;
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
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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
  .preview-container {
    padding: 0;
    background-color: white;
  }

  .a4-paper {
    box-shadow: none;
    width: 210mm;
    height: 297mm;
  }

  .character-cell,
  .grid-background,
  .character-guide,
  .character-reference {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
}
</style>