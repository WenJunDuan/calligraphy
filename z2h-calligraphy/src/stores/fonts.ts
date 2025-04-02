import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { FontInfo, OptionItem } from '@/types';
import { FONT_OPTIONS } from '@/constants';

/**
 * 字体管理存储
 * 管理系统和自定义字体
 */
export const useFontsStore = defineStore('fonts', () => {
  // 系统预设字体 - 从FONT_OPTIONS常量生成系统字体数组
  const systemFonts: FontInfo[] = FONT_OPTIONS.map(option => {
    return {
      name: option.label,
      family: option.value,
      type: 'system' as const
    };
  });

  // 用户自定义字体
  const customFonts = ref<FontInfo[]>([]);

  // 获取所有可用字体
  const allFonts = computed(() => {
    return [...systemFonts, ...customFonts.value];
  });

  // 获取字体选项 - 用于下拉选择框
  const fontOptions = computed<OptionItem[]>(() => {
    return allFonts.value.map(font => ({
      label: font.name,
      value: font.family
    }));
  });

  /**
   * 添加自定义字体
   * @param newFont 新字体信息
   * @returns 是否添加成功
   */
  function addCustomFont(newFont: Omit<FontInfo, 'type'>) {
    // 检查字体是否已存在
    const existingFont = customFonts.value.find(font => font.name === newFont.name);
    if (existingFont) {
      return false;
    }
    
    // 添加新字体
    customFonts.value.push({
      ...newFont,
      type: 'custom'
    });
    
    // 如果是文件URL，加载字体
    if (newFont.url) {
      loadCustomFont(newFont.name, newFont.family, newFont.url);
    }
    
    return true;
  }

  /**
   * 移除自定义字体
   * @param fontName 要移除的字体名称
   * @returns 是否移除成功
   */
  function removeCustomFont(fontName: string) {
    const index = customFonts.value.findIndex(font => font.name === fontName);
    if (index !== -1) {
      customFonts.value.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 动态加载字体
   * @param name 字体名称
   * @param family 字体系列
   * @param url 字体URL
   */
  function loadCustomFont(name: string, family: string, url: string) {
    const fontFace = new FontFace(family, `url(${url})`);
    
    fontFace.load().then((loadedFace) => {
      // 添加到document fonts
      document.fonts.add(loadedFace);
      console.log(`Font ${name} loaded successfully`);
    }).catch((error) => {
      console.error(`Error loading font ${name}:`, error);
    });
  }

  /**
   * 从File对象加载字体
   * @param file 字体文件
   * @param fontName 字体名称
   * @returns 加载结果
   */
  async function addFontFromFile(file: File, fontName: string) {
    try {
      // 创建blob URL
      const url = URL.createObjectURL(file);
      const fileName = file.name;
      const fontFamily = `CustomFont-${Date.now()}-${fileName.replace(/\.[^/.]+$/, "")}`; // 移除扩展名

      // 添加到自定义字体
      const added = addCustomFont({
        name: fontName || fileName,
        family: fontFamily,
        url: url
      });

      return { success: added, fontFamily, url };
    } catch (error) {
      console.error('Error adding font from file:', error);
      return { success: false, error };
    }
  }

  return {
    systemFonts,
    customFonts,
    allFonts,
    fontOptions,
    addCustomFont,
    removeCustomFont,
    addFontFromFile
  };
}, {
  // 持久化存储配置
  persist: {
    key: 'z2h-fonts',
    paths: ['customFonts']
  }
});