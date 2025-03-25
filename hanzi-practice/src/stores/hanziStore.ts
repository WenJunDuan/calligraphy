import { defineStore } from "pinia";
import type {
  HanziSettings,
  Font,
  GridType,
  LineStyle,
  PaperSize,
  PaperOrientation,
} from "@/types";

export const useHanziStore = defineStore("hanzi", {
  state: () => ({
    settings: {
      // 文本设置
      text: "永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。",

      // 字帖背景设置
      gridType: "tian" as GridType,
      gridLineWidth: 1,
      gridLineColor: "#CCCCCC",
      gridLineStyle: "solid" as LineStyle,
      gridSize: 80,
      gridSublines: true,

      // 字体设置
      fontFamily: "楷体",
      fontSize: 40,
      fontColor: "#000000",
      fontOpacity: 0.5,

      // 排版设置
      lineSpacing: 1.5,
      characterSpacing: 1,
      charsPerLine: 10,

      // 纸张设置
      paperSize: "A4" as PaperSize,
      paperOrientation: "portrait" as PaperOrientation,
      paperMargin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      },

      // 笔画设置
      showStrokes: false,
      strokeNumbering: true,
      strokeColors: true,
      strokeOpacity: 0.7,
    } as HanziSettings,

    fonts: [
      { name: "楷体", family: "KaiTi, 楷体, STKaiti", type: "system" },
      { name: "宋体", family: "SimSun, 宋体", type: "system" },
      { name: "黑体", family: "SimHei, 黑体", type: "system" },
      { name: "仿宋", family: "FangSong, 仿宋", type: "system" },
      { name: "微软雅黑", family: "Microsoft YaHei, 微软雅黑", type: "system" },
    ] as Font[],

    gridTypes: [
      { name: "田字格", value: "tian", description: "标准四方格，适合初学者" },
      {
        name: "米字格",
        value: "mi",
        description: "带对角线和十字线，适合进阶练习",
      },
      {
        name: "回宫格",
        value: "hui",
        description: "双重方框结构，适合高级练习",
      },
      {
        name: "九宫格",
        value: "jiu",
        description: "3×3细分格子，适合笔画练习",
      },
      { name: "钩线格", value: "gou", description: "顶部和左侧带引导线" },
      { name: "方格", value: "fang", description: "简单方格，无内部辅助线" },
      { name: "横线格", value: "heng", description: "仅有横线，类似英文本" },
      { name: "中线格", value: "zhong", description: "含中线的横线格" },
    ],

    paperSizes: [
      { name: "A4 (210 × 297mm)", value: "A4" },
      { name: "A3 (297 × 420mm)", value: "A3" },
      { name: "B5 (176 × 250mm)", value: "B5" },
    ],

    lineStyles: [
      { name: "实线", value: "solid" },
      { name: "虚线", value: "dashed" },
      { name: "点线", value: "dotted" },
    ],

    // 用户主题设置
    isDarkMode: false,
  }),

  getters: {
    characters: (state) => state.settings.text.split(""),

    currentFont: (state) => {
      return (
        state.fonts.find((font) => font.name === state.settings.fontFamily) ||
        state.fonts[0]
      );
    },

    pageCharacterCount: (state) => {
      const charsPerLine = state.settings.charsPerLine;
      // 根据纸张尺寸和方向计算每页可容纳的行数
      let linesPerPage = 0;

      if (state.settings.paperSize === "A4") {
        linesPerPage = state.settings.paperOrientation === "portrait" ? 10 : 7;
      } else if (state.settings.paperSize === "A3") {
        linesPerPage = state.settings.paperOrientation === "portrait" ? 14 : 10;
      } else if (state.settings.paperSize === "B5") {
        linesPerPage = state.settings.paperOrientation === "portrait" ? 8 : 6;
      }

      return charsPerLine * linesPerPage;
    },

    pages: (state) => {
      const chars = state.settings.text.split("");
      const pages = [];
      const charsPerPage = state.pageCharacterCount;

      for (let i = 0; i < chars.length; i += charsPerPage) {
        pages.push(chars.slice(i, i + charsPerPage));
      }

      return pages;
    },

    // 字体CSS样式对象
    fontStyle: (state) => {
      const font = state.fonts.find(
        (f) => f.name === state.settings.fontFamily
      );
      return {
        fontFamily: font ? font.family : "KaiTi, 楷体, STKaiti, sans-serif",
        fontSize: `${state.settings.fontSize}px`,
        color: state.settings.fontColor,
        opacity: state.settings.fontOpacity,
        letterSpacing: `${state.settings.characterSpacing * 0.25}em`,
        lineHeight: `${state.settings.lineSpacing}`,
      };
    },

    // 保存设置到localStorage
    savedSettings: (state) => {
      return JSON.stringify({
        settings: state.settings,
        customFonts: state.fonts.filter((f) => f.type === "custom"),
        isDarkMode: state.isDarkMode,
      });
    },
  },

  actions: {
    updateSettings(newSettings: Partial<HanziSettings>) {
      this.settings = { ...this.settings, ...newSettings };
      this.saveToLocalStorage();
    },

    addCustomFont(font: Font) {
      // 检查是否已存在同名字体
      const exists = this.fonts.some((f) => f.name === font.name);
      if (!exists) {
        this.fonts.push(font);
        this.saveToLocalStorage();
      }
    },

    removeCustomFont(fontName: string) {
      const index = this.fonts.findIndex(
        (f) => f.name === fontName && f.type === "custom"
      );
      if (index !== -1) {
        this.fonts.splice(index, 1);
      }

      // 如果删除的是当前正在使用的字体，切换回默认字体
      if (this.settings.fontFamily === fontName) {
        this.settings.fontFamily = this.fonts[0].name;
      }

      this.saveToLocalStorage();
    },

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      this.saveToLocalStorage();
    },

    // 保存设置到localStorage
    saveToLocalStorage() {
      try {
        localStorage.setItem("hanzi-settings", this.savedSettings);
      } catch (error) {
        console.error("Could not save settings to localStorage:", error);
      }
    },

    // 从localStorage加载设置
    loadFromLocalStorage() {
      try {
        const saved = localStorage.getItem("hanzi-settings");
        if (saved) {
          const data = JSON.parse(saved);
          if (data.settings) {
            this.settings = { ...this.settings, ...data.settings };
          }

          if (data.customFonts && Array.isArray(data.customFonts)) {
            // 过滤掉已存在的自定义字体，然后添加保存的自定义字体
            const existingNames = this.fonts.map((f) => f.name);
            data.customFonts.forEach((font: Font) => {
              if (!existingNames.includes(font.name)) {
                this.fonts.push(font);
              }
            });
          }

          if (typeof data.isDarkMode === "boolean") {
            this.isDarkMode = data.isDarkMode;
          }
        }
      } catch (error) {
        console.error("Could not load settings from localStorage:", error);
      }
    },

    // 重置所有设置到默认值
    resetSettings() {
      this.$reset();
      localStorage.removeItem("hanzi-settings");
    },
  },
});
