/**
 * 字帖相关类型定义
 */

/**
 * 网格类型
 */
export type GridType = 'tian' | 'mi' | 'hui'

/**
 * 网格样式配置
 */
export interface GridStyleConfig {
  size: number
  borderColor: string
  borderWidth: number
  guideColor: string
  guideWidth: number
  backgroundColor: string
}

/**
 * 笔画数据
 */
export interface StrokeData {
  character: string
  strokeCount: number
  strokeOrder: number[]
  strokeNames: string[]
  medians?: number[][][] // 笔画路径点
}

/**
 * 拼音数据
 */
export interface PinyinData {
  character: string
  pinyin: string
  pinyinWithTone: string
  pinyinWithoutTone: string
  isPolyphone: boolean
  allPinyins?: string[]
}

/**
 * 字帖设置
 */
export interface SheetSettings {
  gridType: GridType
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

/**
 * 打印设置
 */
export interface PrintSettings {
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

/**
 * 字体信息
 */
export interface FontInfo {
  name: string
  family: string
  type: 'system' | 'custom'
  url?: string
}