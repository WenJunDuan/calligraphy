/**
 * cnchar服务 - 提供汉字处理的核心功能
 */
import cnchar from 'cnchar';
// 引入笔画顺序插件
import 'cnchar-order';
// 引入多音字插件
import 'cnchar-poly';
// 引入绘制插件
import 'cnchar-draw';
// 引入简繁体转换插件
import 'cnchar-trad';

// 导出cnchar实例，方便在其他地方直接使用
export { cnchar };

/**
 * 汉字笔画数据
 */
export interface StrokeData {
  character: string;
  strokeCount: number;
  strokeOrder: number[];
  strokeNames: string[];
}

/**
 * cnchar服务类 - 提供笔画相关功能
 */
export class CncharService {
  // 笔画数据缓存
  private static strokeCache = new Map<string, StrokeData>();

  /**
   * 获取单个汉字的笔画数据
   * @param character 汉字
   * @returns 笔画数据
   */
  public static getStrokeData(character: string): StrokeData | null {
    if (!character || character.length === 0) {
      return null;
    }
    
    // 只处理第一个字符
    const char = character.charAt(0);
    
    // 检查缓存
    if (this.strokeCache.has(char)) {
      return this.strokeCache.get(char) || null;
    }
    
    try {
      // 获取笔画数
      const strokeCount = cnchar.stroke(char);
      
      // 获取笔画顺序
      const strokeOrder = cnchar.stroke(char, 'order');
      
      // 获取笔画名称
      const strokeNames = cnchar.stroke(char, 'name');
      
      // 构建笔画数据
      const data: StrokeData = {
        character: char,
        strokeCount: parseInt(strokeCount.toString()),
        strokeOrder: Array.isArray(strokeOrder) ? strokeOrder : [],
        strokeNames: Array.isArray(strokeNames) ? strokeNames : []
      };
      
      // 存入缓存
      this.strokeCache.set(char, data);
      
      return data;
    } catch (error) {
      console.error(`获取"${char}"的笔画数据失败:`, error);
      return null;
    }
  }

  /**
   * 获取文本中所有汉字的笔画总数
   * @param text 文本
   * @returns 笔画总数
   */
  public static getStrokeCount(text: string): number {
    if (!text) return 0;
    
    try {
      return parseInt(cnchar.stroke(text).toString());
    } catch (error) {
      console.error(`获取文本"${text}"的笔画总数失败:`, error);
      return 0;
    }
  }

  /**
   * 简体转繁体
   * @param text 简体文本
   * @returns 繁体文本
   */
  public static simpleToTraditional(text: string): string {
    if (!text) return '';
    
    try {
      return cnchar.convert.simpleToTrad(text);
    } catch (error) {
      console.error(`简体转繁体失败:`, error);
      return text;
    }
  }

  /**
   * 繁体转简体
   * @param text 繁体文本
   * @returns 简体文本
   */
  public static traditionalToSimple(text: string): string {
    if (!text) return '';
    
    try {
      return cnchar.convert.tradToSimple(text);
    } catch (error) {
      console.error(`繁体转简体失败:`, error);
      return text;
    }
  }

  /**
   * 绘制汉字笔顺
   * @param character 汉字
   * @param element DOM元素
   * @param options 绘制选项
   */
  public static drawStroke(
    character: string, 
    element: HTMLElement,
    options: {
      clear?: boolean;
      animation?: boolean;
      strokeColor?: string;
      backgroundColor?: string;
    } = {}
  ): void {
    if (!character || !element) return;
    
    const char = character.charAt(0);
    
    try {
      // 设置默认选项
      const defaultOptions = {
        clear: true,
        animation: true,
        strokeColor: '#333',
        backgroundColor: 'transparent'
      };
      
      const mergedOptions = { ...defaultOptions, ...options };
      
      // 绘制选项
      const drawOptions = {
        el: element,
        style: {
          radicalColor: '#fb8c00',
          strokeColor: mergedOptions.strokeColor,
          backgroundColor: mergedOptions.backgroundColor
        },
        animation: mergedOptions.animation,
        clear: mergedOptions.clear
      };
      
      // 调用cnchar.draw绘制
      cnchar.draw(char, drawOptions);
    } catch (error) {
      console.error(`绘制"${char}"失败:`, error);
    }
  }

  /**
   * 清除缓存
   */
  public static clearCache(): void {
    this.strokeCache.clear();
  }

  /**
   * 获取缓存状态
   */
  public static getCacheStatus(): { size: number } {
    return {
      size: this.strokeCache.size
    };
  }

  /**
   * 预加载常用汉字
   * @param chars 汉字字符串
   */
  public static preloadCommonCharacters(chars: string): void {
    if (!chars) return;
    
    const uniqueChars = Array.from(new Set(chars.split('')));
    
    for (const char of uniqueChars) {
      if (!this.strokeCache.has(char)) {
        this.getStrokeData(char);
      }
    }
  }
}

// 预加载最常用的100个汉字
setTimeout(() => {
  const commonChars = '的一是在了不和有大这中人上为个所我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部';
  CncharService.preloadCommonCharacters(commonChars);
}, 1000);