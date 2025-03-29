<template>
    <div class="sheet-page">
      <AppHeader />
      
      <div class="sheet-content">
        <!-- 控笔练习预览区域 -->
        <div class="sheet-preview">
          <div class="paper" ref="paperRef">
            <div class="pattern-container">
              <template v-if="selectedPatternIds.length > 0">
                <!-- 每行图案 -->
                <div 
                  v-for="(patternId, rowIndex) in selectedPatternIds" 
                  :key="`row-${rowIndex}`"
                  class="pattern-row"
                >
                  <div 
                    v-for="colIndex in repeatCount" 
                    :key="`cell-${rowIndex}-${colIndex}`"
                    class="pattern-cell"
                    :style="cellStyle"
                  >
                    <!-- 使用v-html插入SVG -->
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
          </div>
        </div>
        
        <!-- 控制面板 -->
        <div class="control-panel">
          <div class="panel-actions">
            <n-button class="export-btn">导出</n-button>
            <n-button type="primary" class="print-btn">打印</n-button>
          </div>
          
          <div class="panel-section">
            <div class="patterns-grid">
              <!-- 图案选择器 -->
              <div class="patterns-section">
                <!-- 基础图案 -->
                <div class="pattern-group">
                  <div 
                    v-for="(pattern, index) in basicPatterns"
                    :key="`basic-${index}`"
                    class="pattern-item"
                    :class="{ active: selectedPatternIds.includes(pattern.id) }"
                    @click="togglePattern(pattern.id)"
                    v-html="pattern.svg"
                  ></div>
                </div>
                
                <!-- 曲线图案 -->
                <div class="pattern-group">
                  <div 
                    v-for="(pattern, index) in curvePatterns"
                    :key="`curve-${index}`"
                    class="pattern-item"
                    :class="{ active: selectedPatternIds.includes(pattern.id) }"
                    @click="togglePattern(pattern.id)"
                    v-html="pattern.svg"
                  ></div>
                </div>
                
                <!-- 复杂图案 -->
                <div class="pattern-group">
                  <div 
                    v-for="(pattern, index) in complexPatterns"
                    :key="`complex-${index}`"
                    class="pattern-item"
                    :class="{ active: selectedPatternIds.includes(pattern.id) }"
                    @click="togglePattern(pattern.id)"
                    v-html="pattern.svg"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="panel-section">
            <div class="setting-item">
              <div class="setting-label">每行重复次数</div>
              <n-slider v-model:value="repeatCount" :min="5" :max="15" :step="1" />
              <div class="setting-value">{{ repeatCount }}</div>
            </div>
            
            <div class="setting-item">
              <div class="setting-label">图案大小</div>
              <n-slider v-model:value="patternSize" :min="32" :max="80" :step="4" />
              <div class="setting-value">{{ patternSize }}px</div>
            </div>
            
            <div class="setting-item">
              <div class="setting-label">线条粗细</div>
              <n-slider v-model:value="lineWidth" :min="1" :max="5" :step="0.5" />
              <div class="setting-value">{{ lineWidth }}px</div>
            </div>
            
            <div class="setting-item">
              <div class="setting-label">线条颜色</div>
              <n-select v-model:value="lineColor" :options="colorOptions" />
            </div>
            
            <div class="toggle-item">
              <span class="toggle-label">嵌入文字</span>
              <n-switch v-model:value="embedText" />
            </div>
            
            <div class="setting-item">
              <div class="setting-label">描红透明度</div>
              <n-slider v-model:value="lineOpacity" :min="0" :max="100" />
              <div class="setting-value">{{ lineOpacity }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { NButton, NSelect, NSlider, NSwitch } from 'naive-ui'
  import AppHeader from '@/components/AppHeader.vue'
  import { useSheetStore } from '@/stores/sheet'
  
  // 存储引用
  const sheetStore = useSheetStore()
  const paperRef = ref(null)
  
  // 控笔练习设置
  const repeatCount = ref(10)
  const patternSize = ref(50)
  const lineWidth = ref(2)
  const lineColor = ref('black')
  const lineOpacity = ref(20)
  const embedText = ref(false)
  
  // 已选择的图案ID
  const selectedPatternIds = ref<string[]>(['horizontal-line', 'wave', 'zigzag', 'spiral', 'circle'])
  
  // 颜色选项
  const colorOptions = [
    { label: '淡灰', value: 'lightgray' },
    { label: '中灰', value: 'gray' },
    { label: '黑色', value: 'black' },
    { label: '红色', value: 'red' },
    { label: '蓝色', value: 'blue' }
  ]
  
  // 基础图案
  const basicPatterns = [
    {
      id: 'horizontal-line',
      svg: '<svg viewBox="0 0 24 24"><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/></svg>'
    },
    {
      id: 'vertical-line',
      svg: '<svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="2"/></svg>'
    },
    {
      id: 'cross',
      svg: '<svg viewBox="0 0 24 24"><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="2"/></svg>'
    },
    {
      id: 'diagonal-line',
      svg: '<svg viewBox="0 0 24 24"><line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2"/></svg>'
    }
  ]
  
  // 曲线图案
  const curvePatterns = [
    {
      id: 'wave',
      svg: '<svg viewBox="0 0 24 24"><path d="M2,12 C5,7 8,17 12,12 C16,7 19,17 22,12" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'zigzag',
      svg: '<svg viewBox="0 0 24 24"><polyline points="2,12 7,7 12,17 17,7 22,12" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'curve',
      svg: '<svg viewBox="0 0 24 24"><path d="M2,17 C7,7 17,7 22,17" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'snake',
      svg: '<svg viewBox="0 0 24 24"><path d="M2,12 Q7,6 12,12 T22,12" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    }
  ]
  
  // 复杂图案
  const complexPatterns = [
    {
      id: 'spiral',
      svg: '<svg viewBox="0 0 24 24"><path d="M12,12 C12,9 15,9 15,12 C15,15 9,15 9,12 C9,7 15,7 15,12 C15,17 7,17 7,12" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'circle',
      svg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'square',
      svg: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'triangle',
      svg: '<svg viewBox="0 0 24 24"><polygon points="12,4 4,20 20,20" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    }
  ]
  
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
      strokeWidth: `${lineWidth.value}px`,
      opacity: lineOpacity.value / 100
    }
  })
  
  // 获取图案SVG
  function getPatternSvg(id: string): string {
    // 从所有图案中查找
    const allPatterns = [...basicPatterns, ...curvePatterns, ...complexPatterns]
    const pattern = allPatterns.find(p => p.id === id)
    return pattern ? pattern.svg : ''
  }
  
  // 切换选择图案
  function togglePattern(id: string) {
    const index = selectedPatternIds.value.indexOf(id)
    if (index >= 0) {
      // 如果已选择，则移除
      selectedPatternIds.value.splice(index, 1)
    } else {
      // 如果未选择，则添加
      selectedPatternIds.value.push(id)
    }
  }
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
  
  .pattern-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
  }
  
  .pattern-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px;
  }
  
  .pattern-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border: 1px dashed #eee;
  }
  
  .pattern {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
  
  .patterns-grid {
    width: 100%;
  }
  
  .patterns-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .pattern-group {
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
  
  .toggle-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0;
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
    
    .pattern-cell {
      border: none;
    }
  }
  </style>