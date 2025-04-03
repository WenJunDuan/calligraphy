import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { SheetSettings } from '@/types';
import { DEFAULT_SHEET_SETTINGS } from '@/constants';

/**
 * 字帖设置存储
 * 管理字帖的样式、布局和内容设置
 */
export const useSheetStore = defineStore('sheet', () => {
  // 字帖设置状态，使用默认值初始化
  const settings = reactive<SheetSettings>({ ...DEFAULT_SHEET_SETTINGS });

  // 当前输入的文字
  const inputText = ref('');

  // 最近使用的文字历史
  const recentTexts = ref<string[]>([]);

  /**
   * 更新设置
   * @param newSettings 要更新的设置项
   */
  function updateSettings(newSettings: Partial<SheetSettings>) {
    Object.assign(settings, newSettings);
  }

  /**
   * 设置输入文字
   * @param text 输入的文字
   */
  function setInputText(text: string) {
    inputText.value = text;
    
    // 添加到最近使用的历史，并保持最大长度为10
    if (text && !recentTexts.value.includes(text)) {
      recentTexts.value.unshift(text);
      if (recentTexts.value.length > 10) {
        recentTexts.value = recentTexts.value.slice(0, 10);
      }
    }
  }

  /**
   * 重置设置为默认值
   */
  function resetSettings() {
    Object.assign(settings, DEFAULT_SHEET_SETTINGS);
  }

  return {
    settings,
    inputText,
    recentTexts,
    updateSettings,
    setInputText,
    resetSettings
  };
}, {
  // 持久化存储配置
  persist: {
    key: 'z2h-sheet-settings',
    paths: ['settings', 'recentTexts']
  }
});