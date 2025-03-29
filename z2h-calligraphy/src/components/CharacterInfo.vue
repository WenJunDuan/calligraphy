<template>
    <div class="character-info">
      <div class="character-header">
        <div class="character-display" :style="{ fontFamily }">
          {{ character }}
        </div>
        <div class="pinyin" v-if="pinyinData">
          {{ pinyinData.pinyinWithTone }}
        </div>
      </div>
      
      <n-divider />
      
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">笔画数</div>
          <div class="info-value">{{ strokeData?.strokeCount || '未知' }}</div>
        </div>
        
        <div v-if="pinyinData?.isPolyphone" class="info-item">
          <div class="info-label">多音字</div>
          <div class="info-value accent">
            {{ pinyinData.allPinyins?.join('、') || '' }}
          </div>
        </div>
      </div>
      
      <template v-if="strokeData">
        <n-divider />
        
        <div class="stroke-section">
          <div class="section-title">笔顺</div>
          <div class="stroke-names">
            <div 
              v-for="(name, index) in strokeData.strokeNames" 
              :key="`stroke-${index}`"
              class="stroke-name-tag"
            >
              <span class="stroke-number">{{ index + 1 }}</span>
              <span class="stroke-name">{{ name }}</span>
            </div>
          </div>
        </div>
      </template>
      
      <n-divider />
      
      <div class="stroke-animation-section">
        <div class="section-title">笔顺动画</div>
        <div class="stroke-animation">
          <StrokeDisplay 
            :character="character"
            :width="150"
            :height="150"
            :animation="true"
            :show-stroke-info="false"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { NDivider } from 'naive-ui'
  import { CncharService, StrokeData } from '@/services/cncharService'
  import { PinyinService, PinyinData } from '@/services/pinyinService'
  import StrokeDisplay from '@/components/StrokeDisplay.vue'
  
  const props = defineProps({
    character: {
      type: String,
      required: true,
      validator: (value: string) => value.length === 1 // 只接受单个字符
    },
    fontFamily: {
      type: String,
      default: '楷体'
    }
  })
  
  // 笔画和拼音数据
  const strokeData = ref<StrokeData | null>(null)
  const pinyinData = ref<PinyinData | null>(null)
  
  // 加载数据
  function loadData(char: string) {
    if (!char) return
    
    // 加载笔画数据
    strokeData.value = CncharService.getStrokeData(char)
    
    // 加载拼音数据
    pinyinData.value = PinyinService.getPinyinData(char)
  }
  
  // 监听字符变化
  watch(() => props.character, (newChar) => {
    if (newChar) {
      loadData(newChar)
    }
  })
  
  // 初始化
  onMounted(() => {
    if (props.character) {
      loadData(props.character)
    }
  })
  </script>
  
  <style scoped>
  .character-info {
    background-color: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    width: 100%;
  }
  
  .character-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .character-display {
    font-size: 64px;
    line-height: 1.2;
    color: #333;
  }
  
  .pinyin {
    font-size: 18px;
    color: #666;
    margin-top: 8px;
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 16px;
  }
  
  .info-item {
    text-align: center;
  }
  
  .info-label {
    font-size: 14px;
    color: #999;
    margin-bottom: 4px;
  }
  
  .info-value {
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
  
  .info-value.accent {
    color: #f56c6c;
  }
  
  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #666;
    margin-bottom: 12px;
  }
  
  .stroke-names {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
  }
  
  .stroke-name-tag {
    background-color: #f5f7fa;
    border-radius: 4px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .stroke-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: #4361ee;
    color: white;
    border-radius: 50%;
    font-size: 12px;
  }
  
  .stroke-name {
    font-size: 14px;
    color: #666;
  }
  
  .stroke-animation-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .stroke-animation {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  </style>