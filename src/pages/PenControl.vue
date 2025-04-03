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
                >
                  <!-- 使用v-html插入SVG图案 -->
                  <div 
                    class="pattern"
                    v-html="getPatternSvg(patternId)"
                    :style="patternStyle"
                  ></div>
                  
                  <!-- 移除了嵌入文字功能 -->
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
          
          <!-- 移除了嵌入文字相关的设置 -->
        </div>
      </ControlPanel>
    </template>
  </SheetContainer>
</template>

<script setup lang="ts">
import { ref, computed, watch, CSSProperties } from 'vue'
import { NSlider, NSelect, NInput } from 'naive-ui'
import SheetContainer from '@/components/SheetContainer.vue'
import SheetPreview from '@/components/SheetPreview.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import SettingItem from '@/components/SettingItem.vue'
import ToggleSetting from '@/components/ToggleSetting.vue'
import { PRACTICE_PATTERNS, COLOR_OPTIONS } from '@/constants'
import { useFontsStore, useSettingsStore } from '@/stores'
import { printContent, exportAsPDF } from '@/utils/printer'
import { calculateCharacterStyle } from '@/utils/sheetUtils'
import { generatePatternSVG } from '@/utils/strokeGen'

// 存储引用
const previewRef = ref(null)
const settingsStore = useSettingsStore()
const fontsStore = useFontsStore()

// 图案组
const patternGroups = {
  basic: PRACTICE_PATTERNS.basic,
  curves: PRACTICE_PATTERNS.curves,
  complex: PRACTICE_PATTERNS.complex
}

// 已选择的图案
const selectedPatterns = ref<string[]>(['horizontal-line', 'wave', 'zigzag', 'spiral', 'circle'])

// 控笔练习设置
const repeatCount = ref(10)
const patternSize = ref(50)
const lineWidth = ref(2)
const lineColor = ref('black')
const lineOpacity = ref(20)
// 移除了嵌入文字相关的变量

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

// 移除了嵌入文字相关的计算属性

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
  lineWidth, lineColor, lineOpacity
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
  justify-content: flex-start; /* 左对齐而不是居中 */
}

.pattern-cell {
  position: relative;
  border: 1px solid #bcbcbc;
  overflow: hidden; /* 确保内容不会溢出单元格 */
  padding: 4px; /* 添加内边距提供一些间距 */
}

.pattern {
  width: 100%;
  height: 100%;
  /* 移除绝对定位和flex居中，使用默认布局 */
  /* 这样可以保持原始SVG的布局，而不强制所有图案居中 */
  display: block;
}

/* 移除了嵌入文字相关的样式 */

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
  .pattern-cell {
    border: none;
  }
}
</style>