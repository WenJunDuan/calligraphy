import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useColorMode } from '@vueuse/core'

// 页面打印设置
interface PrintSettings {
  paperSize: 'a4' | 'a5' | 'letter' | 'custom'
  orientation: 'portrait' | 'landscape'
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
  headerFooter: boolean
  scale: number
}

export const useSettingsStore = defineStore('settings', () => {
  // 主题模式
  const colorMode = useColorMode({
    selector: 'html',
    attribute: 'data-theme',
    storageKey: 'z2h-color-scheme',
    modes: {
      light: 'light',
      dark: 'dark',
      auto: 'auto'
    }
  })

  // 打印设置
  const printSettings = reactive<PrintSettings>({
    paperSize: 'a4',
    orientation: 'portrait',
    margins: {
      top: 5,
      right: 10,
      bottom: 12,
      left: 10
    },
    headerFooter: false,
    scale: 100
  })

  // 是否显示欢迎指引
  const showWelcomeGuide = ref(true)

  // 更新打印设置
  function updatePrintSettings(newSettings: Partial<PrintSettings>) {
    Object.assign(printSettings, newSettings)
  }
  
  // 设置是否显示欢迎指引
  function setShowWelcomeGuide(show: boolean) {
    showWelcomeGuide.value = show
  }

  return {
    colorMode,
    printSettings,
    showWelcomeGuide,
    updatePrintSettings,
    setShowWelcomeGuide
  }
}, {
  // 持久化存储配置
  persist: {
    key: 'z2h-app-settings',
    paths: ['printSettings', 'showWelcomeGuide']
  }
})