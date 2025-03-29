<template>
    <div 
      class="pinyin-display"
      :style="containerStyle"
    >
      <span 
        v-for="(item, index) in pinyinItems" 
        :key="`pinyin-${index}`"
        class="pinyin-item"
        :style="itemStyle"
      >
        {{ item }}
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { PinyinService } from '@/services/pinyinService'
  
  const props = defineProps({
    text: {
      type: String,
      required: true
    },
    withTone: {
      type: Boolean,
      default: true
    },
    fontSize: {
      type: Number,
      default: 14
    },
    color: {
      type: String,
      default: '#666666'
    },
    align: {
      type: String,
      default: 'center',
      validator: (value: string) => ['left', 'center', 'right'].includes(value)
    },
    useSmartSegment: {
      type: Boolean,
      default: true
    }
  })
  
  // 计算拼音数据
  const pinyinItems = computed(() => {
    if (!props.text) return []
    
    if (props.useSmartSegment) {
      // 使用智能分词拼音
      return PinyinService.getSmartPinyin(props.text, {
        toneType: props.withTone ? 'symbol' : 'none'
      })
    } else {
      // 逐字获取拼音
      return Array.from(props.text).map(char => {
        const data = PinyinService.getPinyinData(char)
        if (!data) return ''
        return props.withTone ? data.pinyinWithTone : data.pinyinWithoutTone
      })
    }
  })
  
  // 样式计算
  const containerStyle = computed(() => ({
    display: 'flex',
    justifyContent: props.align === 'center' ? 'center' : 
                   props.align === 'right' ? 'flex-end' : 'flex-start',
    flexWrap: 'wrap'
  }))
  
  const itemStyle = computed(() => ({
    fontSize: `${props.fontSize}px`,
    color: props.color,
    padding: '0 2px',
    textAlign: props.align,
    lineHeight: '1.2'
  }))
  
  // 挂载时尝试预加载拼音
  onMounted(() => {
    if (props.text) {
      PinyinService.preloadCommonCharacters(props.text)
    }
  })
  </script>
  
  <style scoped>
  .pinyin-display {
    width: 100%;
    overflow-wrap: break-word;
  }
  
  .pinyin-item {
    display: inline-block;
  }
  </style>