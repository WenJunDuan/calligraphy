/**
 * 应用常量定义中心
 */
import { OptionItem, GridType } from '@/types'

// ======== UI选项常量 ========

/**
 * 字体选项
 */
export const FONT_OPTIONS: OptionItem[] = [
  { label: '楷体', value: '楷体, KaiTi, STKaiti, serif' },
  { label: '隶书', value: '隶书, LiSu, STLiti, serif' },
  { label: '汉仪瘦金体', value: '汉仪瘦金体, HanYiShouJin, serif' },
  { label: '加粗瘦金体', value: '加粗瘦金体, ShouJinJiaCu, serif' },
  { label: '田英章楷书', value: '田英章楷书, TianYingzhangKaiShu, serif' }
]

/**
 * 网格类型选项
 */
export const GRID_OPTIONS: OptionItem[] = [
  { label: '田字格', value: 'tian' },
  { label: '米字格', value: 'mi' },
  { label: '回宫格', value: 'hui' },
  { label: '九宫格', value: 'jiu' },
  { label: '方格', value: 'fang' },
  { label: '米田格', value: 'mitian' },
  { label: '四线格', value: 'si' }
]

/**
 * 布局选项
 */
export const LAYOUT_OPTIONS: OptionItem[] = [
  { label: '网格布局', value: 'grid' },
  { label: '竖排布局', value: 'vertical' }
]

/**
 * 颜色选项
 */
export const COLOR_OPTIONS: OptionItem[] = [
  { label: '中灰', value: 'gray' },
  { label: '红色', value: 'red' },
  { label: '蓝色', value: 'blue' }
]

/**
 * 默认网格样式
 */
export const DEFAULT_GRID_STYLE = {
  size: 64,
  borderColor: '#aaaaaa',
  borderWidth: 1.5,
  guideColor: '#cccccc',
  guideWidth: 1,
  backgroundColor: 'white'
}

// ======== 内容常量 ========

/**
 * 常用汉字
 */
export const COMMON_CHARACTERS =
  '的一是在了不和有大这中人上为个所我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部'

// ======== 布局常量 ========

/**
 * 默认A4大小（以像素为单位，96 DPI）
 */
export const A4_DIMENSIONS = {
  WIDTH_PX: 795,
  HEIGHT_PX: 1133
}

/**
 * 控笔练习图案
 */
