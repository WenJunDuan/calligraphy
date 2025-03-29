<template>
    <div class="stroke-animation">
      <div class="animation-container">
        <div 
          class="canvas-container" 
          ref="canvasRef"
          :style="{
            width: `${size}px`,
            height: `${size}px`
          }"
        ></div>
        
        <div class="controls" v-if="showControls">
          <n-button-group>
            <n-button @click="playAnimation" :disabled="isPlaying">
              <template #icon>
                <n-icon><PlayCircleOutline /></n-icon>
              </template>
              播放
            </n-button>
            <n-button @click="stopAnimation" :disabled="!isPlaying">
              <template #icon>
                <n-icon><StopCircleOutline /></n-icon>
              </template>
              停止
            </n-button>
            <n-button @click="resetAnimation">
              <template #icon>
                <n-icon><RefreshOutline /></n-icon>
              </template>
              重置
            </n-button>
          </n-button-group>
        </div>
      </div>
      
      <div class="stroke-info" v-if="showStrokeInfo && strokeData">
        <div class="stroke-count">
          <span class="label">笔画数：</span>
          <span class="value">{{ strokeData.strokeCount }}</span>
        </div>
        
        <div class="stroke-names">
          <span class="label">笔顺：</span>
          <span class="value">{{ strokeData.strokeNames.join(' → ') }}</span>
        </div>
      </div>
      
      <div class="pinyin-info" v-if="showPinyin && pinyinData">
        <div class="pinyin">
          <span class="label">拼音：</span>
          <span class="value">{{ pinyinData.pinyinWithTone }}</span>
        </div>
        
        <div class="polyphone" v-if="pinyinData.isPolyphone">
          <span class="label">多音：</span>
          <span class="value">{{ pinyinData.allPinyins?.join('、') }}</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted, watch } from 'vue'
  import { NButton, NButtonGroup, NIcon } from 'naive-ui'
  import { PlayCircleOutline, StopCircleOutline, RefreshOutline } from '@vicons/ionicons5'
  import { getStrokeData, getPinyinData, drawCharacterStrokes, StrokeData, PinyinData } from '@/utils/strokeGenCnchar'
  
  const props = defineProps({
    character: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 200
    },
    strokeColor: {
      type: String,
      default: '#333333'
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    showControls: {
      type: Boolean,
      default: true
    },
    showStrokeInfo: {
      type: Boolean,
      default: true
    },
    showPinyin: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: false
    }
  })
  
  const emit = defineEmits(['animation-complete', 'animation-start'])
  
  // DOM引用
  const canvasRef = ref<HTMLElement | null>(null)
  
  // 动画状态
  const isPlaying = ref(false)
  const strokeData = ref<StrokeData | null>(null)
  const pinyinData = ref<PinyinData | null>(null)
  
  // 初始化
  onMounted(() => {
    if (props.character) {
      loadCharacterData(props.character)
      initializeCanvas()
      
      if (props.autoPlay) {
        setTimeout(() => {
          playAnimation()
        }, 500) // 稍微延迟，让界面完全渲染
      }
    }
  })
  
  // 清理
  onUnmounted(() => {
    stopAnimation()
  })
  
  // 监听字符变化
  watch(() => props.character, (newChar) => {
    if (newChar) {
      loadCharacterData(newChar)
      initializeCanvas()
      
      if (props.autoPlay) {
        setTimeout(() => {
          playAnimation()
        }, 500)
      }
    }
  })
  
  // 加载字符数据
  function loadCharacterData(char: string) {
    // 获取笔画数据
    strokeData.value = getStrokeData(char)
    
    // 获取拼音数据
    pinyinData.value = getPinyinData(char)
  }
  
  // 初始化画布
  function initializeCanvas() {
    if (!canvasRef.value || !props.character) return
    
    // 清除现有内容
    while (canvasRef.value.firstChild) {
      canvasRef.value.removeChild(canvasRef.value.firstChild)
    }
    
    // 创建画布容器
    const canvasElement = document.createElement('div')
    canvasElement.style.width = '100%'
    canvasElement.style.height = '100%'
    canvasRef.value.appendChild(canvasElement)
  }
  
  // 播放动画
  function playAnimation() {
    if (!canvasRef.value || !props.character || isPlaying.value) return
    
    isPlaying.value = true
    emit('animation-start')
    
    // 获取画布容器
    const canvasElement = canvasRef.value.firstChild as HTMLElement
    
    // 使用cnchar绘制笔顺动画
    drawCharacterStrokes(props.character, canvasElement, {
      clear: true,
      animation: true,
      strokeColor: props.strokeColor,
      backgroundColor: props.backgroundColor,
      onComplete: () => {
        isPlaying.value = false
        emit('animation-complete')
      }
    })
  }
  
  // 停止动画
  function stopAnimation() {
    if (!isPlaying.value) return
    
    // 目前cnchar没有提供直接停止动画的API
    // 但可以通过重置画布实现类似效果
    resetAnimation()
    isPlaying.value = false
  }
  
  // 重置动画
  function resetAnimation() {
    if (!canvasRef.value || !props.character) return
    
    isPlaying.value = false
    
    // 重新初始化画布
    initializeCanvas()
    
    // 绘制静态字形（无动画）
    const canvasElement = canvasRef.value.firstChild as HTMLElement
    
    drawCharacterStrokes(props.character, canvasElement, {
      clear: true,
      animation: false,
      strokeColor: props.strokeColor,
      backgroundColor: props.backgroundColor
    })
  }
  </script>
  
  <style scoped>
  .stroke-animation {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  
  .animation-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .canvas-container {
    border: 1px solid #eee;
    border-radius: 4px;
    background-color: white;
    overflow: hidden;
  }
  
  .controls {
    margin-top: 4px;
  }
  
  .stroke-info,
  .pinyin-info {
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #666;
  }
  
  .stroke-count,
  .stroke-names,
  .pinyin,
  .polyphone {
    margin: 4px 0;
  }
  
  .label {
    font-weight: 500;
    margin-right: 4px;
  }
  
  .value {
    color: #333;
  }
  
  .polyphone .value {
    color: #f56c6c;
  }
  </style>