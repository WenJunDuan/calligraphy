import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface FontInfo {
  name: string
  family: string
  type: 'system' | 'custom' // 系统内置或用户自定义
  url?: string // 自定义字体的URL
}

export const useFontsStore = defineStore('fonts', () => {
  // 系统预设字体
  const systemFonts: FontInfo[] = [
    { name: '楷体', family: 'KaiTi, STKaiti, serif', type: 'system' },
    { name: '宋体', family: 'SimSun, Songti SC, serif', type: 'system' },
    { name: '黑体', family: 'SimHei, Heiti SC, sans-serif', type: 'system' },
    { name: '隶书', family: 'LiSu, STLiti, serif', type: 'system' },
    { name: '行楷', family: 'Xingkai SC, serif', type: 'system' }
  ]

  // 用户自定义字体
  const customFonts = ref<FontInfo[]>([])

  // 获取所有可用字体
  const allFonts = computed(() => {
    return [...systemFonts, ...customFonts.value]
  })

  // 添加自定义字体
  function addCustomFont(newFont: Omit<FontInfo, 'type'>) {
    // 检查字体是否已存在
    const existingFont = customFonts.value.find(font => font.name === newFont.name)
    if (existingFont) {
      return false
    }
    
    // 添加新字体
    customFonts.value.push({
      ...newFont,
      type: 'custom'
    })
    
    // 如果是文件URL，加载字体
    if (newFont.url) {
      loadCustomFont(newFont.name, newFont.family, newFont.url)
    }
    
    return true
  }

  // 移除自定义字体
  function removeCustomFont(fontName: string) {
    const index = customFonts.value.findIndex(font => font.name === fontName)
    if (index !== -1) {
      customFonts.value.splice(index, 1)
      return true
    }
    return false
  }

  // 动态加载字体
  function loadCustomFont(name: string, family: string, url: string) {
    const fontFace = new FontFace(family, `url(${url})`)
    
    fontFace.load().then((loadedFace) => {
      // 添加到document fonts
      document.fonts.add(loadedFace)
      console.log(`Font ${name} loaded successfully`)
    }).catch((error) => {
      console.error(`Error loading font ${name}:`, error)
    })
  }

  // 从File对象加载字体
  async function addFontFromFile(file: File, fontName: string) {
    try {
      // 创建blob URL
      const url = URL.createObjectURL(file)
      const fileName = file.name
      const fontFamily = `CustomFont-${Date.now()}-${fileName.replace(/\.[^/.]+$/, "")}` // 移除扩展名

      // 添加到自定义字体
      const added = addCustomFont({
        name: fontName || fileName,
        family: fontFamily,
        url: url
      })

      return { success: added, fontFamily, url }
    } catch (error) {
      console.error('Error adding font from file:', error)
      return { success: false, error }
    }
  }

  return {
    systemFonts,
    customFonts,
    allFonts,
    addCustomFont,
    removeCustomFont,
    addFontFromFile
  }
}, {
  // 持久化存储配置
  persist: {
    key: 'z2h-fonts',
    paths: ['customFonts']
  }
})