/**
 * 应用常量定义中心
 */
import { OptionItem, GridType } from '@/types';

// ======== UI选项常量 ========

/**
 * 字体选项
 */
export const FONT_OPTIONS: OptionItem[] = [
  { label: '楷体', value: '楷体, KaiTi, STKaiti, serif' },
  { label: '行书', value: '行书, Xingkai SC, serif' },
  { label: '隶书', value: '隶书, LiSu, STLiti, serif' },
  { label: '瘦金体', value: '瘦金体, Shoujin Ti, serif' },
  { label: '田英章楷书', value: '田英章楷书, Tian Yingzhang KaiShu, serif' },
  { label: '吴玉生行书', value: '吴玉生行书, Wu Yushuang Xingshu, serif' }
];

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
];

/**
 * 布局选项
 */
export const LAYOUT_OPTIONS: OptionItem[] = [
  { label: '网格布局', value: 'grid' },
  { label: '竖排布局', value: 'vertical' }
];

/**
 * 颜色选项
 */
export const COLOR_OPTIONS: OptionItem[] = [
  { label: '中灰', value: 'gray' },
  { label: '红色', value: 'red' },
  { label: '蓝色', value: 'blue' }
];

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
};

// ======== 内容常量 ========

/**
 * 常用汉字
 */
export const COMMON_CHARACTERS = '的一是在了不和有大这中人上为个所我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部';

// ======== 布局常量 ========

/**
 * 默认A4大小（以像素为单位，96 DPI）
 */
export const A4_DIMENSIONS = {
  WIDTH_PX: 795,
  HEIGHT_PX: 1133
};

/**
 * 控笔练习图案
 */
export const PRACTICE_PATTERNS = {
  basic: [
    {
      id: 'horizontal-line',
      svg: '<svg viewBox="0 0 24 24"><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/></svg>'
    },
    {
      id: 'vertical-line',
      svg: '<svg viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="2"/></svg>'
    },
    {
      id: 'cross',
      svg: '<svg viewBox="0 0 24 24"><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" stroke-width="2"/></svg>'
    },
    {
      id: 'diagonal-line',
      svg: '<svg viewBox="0 0 24 24"><line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2"/></svg>'
    }
  ],
  curves: [
    {
      id: 'wave',
      svg: '<svg viewBox="0 0 24 24"><path d="M2,12 C5,7 8,17 12,12 C16,7 19,17 22,12" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'zigzag',
      svg: '<svg viewBox="0 0 24 24"><polyline points="2,12 7,7 12,17 17,7 22,12" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'curve',
      svg: '<svg viewBox="0 0 24 24"><path d="M2,17 C7,7 17,7 22,17" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'snake',
      svg: '<svg viewBox="0 0 24 24"><path d="M2,12 Q7,6 12,12 T22,12" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    }
  ],
  complex: [
    {
      id: 'spiral',
      svg: '<svg viewBox="0 0 24 24"><path d="M12,12 C12,9 15,9 15,12 C15,15 9,15 9,12 C9,7 15,7 15,12 C15,17 7,17 7,12" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'circle',
      svg: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'square',
      svg: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
    },
    {
      id: 'triangle',
      svg: '<svg viewBox="0 0 24 24"><polygon points="12,4 4,20 20,20" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
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
};

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
};

// ======== 导出便捷方法 ========

/**
 * 获取网格类型选项
 */
export function getGridTypeOptions(): OptionItem[] {
  return GRID_OPTIONS;
}

/**
 * 获取字体选项
 */
export function getFontOptions(): OptionItem[] {
  return FONT_OPTIONS;
}

/**
 * 获取布局选项
 */
export function getLayoutOptions(): OptionItem[] {
  return LAYOUT_OPTIONS;
}

/**
 * 获取颜色选项
 */
export function getColorOptions(): OptionItem[] {
  return COLOR_OPTIONS;
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
};