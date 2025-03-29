import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

interface SheetSettings {
  gridType: string
  fontFamily: string
  gridSize: number
  fontSize: number
  fontColor: string
  guideColor: string
  guideOpacity: number
  verticalOffset: number
  showReference: boolean
  showGuides: boolean
  showPinyin: boolean
  withTone: boolean
  pinyinFontSize: number
  pinyinColor: string
}

export const useSheetStore = defineStore('sheet', () => {
  // 设置状态
  const settings = reactive<SheetSettings>({
    gridType: 'tian', // tian-田字格, mi-米字格, hui-回宫格
    fontFamily: '楷体',
    gridSize: 64,
    fontSize: 80,
    fontColor: 'black',
    guideColor: 'lightgray',
    guideOpacity: 10,
    verticalOffset: 0,
    showReference: true,
    showGuides: true,
    showPinyin: true,
    withTone: true,
    pinyinFontSize: 40,
    pinyinColor: '#666666'
  })

  // 当前输入的文字
  const inputText = ref('')

  // 最近使用的文字历史
  const recentTexts = ref<string[]>([])

  // 更新设置
  function updateSettings(newSettings: Partial<SheetSettings>) {
    Object.assign(settings, newSettings)
  }

  // 设置输入文字
  function setInputText(text: string) {
    inputText.value = text
    
    // 添加到最近使用的历史，并保持最大长度为10
    if (text && !recentTexts.value.includes(text)) {
      recentTexts.value.unshift(text)
      if (recentTexts.value.length > 10) {
        recentTexts.value = recentTexts.value.slice(0, 10)
      }
    }
  }

  // 重置设置为默认值
  function resetSettings() {
    Object.assign(settings, {
      gridType: 'tian',
      fontFamily: '楷体',
      gridSize: 64,
      fontSize: 80,
      fontColor: 'black',
      guideColor: 'lightgray',
      guideOpacity: 10,
      verticalOffset: 0,
      showReference: true,
      showGuides: true,
      showPinyin: true,
      withTone: true,
      pinyinFontSize: 40,
      pinyinColor: '#666666'
    })
  }

  return {
    settings,
    inputText,
    recentTexts,
    updateSettings,
    setInputText,
    resetSettings
  }
}, {
  // 持久化存储配置
  persist: {
    key: 'z2h-sheet-settings',
    paths: ['settings', 'recentTexts']
  }
})