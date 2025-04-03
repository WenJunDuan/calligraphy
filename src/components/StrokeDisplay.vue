<template>
    <div 
      class="stroke-display"
      :style="containerStyle"
    >
      <div 
        class="stroke-canvas" 
        ref="canvasRef"
        :style="canvasStyle"
      ></div>
      
      <div v-if="showStrokeInfo && strokeData" class="stroke-info">
        <span class="stroke-count">{{ strokeData.strokeCount }}画</span>
        <span class="stroke-order">{{ strokeData.strokeNames.join('·') }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { CncharService, StrokeData } from '@/services/cncharService'
  
  const props = defineProps({
    character: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    },
    strokeColor: {
      type: String,
      default: '#333333'
    },
    backgroundColor: {
      type: String,
      default: 'transparent'
    },
    animation: {
      type: Boolean,
      default: false
    },
    showStrokeInfo: {
      type: Boolean,
      default: true
    }
  })
  
  const emit = defineEmits(['load-complete'])
  
  // DOM引用
  const canvasRef = ref<HTMLElement | null>(null)
  
  // 状态
  const strokeData = ref<StrokeData | null>(null)
  const loaded = ref(false)
  
  // 样式计算
  const containerStyle = computed(() => ({
    width: `${props.width}px`,
    height: props.showStrokeInfo ? 'auto' : `${props.height}px`
  }))
  
  const canvasStyle = computed(() => ({
    width: `${props.width}px`,
    height: `${props.height}px`
  }))
  
  // 监听字符变化
  watch(() => props.character, (newChar) => {
    if (newChar) {
      loadStrokeData(newChar)
      renderStroke()
    }
  })
  
  // 加载笔画数据
  function loadStrokeData(character: string) {
    if (!character) return
    
    // 获取笔画数据
    strokeData.value = CncharService.getStrokeData(character.charAt(0))
  }
  
  // 渲染笔画
  function renderStroke() {
    if (!canvasRef.value || !props.character) return
    
    try {
      // 绘制笔顺
      CncharService.drawStroke(props.character.charAt(0), canvasRef.value, {
        clear: true,
        animation: props.animation,
        strokeColor: props.strokeColor,
        backgroundColor: props.backgroundColor
      })
      
      // 标记加载完成
      loaded.value = true
      emit('load-complete')
    } catch (error) {
      console.error('渲染笔画出错:', error)
    }
  }
  
  // 初始化
  onMounted(() => {
    if (props.character) {
      loadStrokeData(props.character)
      renderStroke()
    }
  })
  </script>
  
  <style scoped>
  .stroke-display {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stroke-canvas {
    background-color: v-bind('props.backgroundColor');
    border-radius: 4px;
  }
  
  .stroke-info {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
    text-align: center;
    width: 100%;
  }
  
  .stroke-count {
    margin-right: 8px;
    font-weight: 500;
  }
  
  .stroke-order {
    color: #888;
  }
  </style>