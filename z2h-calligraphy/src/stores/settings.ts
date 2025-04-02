import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { useColorMode } from '@vueuse/core';
import { AppSettings, PrintSettings } from '@/types';
import { DEFAULT_APP_SETTINGS } from '@/constants';

/**
 * 应用设置存储
 * 管理全局应用设置，如颜色模式、打印设置等
 */
export const useSettingsStore = defineStore('settings', () => {
  // 主题模式
  const colorMode = useColorMode({
    selector: 'html',
    attribute: 'data-theme',
    storageKey: 'z2h-color-scheme',
    modes: {
      light: 'light',
      dark: 'dark',
      auto: 'auto'
    }
  });

  // 打印设置
  const printSettings = reactive<PrintSettings>({ ...DEFAULT_APP_SETTINGS.printSettings });

  // 是否显示欢迎指引
  const showWelcomeGuide = ref(DEFAULT_APP_SETTINGS.showWelcomeGuide);

  /**
   * 更新打印设置
   * @param newSettings 要更新的打印设置
   */
  function updatePrintSettings(newSettings: Partial<PrintSettings>) {
    Object.assign(printSettings, newSettings);
  }
  
  /**
   * 设置是否显示欢迎指引
   * @param show 是否显示
   */
  function setShowWelcomeGuide(show: boolean) {
    showWelcomeGuide.value = show;
  }

  /**
   * 重置设置为默认值
   */
  function resetSettings() {
    colorMode.value = DEFAULT_APP_SETTINGS.colorMode;
    Object.assign(printSettings, DEFAULT_APP_SETTINGS.printSettings);
    showWelcomeGuide.value = DEFAULT_APP_SETTINGS.showWelcomeGuide;
  }

  return {
    colorMode,
    printSettings,
    showWelcomeGuide,
    updatePrintSettings,
    setShowWelcomeGuide,
    resetSettings
  };
}, {
  // 持久化存储配置
  persist: {
    key: 'z2h-app-settings',
    paths: ['printSettings', 'showWelcomeGuide']
  }
});