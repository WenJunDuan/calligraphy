import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FontInfo, OptionItem } from '@/types'
import {
  getSystemFonts,
  loadFontFromFile,
  loadFontFromUrl,
  isFontLoaded,
  getFontLoadingStatus
} from '@/utils/fontLoader'

/**
 * 字体管理存储
 * 管理系统和自定义字体
 */
export const useFontsStore = defineStore(
  'fonts',
  () => {
    // 系统预设字体
    const systemFonts = ref<FontInfo[]>(getSystemFonts())

    // 用户自定义字体
    const customFonts = ref<FontInfo[]>([])

    // 获取所有可用字体
    const allFonts = computed(() => {
      return [...systemFonts.value, ...customFonts.value]
    })

    // 获取字体选项 - 用于下拉选择框
    const fontOptions = computed<OptionItem[]>(() => {
      return allFonts.value.map((font) => ({
        label: font.name,
        value: font.family
      }))
    })

    /**
     * 添加自定义字体
     * @param newFont 新字体信息
     * @returns 是否添加成功
     */
    function addCustomFont(newFont: Omit<FontInfo, 'type'>) {
      // 检查字体是否已存在
      const existingFont = customFonts.value.find((font) => font.name === newFont.name)
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
        loadFontFromUrl(newFont.url, newFont.name, newFont.family)
      }

      return true
    }

    /**
     * 移除自定义字体
     * @param fontName 要移除的字体名称
     * @returns 是否移除成功
     */
    function removeCustomFont(fontName: string) {
      const index = customFonts.value.findIndex((font) => font.name === fontName)
      if (index !== -1) {
        customFonts.value.splice(index, 1)
        return true
      }
      return false
    }

    /**
     * 从File对象加载字体
     * @param file 字体文件
     * @param fontName 字体名称
     * @returns 加载结果
     */
    async function addFontFromFile(file: File, fontName: string) {
      try {
        const result = await loadFontFromFile(file, fontName)

        if (result.success && result.url) {
          // 添加到自定义字体
          addCustomFont({
            name: fontName || file.name.replace(/\.[^/.]+$/, ''),
            family: result.fontFamily,
            url: result.url
          })
        }

        return result
      } catch (error) {
        console.error('Error adding font from file:', error)
        return { success: false, fontFamily: '', error }
      }
    }

    /**
     * 检查字体是否已加载
     * @param fontFamily 字体系列
     * @returns 是否已加载
     */
    function checkFontLoaded(fontFamily: string) {
      return isFontLoaded(fontFamily)
    }

    /**
     * 获取字体加载状态
     * @param fontFamily 字体系列
     * @returns 加载状态
     */
    function getFontStatus(fontFamily: string) {
      return getFontLoadingStatus(fontFamily)
    }

    return {
      systemFonts,
      customFonts,
      allFonts,
      fontOptions,
      addCustomFont,
      removeCustomFont,
      addFontFromFile,
      checkFontLoaded,
      getFontStatus
    }
  },
  {
    // 持久化存储配置
    persist: {
      key: 'z2h-fonts',
      paths: ['customFonts']
    }
  }
)