export const PRACTICE_PATTERNS = {
  basic: [
    {
      id: 'horizontal-line',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
      id: 'vertical-line',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
      id: 'cross',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
      id: 'diagonal-line',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
      id: 'diagonal-line-reverse',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="2" y2="22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    },
    {
      id: 'double-horizontal',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><line x1="2" y1="8" x2="22" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="2" y1="16" x2="22" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
    }
  ],
  curves: [
    {
      id: 'wave',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2,12 C5,7 8,17 12,12 C16,7 19,17 22,12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'zigzag',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polyline points="2,12 7,7 12,17 17,7 22,12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    {
      id: 'curve',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2,17 C7,7 17,7 22,17" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'snake',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2,12 Q7,6 12,12 T22,12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'double-curve',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2,17 C7,7 17,7 22,17" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M2,7 C7,17 17,17 22,7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'triple-wave',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2,8 C4,5 6,11 8,8 C10,5 12,11 14,8 C16,5 18,11 20,8 C22,5 24,11 26,8" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M2,12 C4,9 6,15 8,12 C10,9 12,15 14,12 C16,9 18,15 20,12 C22,9 24,15 26,12" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M2,16 C4,13 6,19 8,16 C10,13 12,19 14,16 C16,13 18,19 20,16 C22,13 24,19 26,16" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>'
    }
  ],
  complex: [
    {
      id: 'spiral',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,12 C12,9 15,9 15,12 C15,15 9,15 9,12 C9,7 15,7 15,12 C15,17 7,17 7,12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'circle',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'square',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'triangle',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,4 4,20 20,20" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>'
    }
  ],
  advanced: [
    {
      id: 'double-spiral',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M7,12 C7,10 9,8 12,8 C15,8 17,10 17,12 C17,14 15,16 12,16 C9,16 7,14 7,12 Z" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="1,1"/><path d="M5,12 C5,9 8,6 12,6 C16,6 19,9 19,12 C19,15 16,18 12,18 C8,18 5,15 5,12 Z" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'figure-eight',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,8 C9,4 4,7 6,10 C8,13 16,13 18,10 C20,7 15,4 12,8 C12,8 12,16 12,16 C15,20 20,17 18,14 C16,11 8,11 6,14 C4,17 9,20 12,16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'star',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>'
    },
    {
      id: 'flower',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1" fill="none"/><circle cx="12" cy="6" r="3" stroke="currentColor" stroke-width="1" fill="none"/><circle cx="18" cy="12" r="3" stroke="currentColor" stroke-width="1" fill="none"/><circle cx="12" cy="18" r="3" stroke="currentColor" stroke-width="1" fill="none"/><circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="1" fill="none"/></svg>'
    }
  ],
  calligraphy: [
    {
      id: 'hook',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5,5 C8,5 15,5 15,5 C15,5 19,5 19,9 C19,12 17,18 12,19" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'dot',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10,12 C12,10 14,12 12,14 C10,16 8,14 10,12 Z" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'horizontal-stroke',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4,12 C6,11 10,11 12,12 C14,13 18,13 20,12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'vertical-stroke',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,4 C11,6 11,10 12,12 C13,14 13,18 12,20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    }
  ],
  geometric: [
    {
      id: 'hexagon',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,3 21,8 21,16 12,21 3,16 3,8" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>'
    },
    {
      id: 'pentagon',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,3 21,10 17,20 7,20 3,10" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>'
    },
    {
      id: 'diamond',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,3 21,12 12,21 3,12" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>'
    },
    {
      id: 'octagon',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="8,3 16,3 21,8 21,16 16,21 8,21 3,16 3,8" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>'
    }
  ],
  handwriting: [
    {
      id: 'cursive-a',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,16 C9,16 6,14 6,11 C6,8 9,6 12,7 C15,8 15,14 15,16 C15,18 15,20 18,20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'cursive-e',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18,10 C16,7 10,7 8,10 C6,13 8,16 12,16 C16,16 18,13 18,10 Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'number-8',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,7 C10,7 8,8 8,10 C8,12 10,13 12,13 C14,13 16,14 16,16 C16,18 14,19 12,19 C10,19 8,18 8,16 C8,14 10,13 12,13 C14,13 16,12 16,10 C16,8 14,7 12,7 Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    },
    {
      id: 'ampersand',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14,18 C10,14 6,10 6,8 C6,6 8,5 10,6 C12,7 14,10 13,12 C12,14 8,16 10,18 C12,20 18,14 18,14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>'
    }
  ]
};

// ======== 默认配置 ========

/**
 * 默认应用设置
 */
export const DEFAULT_APP_SETTINGS = {
  colorMode: 'light',
  showWelcomeGuide: true,
  printSettings: {
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
  }
}

/**
 * 默认字帖设置
 */
export const DEFAULT_SHEET_SETTINGS = {
  gridType: 'tian',
  fontFamily: '楷体, KaiTi, STKaiti, serif',
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
  pinyinColor: '#666666',
  repeatCount: 1,
  practiceMode: 'standard',
  layoutType: 'grid',
  isSingleCharMode: true,
  charsPerRow: 10
}

// ======== 导出便捷方法 ========

/**
 * 获取网格类型选项
 */
export function getGridTypeOptions(): OptionItem[] {
  return GRID_OPTIONS
}

/**
 * 获取字体选项
 */
export function getFontOptions(): OptionItem[] {
  return FONT_OPTIONS
}

/**
 * 获取布局选项
 */
export function getLayoutOptions(): OptionItem[] {
  return LAYOUT_OPTIONS
}

/**
 * 获取颜色选项
 */
export function getColorOptions(): OptionItem[] {
  return COLOR_OPTIONS
}

// 导出所有常量
export default {
  FONT_OPTIONS,
  GRID_OPTIONS,
  LAYOUT_OPTIONS,
  COLOR_OPTIONS,
  DEFAULT_GRID_STYLE,
  COMMON_CHARACTERS,
  A4_DIMENSIONS,
  PRACTICE_PATTERNS,
  DEFAULT_APP_SETTINGS,
  DEFAULT_SHEET_SETTINGS,
  getGridTypeOptions,
  getFontOptions,
  getLayoutOptions,
  getColorOptions
}
