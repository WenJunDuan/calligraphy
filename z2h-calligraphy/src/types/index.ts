/**
 * 应用类型定义中心
 */

// ======== 通用类型 ========
/**
 * 通用选项类型
 */
export interface OptionItem {
    label: string;
    value: string;
  }
  
  // ======== 网格相关类型 ========
  /**
   * 网格类型
   */
  export type GridType = 'tian' | 'mi' | 'hui' | 'jiu' | 'fang' | 'mitian' | 'si';
  
  /**
   * 布局类型
   */
  export type LayoutType = 'grid' | 'vertical' | 'horizontal';
  
  /**
   * 网格样式配置
   */
  export interface GridStyleConfig {
    size: number;
    borderColor: string;
    borderWidth: number;
    guideColor: string;
    guideWidth: number;
    backgroundColor: string;
  }
  
  // ======== 文字处理相关类型 ========
  /**
   * 笔画数据
   */
  export interface StrokeData {
    character: string;
    strokeCount: number;
    strokeOrder: number[];
    strokeNames: string[];
    medians?: number[][][]; // 笔画路径点
  }
  
  /**
   * 拼音数据
   */
  export interface PinyinData {
    character: string;
    pinyin: string;
    pinyinWithTone: string;
    pinyinWithoutTone: string;
    isPolyphone: boolean;
    allPinyins?: string[];
  }
  
  /**
   * 字符单元格数据
   */
  export interface CellData {
    char: string;
    charGroup: number;
    isRowFirst: boolean;
  }
  
  // ======== 设置相关类型 ========
  /**
   * 字帖设置
   */
  export interface SheetSettings {
    // 基本设置
    gridType: GridType;
    fontFamily: string;
    gridSize: number;
    fontSize: number;
    fontColor: string;
    guideColor: string;
    guideOpacity: number;
    verticalOffset: number;
    
    // 显示设置
    showReference: boolean;
    showGuides: boolean;
    showPinyin: boolean;
    withTone: boolean;
    pinyinFontSize: number;
    pinyinColor: string;
    
    // 布局设置
    layoutType?: LayoutType;
    charsPerRow?: number;
    isSingleCharMode?: boolean;
    
    // 练习设置
    practiceMode?: string;
    repeatCount?: number;
  }
  
  /**
   * 打印设置
   */
  export interface PrintSettings {
    paperSize: 'a4' | 'a5' | 'letter' | 'custom';
    orientation: 'portrait' | 'landscape';
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    headerFooter: boolean;
    scale: number;
  }
  
  /**
   * 应用设置
   */
  export interface AppSettings {
    colorMode: 'light' | 'dark' | 'auto';
    showWelcomeGuide?: boolean;
    printSettings: PrintSettings;
  }
  
  // ======== 字体相关类型 ========
  /**
   * 字体信息
   */
  export interface FontInfo {
    name: string;
    family: string;
    type: 'system' | 'custom';
    url?: string;
  }
  
  /**
   * 自定义字体
   */
  export interface CustomFont {
    name: string;
    family: string;
    url: string;
    type?: string; // 'woff2' | 'woff' | 'ttf' | 'otf'
  }