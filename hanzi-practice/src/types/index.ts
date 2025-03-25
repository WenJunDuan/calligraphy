export interface HanziSettings {
  // 文本设置
  text: string;

  // 字帖背景设置
  gridType: GridType;
  gridLineWidth: number;
  gridLineColor: string;
  gridLineStyle: LineStyle;
  gridSize: number;
  gridSublines: boolean;

  // 字体设置
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  fontOpacity: number;

  // 排版设置
  lineSpacing: number;
  characterSpacing: number;
  charsPerLine: number;

  // 纸张设置
  paperSize: PaperSize;
  paperOrientation: PaperOrientation;
  paperMargin: Margin;

  // 笔画设置
  showStrokes: boolean;
  strokeNumbering: boolean;
  strokeColors: boolean;
  strokeOpacity: number;
}

export type GridType =
  | "tian" // 田字格
  | "mi" // 米字格
  | "hui" // 回宫格
  | "jiu" // 九宫格
  | "gou" // 钩线格
  | "fang" // 方格
  | "heng" // 横线格
  | "zhong" // 中线格
  | "custom"; // 自定义

export type LineStyle =
  | "solid" // 实线
  | "dashed" // 虚线
  | "dotted"; // 点线

export type PaperSize = "A4" | "A3" | "B5";

export type PaperOrientation =
  | "portrait" // 纵向
  | "landscape"; // 横向

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Font {
  name: string;
  url?: string;
  family: string;
  type: "system" | "custom";
}

export interface StrokeData {
  character: string;
  strokes: Stroke[];
}

export interface Stroke {
  type: StrokeType;
  path: string;
}

export type StrokeType =
  | "horizontal" // 横
  | "vertical" // 竖
  | "left-falling" // 撇
  | "right-falling" // 捺
  | "rising" // 提
  | "dot" // 点
  | "hook" // 钩
  | "other"; // 其他
