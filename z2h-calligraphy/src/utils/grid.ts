/**
 * 字帖网格类型
 */
export type GridType = 'tian' | 'mi' | 'hui'

/**
 * 网格样式配置
 */
export interface GridStyleConfig {
  size: number
  borderColor: string
  borderWidth: number
  guideColor: string
  guideWidth: number
  backgroundColor: string
}

/**
 * 默认网格样式
 */
export const defaultGridStyle: GridStyleConfig = {
  size: 64,
  borderColor: '#dddddd',
  borderWidth: 1,
  guideColor: '#f0f0f0',
  guideWidth: 1,
  backgroundColor: 'white'
}

/**
 * 生成田字格SVG
 * @param config 网格样式配置
 * @returns SVG字符串
 */
export function generateTianGrid(config: Partial<GridStyleConfig> = {}): string {
  const style = { ...defaultGridStyle, ...config }
  const { size, borderColor, borderWidth, guideColor, guideWidth } = style
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" fill="${style.backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}"/>
      <line x1="${size / 2}" y1="0" x2="${size / 2}" y2="${size}" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="0" y1="${size / 2}" x2="${size}" y2="${size / 2}" stroke="${guideColor}" stroke-width="${guideWidth}" />
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
  const { size, borderColor, borderWidth, guideColor, guideWidth } = style
  
  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" fill="${style.backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}"/>
      <line x1="${size / 2}" y1="0" x2="${size / 2}" y2="${size}" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="0" y1="${size / 2}" x2="${size}" y2="${size / 2}" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="0" y1="0" x2="${size}" y2="${size}" stroke="${guideColor}" stroke-width="${guideWidth}" />
      <line x1="${size}" y1="0" x2="0" y2="${size}" stroke="${guideColor}" stroke-width="${guideWidth}" />
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
  const { size, borderColor, borderWidth, guideColor, guideWidth } = style
  
  // 回宫格是九宫格结构
  const cellSize = size / 3
  
  let svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" fill="${style.backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}"/>
  `
  
  // 绘制水平线
  for (let i = 1; i < 3; i++) {
    svg += `<line x1="0" y1="${cellSize * i}" x2="${size}" y2="${cellSize * i}" stroke="${guideColor}" stroke-width="${guideWidth}" />`
  }
  
  // 绘制垂直线
  for (let i = 1; i < 3; i++) {
    svg += `<line x1="${cellSize * i}" y1="0" x2="${cellSize * i}" y2="${size}" stroke="${guideColor}" stroke-width="${guideWidth}" />`
  }
  
  svg += `</svg>`
  
  return svg.trim()
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