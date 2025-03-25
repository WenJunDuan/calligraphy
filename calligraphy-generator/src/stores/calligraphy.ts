import { defineStore } from 'pinia';
import type { CalligraphySettings, Font, GridStyle } from '../types';

export const useCalligraphyStore = defineStore('calligraphy', {
  state: () => ({
    settings: {
      text: '',
      gridType: 'tian' as const,
      fontSize: 24,
      color: '#000000',
      opacity: 0.3,
      fontFamily: '楷体',
      lineSpacing: 1.5,
      characterSpacing: 1,
      paperSize: 'A4' as const,
      orientation: 'portrait' as const,
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },
    } as CalligraphySettings,
    fonts: [
      { name: '楷体', file: '', type: 'system' as const },
      { name: '宋体', file: '', type: 'system' as const },
      { name: '行楷', file: '', type: 'system' as const },
    ] as Font[],
    gridStyles: [
      { name: '田字格', value: 'tian', description: '适合初学者练习' },
      { name: '米字格', value: 'mi', description: '适合进阶练习' },
      { name: '回宫格', value: 'huigong', description: '适合高级练习' },
    ] as GridStyle[],
  }),

  actions: {
    updateSettings(settings: Partial<CalligraphySettings>) {
      this.settings = { ...this.settings, ...settings };
    },
    addCustomFont(font: Font) {
      this.fonts.push(font);
    },
  },
}); 