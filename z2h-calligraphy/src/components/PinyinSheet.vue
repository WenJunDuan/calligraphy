<template>
    <div class="pinyin-sheet">
      <div 
        class="sheet-grid"
        :style="{
          gridTemplateColumns: `repeat(auto-fill, minmax(${gridSize}px, 1fr))`,
          gap: `${gridGap}px`
        }"
      >
        <div 
          v-for="(char, index) in characters" 
          :key="`char-${index}`"
          class="character-cell"
          :class="{ 'empty': char === ' ' }"
          :style="cellStyle"
        >
          <template v-if="char !== ' '">
            <!-- 拼音显示区域 -->
            <div 
              v-if="showPinyin" 
              class="pinyin-area"
              :style="pinyinStyle"
            >
              {{ getPinyin(char) }}
            </div>
            
            <!-- 汉字显示区域 -->
            <div 
              class="character-area"
              :style="characterStyle"
            >
              {{ char }}
            </div>
            
            <!-- 网格背景 -->
            <div 
              class="grid-background"
              :class="[gridType]"
            ></div>
          </template>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { getTextPinyin } from '@/utils/strokeGenCnchar'
  
  const props = defineProps({
    text: {
      type: String,
      required: true
    },
    gridType: {
      type: String,
      default: 'tian', // 'tian', 'mi', 'hui'
      validator: (value: string) => ['tian', 'mi', 'hui'].includes(value)
    },
    gridSize: {
      type: Number,
      default: 64
    },
    gridGap: {
      type: Number,
      default: 8
    },
    showPinyin: {
      type: Boolean,
      default: true
    },
    fontFamily: {
      type: String,
      default: '楷体'
    },
    fontSize: {
      type: Number, // 百分比值，相对于gridSize
      default: 80
    },
    fontColor: {
      type: String,
      default: '#333333'
    },
    pinyinFontSize: {
      type: Number, // 百分比值，相对于字体大小
      default: 40
    },
    pinyinColor: {
      type: String,
      default: '#666666'
    },
    withTone: {
      type: Boolean, // 拼音是否带声调
      default: true
    }
  })
  
  // 处理空格和换行，将文本转换为字符数组
  const characters = computed(() => {
    if (!props.text) return []
    
    // 替换换行为空格
    const normalizedText = props.text.replace(/\n/g, ' ')
    
    // 转换为字符数组
    return normalizedText.split('')
  })
  
  // 缓存拼音数据以提高性能
  const pinyinCache = ref<Record<string, string>>({})
  
  // 计算样式
  const cellStyle = computed(() => ({
    width: `${props.gridSize}px`,
    height: `${props.gridSize}px`
  }))
  
  const characterStyle = computed(() => ({
    fontFamily: props.fontFamily,
    fontSize: `${props.fontSize * props.gridSize / 100}px`,
    color: props.fontColor
  }))
  
  const pinyinStyle = computed(() => ({
    fontFamily: 'Arial, sans-serif',
    fontSize: `${props.pinyinFontSize * props.fontSize * props.gridSize / 10000}px`,
    color: props.pinyinColor
  }))
  
  // 初始化
  onMounted(() => {
    // 预加载频繁使用字符的拼音
    if (props.text && props.showPinyin) {
      preloadPinyinData(props.text);
    }
  })
  
  /**
   * 获取单个字符的拼音（带缓存）
   */
  function getPinyin(char: string): string {
    // 检查缓存
    if (pinyinCache.value[char]) {
      return pinyinCache.value[char];
    }
    
    // 不是汉字的情况
    const isChinese = /[\u4e00-\u9fa5]/.test(char);
    if (!isChinese) {
      return '';
    }
    
    // 获取拼音
    const pinyin = getTextPinyin(char, {
      tone: props.withTone,
      spacing: false
    });
    
    // 存入缓存
    pinyinCache.value[char] = pinyin;
    
    return pinyin;
  }
  
  /**
   * 预加载拼音数据
   */
  function preloadPinyinData(text: string) {
    // 获取文本中的唯一字符
    const uniqueChars = Array.from(new Set(text.split('')));
    
    // 批量获取拼音
    const pinyinBatch = getTextPinyin(uniqueChars.join(''), {
      tone: props.withTone,
      spacing: true,
      split: '|'
    });
    
    // 拆分拼音结果并缓存
    const pinyinArray = pinyinBatch.split('|');
    uniqueChars.forEach((char, index) => {
      if (index < pinyinArray.length) {
        pinyinCache.value[char] = pinyinArray[index];
      }
    });
  }
  </script>
  
  <style scoped>
  .pinyin-sheet {
    width: 100%;
  }
  
  .sheet-grid {
    display: grid;
    width: 100%;
  }
  
  .character-cell {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .character-cell.empty {
    visibility: hidden;
  }
  
  .pinyin-area {
    position: absolute;
    top: 5%;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2;
  }
  
  .character-area {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 1;
    position: relative;
  }
  
  .grid-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  
  /* 田字格样式 */
  .grid-background.tian {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23dddddd' stroke-width='1'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%23eeeeee' stroke-width='1' /%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%23eeeeee' stroke-width='1' /%3E%3C/svg%3E");
    background-size: 100% 100%;
  }
  
  /* 米字格样式 */
  .grid-background.mi {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23dddddd' stroke-width='1'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%23eeeeee' stroke-width='1' /%3E%3Cline x1='0' y1='50' x2='100' y2='50' stroke='%23eeeeee' stroke-width='1' /%3E%3Cline x1='0' y1='0' x2='100' y2='100' stroke='%23eeeeee' stroke-width='1' /%3E%3Cline x1='100' y1='0' x2='0' y2='100' stroke='%23eeeeee' stroke-width='1' /%3E%3C/svg%3E");
    background-size: 100% 100%;
  }
  
  /* 回宫格样式 */
  .grid-background.hui {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect x='0' y='0' width='100' height='100' fill='white' stroke='%23dddddd' stroke-width='1'/%3E%3Cline x1='33.3' y1='0' x2='33.3' y2='100' stroke='%23eeeeee' stroke-width='1' /%3E%3Cline x1='66.6' y1='0' x2='66.6' y2='100' stroke='%23eeeeee' stroke-width='1' /%3E%3Cline x1='0' y1='33.3' x2='100' y2='33.3' stroke='%23eeeeee' stroke-width='1' /%3E%3Cline x1='0' y1='66.6' x2='100' y2='66.6' stroke='%23eeeeee' stroke-width='1' /%3E%3C/svg%3E");
    background-size: 100% 100%;
  }
  </style>