<template>
    <div class="sheet-page">
      <AppHeader />
      
      <div class="sheet-content">
        <!-- 字帖预览区域 -->
        <div class="sheet-preview">
          <div class="paper" ref="paperRef">
            <template v-if="formattedText.length > 0">
              <div 
                v-for="(line, lineIndex) in formattedText" 
                :key="`line-${lineIndex}`"
                class="poetry-line"
              >
                <div 
                  v-for="(char, charIndex) in line" 
                  :key="`char-${lineIndex}-${charIndex}`"
                  class="character-cell"
                  :class="[gridType]"
                  :style="cellStyle"
                >
                  <!-- 顶部拼音 -->
                  <div v-if="showPinyin && char !== ' ' && char !== '　'" class="pinyin-area">
                    <small>{{ getPinyin(char) }}</small>
                  </div>
                  
                  <!-- 中间汉字 -->
                  <div 
                    v-if="char !== ' ' && char !== '　'"
                    class="character"
                    :style="characterStyle"
                  >
                    {{ char }}
                  </div>
                  
                  <!-- 背景网格 -->
                  <div 
                    v-if="char !== ' ' && char !== '　'"
                    class="grid-background"
                    :class="gridType"
                  ></div>
                </div>
              </div>
            </template>
            <div v-else class="empty-state">
              请在右侧输入要练习的诗词
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
            <n-input
              v-model:value="inputText"
              type="textarea"
              placeholder="输入要练习的诗词"
              :autosize="{ minRows: 4, maxRows: 10 }"
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
  import { ref, computed, watch } from 'vue'
  import { NButton, NInput, NSelect, NSlider, NSwitch } from 'naive-ui'
  import AppHeader from '@/components/AppHeader.vue'
  import { useSheetStore } from '@/stores/sheet'
  import { useFontsStore } from '@/stores/fonts'
  import { PinyinService } from '@/services/pinyinService'
  
  // 存储引用
  const sheetStore = useSheetStore()
  const fontsStore = useFontsStore()
  const paperRef = ref(null)
  
  // 输入文本
  const inputText = ref('')
  const formattedText = computed(() => {
    if (!inputText.value) return []
    
    // 按行分割
    const lines = inputText.value.split('\n')
    
    // 处理每行
    return lines.map(line => {
      // 处理标点符号
      return formatLine(line)
    })
  })
  
  // 格式化行文本（处理标点符号和空格）
  function formatLine(line: string): string[] {
    const result: string[] = []
    const chars = Array.from(line)
    
    // 中文标点符号处理
    for (const char of chars) {
      result.push(char)
      
      // 在某些标点符号后添加空格
      if ([',', '，', '。', '；', '、', '：'].includes(char)) {
        // 不添加空格，仅处理标点符号
      }
    }
    
    return result
  }
  
  // 字帖设置
  const showPinyin = ref(true)
  const showStrokes = ref(true)
  const embedText = ref(false)
  const gridType = ref('tian') // tian, mi, hui
  const gridSize = ref(48) // 诗词字体默认小一些
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
      gridSize.value = settings.gridSize || 48 // 诗词默认小一些
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
  
  // 初始化加载
  loadFromStore()
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
  
  .poetry-line {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }
  
  .character-cell {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2px;
  }
  
  .pinyin-area {
    position: absolute;
    top: 5%;
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