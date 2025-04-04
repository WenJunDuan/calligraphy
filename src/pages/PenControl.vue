<template>
  <SheetContainer>
    <!-- 预览区域 -->
    <template #preview>
      <SheetPreview :pages="previewPages" ref="previewRef">
        <template #content="{ pageIndex }">
          <div class="pattern-container">
            <template v-if="selectedPatterns.length > 0">
              <!-- 每行练习图案 -->
              <div 
                v-for="(patternId, rowIndex) in selectedPatterns" 
                :key="`row-${pageIndex}-${rowIndex}`"
                class="pattern-row"
              >
                <div 
                  v-for="colIndex in repeatCount" 
                  :key="`cell-${pageIndex}-${rowIndex}-${colIndex}`"
                  class="pattern-cell"
                  :style="cellStyle"
                  :class="{ 'grid-background': showGridBackground, [gridType]: showGridBackground }"
                >
                  <div 
                    class="pattern"
                    v-html="getPatternSvg(patternId)"
                    :style="patternStyle"
                  ></div>
                </div>
              </div>
            </template>
            <div v-else class="empty-state">
              请在右侧选择控笔练习图案
            </div>
          </div>
        </template>
      </SheetPreview>
    </template>

    <!-- 控制面板 -->
    <template #control-panel>
      <ControlPanel @print="handlePrint" @export="handleExport">
        <!-- 图案选择区域 -->
        <div class="panel-section">
          <h3 class="section-title">选择练习图案</h3>
          <div class="patterns-grid">
            <!-- 基础图案 -->
            <div class="pattern-group">
              <h4 class="group-title">基础图案</h4>
              <div class="pattern-items">
                <div 
                  v-for="(pattern, index) in patternGroups.basic"
                  :key="`basic-${index}`"
                  class="pattern-item"
                  :class="{ active: selectedPatterns.includes(pattern.id) }"
                  @click="togglePattern(pattern.id)"
                  v-html="pattern.svg"
                ></div>
              </div>
            </div>
            
            <!-- 曲线图案 -->
            <div class="pattern-group">
              <h4 class="group-title">曲线图案</h4>
              <div class="pattern-items">
                <div 
                  v-for="(pattern, index) in patternGroups.curves"
                  :key="`curve-${index}`"
                  class="pattern-item"
                  :class="{ active: selectedPatterns.includes(pattern.id) }"
                  @click="togglePattern(pattern.id)"
                  v-html="pattern.svg"
                ></div>
              </div>
            </div>
            
            <!-- 复杂图案 -->
            <div class="pattern-group">
              <h4 class="group-title">复杂图案</h4>
              <div class="pattern-items">
                <div 
                  v-for="(pattern, index) in patternGroups.complex"
                  :key="`complex-${index}`"
                  class="pattern-item"
                  :class="{ active: selectedPatterns.includes(pattern.id) }"
                  @click="togglePattern(pattern.id)"
                  v-html="pattern.svg"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 设置部分 -->
        <div class="panel-section">
          <h3 class="section-title">练习设置</h3>
          
          <SettingItem label="重复练习">
            <n-slider v-model:value="repeatCount" :min="5" :max="24" :step="1" />
            <template #value>{{ repeatCount }}次</template>
          </SettingItem>
          
          <SettingItem label="图案大小">
            <n-slider v-model:value="patternSize" :min="32" :max="80" :step="4" />
            <template #value>{{ patternSize }}px</template>
          </SettingItem>
          
          <SettingItem label="线条粗细">
            <n-slider v-model:value="lineWidth" :min="1" :max="5" :step="0.5" />
            <template #value>{{ lineWidth }}px</template>
          </SettingItem>
          
          <SettingItem label="线条颜色">
            <n-select v-model:value="lineColor" :options="colorOptions" />
          </SettingItem>
          
          <SettingItem label="透明度">
            <n-slider v-model:value="lineOpacity" :min="0" :max="100" />
            <template #value>{{ lineOpacity }}%</template>
          </SettingItem>
          
          <SettingItem label="格子类型">
            <n-select v-model:value="gridType" :options="gridTypeOptions" />
          </SettingItem>
        </div>
      </ControlPanel>
    </template>
  </SheetContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NSlider, NSelect } from 'naive-ui'
import SheetContainer from '@/components/SheetContainer.vue'
import SheetPreview from '@/components/SheetPreview.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import SettingItem from '@/components/SettingItem.vue'
import { PRACTICE_PATTERNS, COLOR_OPTIONS, GRID_OPTIONS } from '@/constants'
import { useSettingsStore } from '@/stores'
import { printContent, exportAsPDF } from '@/utils/printer'
import { generatePatternSVG } from '@/utils/strokeGen'

// 存储引用
const previewRef = ref(null)
const settingsStore = useSettingsStore()

// 图案设置
const patternGroups = {
  basic: PRACTICE_PATTERNS.basic,
  curves: PRACTICE_PATTERNS.curves,
  complex: PRACTICE_PATTERNS.complex
}

const selectedPatterns = ref<string[]>(['horizontal-line', 'wave', 'zigzag', 'spiral', 'circle'])
const repeatCount = ref(12)
const patternSize = ref(60)
const lineWidth = ref(2)
const lineColor = ref('red')
const lineOpacity = ref(60)
const showGridBackground = ref(true)
const gridType = ref('fang')
const gridTypeOptions = GRID_OPTIONS
const colorOptions = COLOR_OPTIONS

