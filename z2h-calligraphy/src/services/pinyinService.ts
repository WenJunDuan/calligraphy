/**
 * 拼音服务 - 基于pinyin-pro，提供高精度拼音处理
 */
import { pinyin, customPinyin } from 'pinyin-pro';

/**
 * 拼音数据接口
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
 * 拼音选项接口
 */
export interface PinyinOptions {
  toneType?: 'none' | 'symbol' | 'num'; // 音调类型：无、符号、数字
  type?: 'normal' | 'array'; // 输出类型：普通字符串、数组
  multiple?: boolean; // 是否返回多音字全部拼音
  separator?: string; // 分隔符
}

// 拼音缓存
const PINYIN_CACHE = new Map<string, PinyinData>();

/**
 * 拼音服务类 - 提供高精度拼音处理功能
 */
export class PinyinService {
  /**
   * 获取单个汉字的拼音数据
   * @param character 汉字
   * @returns 拼音数据
   */
  public static getPinyinData(character: string): PinyinData | null {
    if (!character || character.length === 0) {
      return null;
    }
    
    // 只处理第一个字符
    const char = character.charAt(0);
    
    // 检查缓存
    const cached = PINYIN_CACHE.get(char);
    if (cached) {
      return cached;
    }
    
    try {
      // 获取不带音调的拼音
      const pinyinWithoutTone = pinyin(char, { toneType: 'none' });
      
      // 获取带音调的拼音
      const pinyinWithTone = pinyin(char, { toneType: 'symbol' });
      
      // 获取多音字信息
      const multiple = pinyin(char, { multiple: true, toneType: 'symbol' });
      const allPinyins = Array.isArray(multiple) ? multiple : [pinyinWithTone];
      
      // 判断是否为多音字
      const isPolyphone = allPinyins.length > 1;
      
      // 构建拼音数据
      const data: PinyinData = {
        character: char,
        pinyin: pinyinWithTone,
        pinyinWithTone,
        pinyinWithoutTone,
        isPolyphone,
        allPinyins
      };
      
      // 存入缓存
      PINYIN_CACHE.set(char, data);
      
      return data;
    } catch (error) {
      console.error(`获取"${char}"的拼音数据失败:`, error);
      return null;
    }
  }
  
  /**
   * 获取文本的拼音
   * @param text 文本
   * @param options 选项
   * @returns 拼音字符串
   */
  public static getTextPinyin(text: string, options: PinyinOptions = {}): string {
    if (!text) return '';
    
    const { 
      toneType = 'symbol', 
      type = 'normal',
      multiple = false,
      separator
    } = options;
    
    try {
      // 构建pinyin-pro选项
      const pinyinOptions: Record<string, any> = {
        toneType,
        type,
        multiple
      };
      
      if (separator) {
        pinyinOptions.separator = separator;
      }
      
      // 调用pinyin-pro获取拼音
      return pinyin(text, pinyinOptions);
    } catch (error) {
      console.error(`获取文本"${text}"的拼音失败:`, error);
      return '';
    }
  }
  
  /**
   * 获取智能分词的文本拼音（考虑上下文）
   * @param text 文本
   * @param options 选项
   * @returns 拼音数组，与原文本字符一一对应
   */
  public static getSmartPinyin(text: string, options: PinyinOptions = {}): string[] {
    if (!text) return [];
    
    const { toneType = 'symbol' } = options;
    
    try {
      // 使用 pinyin-pro 的 segment 参数进行智能分词
      const result = pinyin(text, {
        toneType,
        type: 'array',
        segment: true
      });
      
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error(`获取文本"${text}"的智能拼音失败:`, error);
      return Array(text.length).fill('');
    }
  }
  
  /**
   * 添加自定义拼音
   * @param customWords 自定义词汇表
   */
  public static addCustomPinyin(customWords: Record<string, string>): void {
    try {
      customPinyin(customWords);
      
      // 清除已缓存的相关拼音
      for (const word of Object.keys(customWords)) {
        for (const char of word) {
          PINYIN_CACHE.delete(char);
        }
      }
    } catch (error) {
      console.error('添加自定义拼音失败:', error);
    }
  }
  
  /**
   * 清除拼音缓存
   */
  public static clearCache(): void {
    PINYIN_CACHE.clear();
  }
  
  /**
   * 获取缓存状态
   * @returns 缓存大小
   */
  public static getCacheStatus(): { size: number } {
    return {
      size: PINYIN_CACHE.size
    };
  }
  
  /**
   * 预加载常用汉字拼音
   * @param text 包含常用汉字的文本
   */
  public static preloadCommonCharacters(text: string): void {
    if (!text || text.length === 0) return;
    
    // 去重
    const uniqueChars = [...new Set(text.split(''))];
    
    // 批量处理
    for (const char of uniqueChars) {
      if (!PINYIN_CACHE.has(char)) {
        this.getPinyinData(char);
      }
    }
  }
}

// 预加载最常用汉字
setTimeout(() => {
  const commonChars = '的一是在了不和有大这中人上为个所我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部';
  PinyinService.preloadCommonCharacters(commonChars);
}, 1000);