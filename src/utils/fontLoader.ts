/**
 * 字体加载工具 - 提供字体加载和管理功能
 */
import { FONT_OPTIONS } from '@/constants'
import { FontInfo, CustomFont } from '@/types'

// 字体加载状态跟踪
const FONT_LOADING_STATUS = new Map<string, boolean>()

// 系统字体映射 - 将字体名称与字体文件对应
const FONT_FILE_MAPPING: Record<string, string> = {
  HanYiShouJin: '/src/assets/fonts/HanYiShouJin.ttf',
  ShouJinJiaCu: '/src/assets/fonts/ShouJinJiaCu.ttf',
  TianYingzhangKaiShu: '/src/assets/fonts/TianYingzhangKaiShu.ttf'
}

/**
 * 预加载系统内置字体
 * 自动检测FONT_OPTIONS中的字体，并尝试从字体映射中加载
 */
export async function preloadSystemFonts(): Promise<void> {
  // 处理FONT_OPTIONS中的每个字体
  for (const option of FONT_OPTIONS) {
    const fontFamilies = option.value.split(',').map((f) => f.trim())

    // 检查每个字体族是否需要加载
    for (const family of fontFamilies) {
      // 查找对应的字体文件
      for (const [fontKey, fontPath] of Object.entries(FONT_FILE_MAPPING)) {
        if (family.includes(fontKey)) {
          await loadFontFromUrl(fontPath, option.label, family)
          break
        }
      }
    }
  }
}

/**
 * 加载自定义字体
 * @param font 字体信息
 * @returns 加载状态的Promise
 */
export async function loadCustomFont(font: CustomFont): Promise<FontFace> {
  try {
    // 检查是否已加载
    if (FONT_LOADING_STATUS.get(font.family)) {
      return Promise.resolve(new FontFace(font.family, `url(${font.url})`))
    }

    // 创建FontFace实例
    const fontFace = new FontFace(font.family, `url(${font.url})`, {
      style: 'normal',
      weight: 'normal',
      display: 'swap'
    })

    // 加载字体
    const loadedFont = await fontFace.load()

    // 添加到document.fonts
    document.fonts.add(loadedFont)

    // 标记为已加载
    FONT_LOADING_STATUS.set(font.family, true)

    console.log(`Font '${font.name}' loaded successfully`)

    // 添加字体定义的样式
    addFontFaceStyle(font)

    return loadedFont
  } catch (error) {
    console.error(`Error loading font '${font.name}':`, error)
    throw error
  }
}

/**
 * 从File对象加载字体
 * @param file 字体文件
 * @param fontName 自定义字体名称
 * @returns 加载结果
 */
export async function loadFontFromFile(
  file: File,
  fontName?: string
): Promise<{ success: boolean; fontFamily: string; url?: string; error?: any }> {
  try {
    // 检查文件类型
    const validExtensions = ['.ttf', '.otf', '.woff', '.woff2']
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

    if (!validExtensions.includes(fileExtension)) {
      return {
        success: false,
        fontFamily: '',
        error: new Error(
          `不支持的字体文件格式: ${fileExtension}。请使用 TTF, OTF, WOFF 或 WOFF2 格式。`
        )
      }
    }

    // 创建blob URL
    const url = URL.createObjectURL(file)
    const fileName = file.name
    let customFontName = fontName || fileName.replace(/\.[^/.]+$/, '')
    const fontFamily = `CustomFont-${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`

    // 加载字体
    const font: CustomFont = {
      name: customFontName,
      family: fontFamily,
      url: url,
      type: fileExtension.replace('.', '') as string
    }

    await loadCustomFont(font)

    return {
      success: true,
      fontFamily: font.family,
      url: url
    }
  } catch (error) {
    console.error('Error loading font from file:', error)
    return {
      success: false,
      fontFamily: '',
      error
    }
  }
}

/**
 * 从URL加载字体文件
 * @param url 字体文件URL
 * @param fontName 字体名称
 * @param fontFamily 字体系列
 * @returns 加载结果Promise
 */
export async function loadFontFromUrl(
  url: string,
  fontName: string,
  fontFamily?: string
): Promise<{ success: boolean; fontFamily: string; error?: any }> {
  try {
    // 如果已加载，直接返回成功
    if (FONT_LOADING_STATUS.get(fontFamily || fontName)) {
      return { success: true, fontFamily: fontFamily || fontName }
    }

    // 如果没有提供fontFamily，创建一个唯一的标识符
    const family = fontFamily || `Font-${Date.now()}-${fontName.replace(/\s+/g, '-')}`

    // 从URL确定字体格式
    const fileExtension = url.substring(url.lastIndexOf('.')).toLowerCase()
    const fontType = fileExtension.replace('.', '')

    // 加载字体
    const font: CustomFont = {
      name: fontName,
      family,
      url,
      type: fontType
    }

    await loadCustomFont(font)
    FONT_LOADING_STATUS.set(family, true)

    return {
      success: true,
      fontFamily: family
    }
  } catch (error) {
    console.error('Error loading font from URL:', error)
    return {
      success: false,
      fontFamily: '',
      error
    }
  }
}

/**
 * 检测字体是否已加载
 * @param fontFamily 字体系列名称
 * @returns 是否已加载
 */
export function isFontLoaded(fontFamily: string): boolean {
  // 先检查内部状态
  if (FONT_LOADING_STATUS.get(fontFamily)) {
    return true
  }

  // 如果内部状态不确定，尝试使用document.fonts.check
  return document.fonts.check(`12px ${fontFamily}`)
}

/**
 * 创建样式标签并添加到文档头部
 * @param styles CSS样式内容
 * @param id 样式标签ID (可选)
 * @returns 创建的style元素
 */
export function createStyleElement(styles: string, id?: string): HTMLStyleElement {
  // 检查是否已存在同ID的style元素
  if (id) {
    const existingStyle = document.getElementById(id) as HTMLStyleElement
    if (existingStyle) {
      existingStyle.textContent = styles
      return existingStyle
    }
  }

  // 创建新的style元素
  const style = document.createElement('style')
  style.textContent = styles

  if (id) {
    style.id = id
  }

  // 添加到文档头部
  document.head.appendChild(style)

  return style
}

/**
 * 创建并添加字体定义的样式
 * @param font 字体信息
 * @returns 创建的style元素
 */
export function addFontFaceStyle(font: CustomFont): HTMLStyleElement {
  const fontFaceCSS = `
    @font-face {
      font-family: '${font.family}';
      src: url('${font.url}') format('${font.type || 'truetype'}');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `

  const id = `font-face-${font.family}`
  return createStyleElement(fontFaceCSS, id)
}

/**
 * 获取所有系统预设字体
 * @returns 系统字体信息列表
 */
export function getSystemFonts(): FontInfo[] {
  return FONT_OPTIONS.map((option) => ({
    name: option.label,
    family: option.value,
    type: 'system' as const
  }))
}

/**
 * 获取字体加载状态
 * @param fontFamily 字体族名称
 * @returns 是否已加载
 */
export function getFontLoadingStatus(fontFamily: string): boolean {
  return FONT_LOADING_STATUS.get(fontFamily) || false
}

/**
 * 自动初始化 - 预加载字体
 */
export function initializeFonts(): void {
  // 在延迟后预加载所有系统字体
  setTimeout(() => {
    preloadSystemFonts()
      .then(() => {
        console.log('System fonts preloaded successfully')
      })
      .catch((error) => {
        console.error('Error preloading system fonts:', error)
      })
  }, 500)
}

// 自动初始化
initializeFonts()