// 缓存SVG图案
const patternSvgCache = new Map()

// 创建预览页面
const previewPages = computed(() => selectedPatterns.value.length === 0 ? [[]] : [[]])

// 计算样式
const cellStyle = computed(() => ({
  width: `${patternSize.value}px`,
  height: `${patternSize.value}px`,
  willChange: 'transform' // 提高性能
}))

const patternStyle = computed(() => ({
  color: lineColor.value,
  opacity: lineOpacity.value / 100
}))

// 获取图案SVG (使用缓存提高性能)
function getPatternSvg(id: string): string {
  // 生成缓存键
  const cacheKey = `${id}-${patternSize.value}-${lineWidth.value}-${lineColor.value}-${lineOpacity.value}`
  
  // 检查缓存
  if (patternSvgCache.has(cacheKey)) {
    return patternSvgCache.get(cacheKey)
  }
  
  // 从所有图案中查找
  const allPatterns = [...patternGroups.basic, ...patternGroups.curves, ...patternGroups.complex]
  const pattern = allPatterns.find(p => p.id === id)
  
  if (!pattern) return ''
  
  // 生成SVG并缓存
  const svg = generatePatternSVG(id, {
    width: patternSize.value,
    height: patternSize.value,
    strokeWidth: lineWidth.value,
    strokeColor: lineColor.value,
    strokeOpacity: lineOpacity.value / 100,
    repeat: 1
  })
  
  // 保存到缓存
  patternSvgCache.set(cacheKey, svg)
  
  return svg
}

// 切换选择图案
function togglePattern(id: string) {
  const index = selectedPatterns.value.indexOf(id)
  if (index >= 0) {
    selectedPatterns.value.splice(index, 1)
  } else {
    selectedPatterns.value.push(id)
  }
}

// 清除SVG缓存
function clearPatternCache() {
  patternSvgCache.clear()
}

// 导出与打印功能
function handlePrint() {
  if (!previewRef.value) return
  
  printContent({
    title: '控笔练习',
    content: previewRef.value.previewContainerRef,
    callback: () => console.log('打印完成')
  })
}

function handleExport() {
  if (!previewRef.value) return
  exportAsPDF('控笔练习', previewRef.value.previewContainerRef)
}

// 使用防抖保存设置
let saveTimeout: number | null = null
function saveSettings() {
  if (saveTimeout) clearTimeout(saveTimeout)
  
  saveTimeout = window.setTimeout(() => {
    // 保存到localStorage
    localStorage.setItem('penControl-settings', JSON.stringify({
      selectedPatterns: selectedPatterns.value,
      repeatCount: repeatCount.value,
      patternSize: patternSize.value,
      lineWidth: lineWidth.value,
      lineColor: lineColor.value,
      lineOpacity: lineOpacity.value,
      showGridBackground: showGridBackground.value,
      gridType: gridType.value
    }))
    
    // 清除SVG缓存，因为设置已更改
    clearPatternCache()
  }, 300)
}

// 监听设置变化
watch([
  selectedPatterns, repeatCount, patternSize, 
  lineWidth, lineColor, lineOpacity,
  showGridBackground, gridType
], saveSettings)

// 初始化时尝试加载保存的设置
try {
  const savedSettings = localStorage.getItem('penControl-settings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    selectedPatterns.value = settings.selectedPatterns || selectedPatterns.value
    repeatCount.value = settings.repeatCount || repeatCount.value
    patternSize.value = settings.patternSize || patternSize.value
    lineWidth.value = settings.lineWidth || lineWidth.value
    lineColor.value = settings.lineColor || lineColor.value
    lineOpacity.value = settings.lineOpacity || lineOpacity.value
    showGridBackground.value = settings.showGridBackground !== undefined ? settings.showGridBackground : showGridBackground.value
    gridType.value = settings.gridType || gridType.value
  }
} catch (error) {
  console.error('加载控笔练习设置失败:', error)
}
</script>

<style scoped>
:deep(.paper) {
  padding: 30px !important;
}

.pattern-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  contain: content;
}

.pattern-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.pattern-cell {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  contain: strict;
}

.pattern {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pattern svg {
  width: 100%;
  height: 100%;
  display: block;
}

.grid-background {
  position: relative;
}

.grid-background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-size: 100% 100%;
  opacity: 0.3;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 300px;
  color: #aaa;
  font-size: 16px;
}

.panel-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: #333;
}

.patterns-grid {
  width: 100%;
}

.pattern-group {
  margin-bottom: 16px;
}

.group-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #666;
}

.pattern-items {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.pattern-item {
  width: 40px;
  height: 40px;
  border: 1px solid #eee;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 6px;
  color: #666;
  transition: all 0.2s ease;
}

.pattern-item:hover {
  background-color: #f9f9f9;
  transform: scale(1.05);
}

.pattern-item.active {
  border-color: #4361ee;
  background-color: rgba(67, 97, 238, 0.05);
  color: #4361ee;
}

.pattern-item svg {
  width: 100%;
  height: 100%;
}

@media print {
  .pattern-container {
    padding: 0;
  }
  
  .pattern-cell {
    print-color-adjust: exact;
  }
  
  .pattern svg {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .grid-background::before {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    opacity: 0.4 !important;
  }
}
</style>