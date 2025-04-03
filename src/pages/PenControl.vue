<template>
  <SheetContainer>
    <!-- 预览区域 -->
    <template #preview>
      <SheetPreview :pages="previewPages" ref="previewRef">
        <template #content="{ pageCells, pageIndex }">
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
                  <!-- 使用v-html插入SVG图案 -->
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
          
          <!-- 背景格设置 -->
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
// 移除不需要的ToggleSetting组件导入
import { PRACTICE_PATTERNS, COLOR_OPTIONS, GRID_OPTIONS } from '@/constants'
import { useSettingsStore } from '@/stores'
import { printContent, exportAsPDF } from '@/utils/printer'
import { generatePatternSVG } from '@/utils/strokeGen'

// 存储引用
const previewRef = ref(null)
const settingsStore = useSettingsStore()

// 图案组
const patternGroups = {
  basic: PRACTICE_PATTERNS.basic,
  curves: PRACTICE_PATTERNS.curves,
  complex: PRACTICE_PATTERNS.complex
}

// 已选择的图案
const selectedPatterns = ref<string[]>(['horizontal-line', 'wave', 'zigzag', 'spiral', 'circle'])

// 控笔练习设置 - 依照您要求的默认配置
const repeatCount = ref(12)  // 12次
const patternSize = ref(60)  // 60px
const lineWidth = ref(2)     // 2px
const lineColor = ref('red') // 红色
const lineOpacity = ref(60)  // 60%

// 背景格设置 - 默认开启，使用方格
const showGridBackground = ref(true)
const gridType = ref('fang')
const gridTypeOptions = GRID_OPTIONS

// 颜色选项
const colorOptions = COLOR_OPTIONS

// 创建预览页面
const previewPages = computed(() => {
  if (selectedPatterns.value.length === 0) return [[]]
  return [[]] // 简化的页面数组，实际上只有一页内容
})

// 计算样式
const cellStyle = computed(() => {
  return {
    width: `${patternSize.value}px`,
    height: `${patternSize.value}px`
  }
})

const patternStyle = computed(() => {
  return {
    color: lineColor.value,
    opacity: lineOpacity.value / 100
  }
})

// === 方法 ===
// 获取图案SVG
function getPatternSvg(id: string): string {
  // 从所有图案中查找
  const allPatterns = [...patternGroups.basic, ...patternGroups.curves, ...patternGroups.complex]
  const pattern = allPatterns.find(p => p.id === id)
  
  if (!pattern) return ''
  
  // 使用strokeGen工具生成SVG，添加线宽设置
  return generatePatternSVG(id, {
    width: patternSize.value,
    height: patternSize.value,
    strokeWidth: lineWidth.value,
    strokeColor: lineColor.value,
    strokeOpacity: lineOpacity.value / 100,
    repeat: 1
  })
}

// 切换选择图案
function togglePattern(id: string) {
  const index = selectedPatterns.value.indexOf(id)
  if (index >= 0) {
    // 如果已选择，则移除
    selectedPatterns.value.splice(index, 1)
  } else {
    // 如果未选择，则添加
    selectedPatterns.value.push(id)
  }
}

// 导出与打印功能
function handlePrint() {
  if (!previewRef.value) return
  
  printContent({
    title: '控笔练习',
    content: previewRef.value.previewContainerRef,
    callback: () => {
      console.log('打印完成')
    }
  })
}

function handleExport() {
  if (!previewRef.value) return
  
  exportAsPDF('控笔练习', previewRef.value.previewContainerRef)
}

// 监听设置变化，可以添加持久化保存的逻辑
watch([
  selectedPatterns, repeatCount, patternSize, 
  lineWidth, lineColor, lineOpacity,
  showGridBackground, gridType
], () => {
  // 可以添加保存设置到localStorage或pinia store的逻辑
  console.log('设置已更新')
})
</script>

<style scoped>
.pattern-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.pattern-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.pattern-cell {
  position: relative;
  /* border: 1px solid #d8d8d8; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.pattern {
  width: 100%;
  height: 100%;
  /* 增强居中效果 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2; /* 确保图案显示在背景网格之上 */
  position: relative;
}

/* 确保SVG图形居中显示 */
.pattern svg {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}

/* 引入项目中已有的网格背景样式 */
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
  opacity: 0.3; /* 降低背景透明度以便更好地看到图案 */
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

/* 打印样式优化 */
@media print {
  .pattern-container {
    padding: 0;
  }
  
  .pattern-cell {
    /* border: 1px solid #d8d8d8 !important; */
    print-color-adjust: exact;
  }
  
  /* 确保SVG在打印时也能显示 */
  .pattern svg {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  /* 确保背景网格在打印时显示 */
  .grid-background::before {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    opacity: 0.4 !important;
  }
}
</style>