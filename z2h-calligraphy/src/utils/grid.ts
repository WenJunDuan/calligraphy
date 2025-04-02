/**
 * 网格生成工具
 */
import { GridType, GridStyleConfig } from '@/types';
import { DEFAULT_GRID_STYLE, GRID_OPTIONS } from '@/constants';

/**
 * 获取所有支持的网格类型选项
 * @returns 网格类型选项数组
 */
export function getGridTypeOptions() {
  return GRID_OPTIONS;
}

/**
 * 默认网格样式
 */
export const defaultGridStyle: GridStyleConfig = DEFAULT_GRID_STYLE;

/**
 * 生成田字格SVG
 * @param config 网格样式配置
 * @returns SVG字符串
 */
export function generateTianGrid(config: Partial<GridStyleConfig> = {}): string {
  const style = { ...defaultGridStyle, ...config }
  const { size, borderColor, borderWidth, guideColor, guideWidth, backgroundColor } = style
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="100" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}"/>
      <line x1="50" y1="0" x2="50" y2="100" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="${guideColor}" stroke-width="${guideWidth}" />
    </svg>
  `.trim()
}

/**
 * 生成米字格SVG
 * @param config 网格样式配置
 * @returns SVG字符串
 */
export function generateMiGrid(config: Partial<GridStyleConfig> = {}): string {
  const style = { ...defaultGridStyle, ...config }
  const { size, borderColor, borderWidth, guideColor, guideWidth, backgroundColor } = style
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="100" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}"/>
      <line x1="50" y1="0" x2="50" y2="100" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="0" y1="0" x2="100" y2="100" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="100" y1="0" x2="0" y2="100" stroke="${guideColor}" stroke-width="${guideWidth}" />
    </svg>
  `.trim()
}

/**
 * 生成回宫格SVG
 * @param config 网格样式配置
 * @returns SVG字符串
 */
export function generateHuiGrid(config: Partial<GridStyleConfig> = {}): string {
  const style = { ...defaultGridStyle, ...config }
  const { size, borderColor, borderWidth, guideColor, guideWidth, backgroundColor } = style
  
  // 回宫格是九宫格结构
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="100" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}"/>
      <line x1="33.3" y1="0" x2="33.3" y2="100" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="66.6" y1="0" x2="66.6" y2="100" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="0" y1="33.3" x2="100" y2="33.3" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="0" y1="66.6" x2="100" y2="66.6" stroke="${guideColor}" stroke-width="${guideWidth}" />
    </svg>
  `.trim()
}

/**
 * 生成九宫格SVG（与回宫格相同）
 * @param config 网格样式配置
 * @returns SVG字符串
 */
export function generateJiuGrid(config: Partial<GridStyleConfig> = {}): string {
  return generateHuiGrid(config)
}

/**
 * 生成方格SVG
 * @param config 网格样式配置
 * @returns SVG字符串
 */
export function generateFangGrid(config: Partial<GridStyleConfig> = {}): string {
  const style = { ...defaultGridStyle, ...config }
  const { size, borderColor, borderWidth, backgroundColor } = style
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="100" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}"/>
    </svg>
  `.trim()
}

/**
 * 生成米田格SVG
 * @param config 网格样式配置
 * @returns SVG字符串
 */
export function generateMiTianGrid(config: Partial<GridStyleConfig> = {}): string {
  const style = { ...defaultGridStyle, ...config }
  const { size, borderColor, borderWidth, guideColor, guideWidth, backgroundColor } = style
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="100" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}"/>
      <line x1="50" y1="0" x2="50" y2="100" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="0" y1="0" x2="100" y2="100" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="100" y1="0" x2="0" y2="100" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="${guideColor}" stroke-width="${guideWidth}" />
    </svg>
  `.trim()
}

/**
 * 生成四线格SVG
 * @param config 网格样式配置
 * @returns SVG字符串
 */
export function generateSiGrid(config: Partial<GridStyleConfig> = {}): string {
  const style = { ...defaultGridStyle, ...config }
  const { size, borderColor, guideColor, guideWidth, backgroundColor } = style
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="100" height="100" fill="${backgroundColor}" stroke="${backgroundColor}" stroke-width="0"/>
      <line x1="0" y1="25" x2="100" y2="25" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="0" y1="50" x2="100" y2="50" stroke="${borderColor}" stroke-width="${guideWidth * 1.5}" />
      <line x1="0" y1="75" x2="100" y2="75" stroke="${guideColor}" stroke-width="${guideWidth}" />
    </svg>
  `.trim()
}

/**
 * 根据类型生成网格SVG
 * @param type 网格类型
 * @param config 网格样式配置
 * @returns SVG字符串
 */
export function generateGrid(type: GridType, config: Partial<GridStyleConfig> = {}): string {
  switch (type) {
    case 'tian':
      return generateTianGrid(config)
    case 'mi':
      return generateMiGrid(config)
    case 'hui':
      return generateHuiGrid(config)
    case 'jiu':
      return generateJiuGrid(config)
    case 'fang':
      return generateFangGrid(config)
    case 'mitian':
      return generateMiTianGrid(config)
    case 'si':
      return generateSiGrid(config)
    default:
      return generateTianGrid(config)
  }
}

/**
 * 生成网格背景CSS
 * @param type 网格类型
 * @param config 网格样式配置
 * @returns CSS样式字符串
 */
export function generateGridBackgroundCSS(type: GridType, config: Partial<GridStyleConfig> = {}): string {
  const svg = generateGrid(type, config)
  const encodedSVG = encodeURIComponent(svg)
  
  return `background-image: url("data:image/svg+xml,${encodedSVG}"); background-repeat: no-repeat; background-size: 100% 100%;`
}