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
  segment?: boolean;  // 是否智能分词
  split?: string;     // 拆分字符
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
   * 获取文本的拼音（每个字对应一个拼音）
   * @param text 文本
   * @param withTone 是否带声调
   * @returns 拼音数组
   */
  public static getPinyinForText(text: string, withTone: boolean = true): string[] {
    if (!text) return [];
    
    return Array.from(text).map(char => {
      const data = this.getPinyinData(char);
      if (!data) return '';
      return withTone ? data.pinyinWithTone : data.pinyinWithoutTone;
    });
  }

  /**
   * 获取拼音首字母
   * @param text 文本
   * @returns 首字母数组
   */
  public static getPinyinInitials(text: string): string[] {
    return this.getPinyinForText(text, false).map(p => p.charAt(0) || '');
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

  /**
   * 检查文本是否包含多音字
   * @param text 文本
   * @returns 多音字列表 [{char, pinyins}]
   */
  public static checkPolyphoneChars(text: string): {char: string, pinyins: string[]}[] {
    if (!text) return [];
    
    const result: {char: string, pinyins: string[]}[] = [];
    
    // 遍历文本中的每个字符
    Array.from(new Set(text.split(''))).forEach(char => {
      const data = this.getPinyinData(char);
      if (data && data.isPolyphone && data.allPinyins && data.allPinyins.length > 1) {
        result.push({
          char,
          pinyins: data.allPinyins
        });
      }
    });
    
    return result;
  }
}

// 预加载最常用汉字
setTimeout(() => {
  const commonChars = '的一是在了不和有大这中人上为个所我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞';
  PinyinService.preloadCommonCharacters(commonChars);
}, 1000);