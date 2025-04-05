import { CSSProperties } from 'vue'
import { GridType, LayoutType, CellData } from '@/types'
import { PinyinService } from '@/services/pinyinService'
import { A4_DIMENSIONS } from '@/constants'

/**
 * 计算字帖的基本样式
 * @param gridSize 网格大小
 * @param fontSize 字体大小
 * @param fontFamily 字体系列
 * @param fontColor 字体颜色
 * @param verticalOffset 垂直偏移
 * @param layoutType 布局类型
 * @returns 字符样式对象
 */
export function calculateCharacterStyle({
  gridSize,
  fontSize,
  fontFamily,
  fontColor,
  verticalOffset = 0,
  layoutType = 'grid'
}: {
  gridSize: number
  fontSize: number
  fontFamily: string
  fontColor: string
  verticalOffset?: number
  layoutType?: LayoutType
}): CSSProperties {
  return {
    fontFamily,
    fontSize: `${(fontSize * gridSize) / 100}px`,
    color: fontColor,
    opacity: 1,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) translateY(${verticalOffset}px)`,
    writingMode: layoutType === 'vertical' ? 'vertical-rl' : 'horizontal-tb'
  }
}

/**
 * 计算描红字符样式（在基本样式基础上修改）
 * @param baseStyle 基本字符样式
 * @param strokeColor 描红颜色
 * @param strokeOpacity 描红透明度
 * @returns 描红字符样式对象
 */
export function calculateStrokeStyle(
  baseStyle: CSSProperties,
  strokeColor: string,
  strokeOpacity: number
): CSSProperties {
  return {
    ...baseStyle,
    opacity: strokeOpacity / 100,
    color: strokeColor
  }
}

/**
 * 计算网格容器样式
 * @param layoutType 布局类型
 * @param gridSize 网格大小
 * @param charsPerRow 每行字符数
 * @returns 网格容器样式对象
 */
export function calculateGridContainerStyle({
  layoutType,
  gridSize,
  charsPerRow
}: {
  layoutType: LayoutType
  gridSize: number
  charsPerRow: number
}): CSSProperties {
  // A4页面基本参数（以像素为单位）
  const A4_WIDTH_PX = A4_DIMENSIONS.WIDTH_PX
  const A4_HEIGHT_PX = A4_DIMENSIONS.HEIGHT_PX
  
  // 页面边距设置
  const PAGE_MARGIN = 20 // 页面边距（像素）
  const ROW_GAP = 30 // 行间距（像素）
  const SIDE_MARGIN = 10 // 左右边距（像素）
  
  // 计算可用空间
  const availableWidth = A4_WIDTH_PX - (PAGE_MARGIN * 2)
  const availableHeight = A4_HEIGHT_PX - (PAGE_MARGIN * 2)
  
  // 计算每行可容纳的网格数
  const maxGridsPerRow = Math.floor((availableWidth - (SIDE_MARGIN * 2)) / gridSize)
  
  // 计算每列可容纳的网格数
  const maxGridsPerColumn = Math.floor(availableHeight / (gridSize + ROW_GAP))
  
  // 基本样式设置
  const baseStyle: CSSProperties = {
    boxSizing: 'border-box',
    width: '100%',
    maxWidth: `${availableWidth}px`,
    margin: '0 auto',
    padding: `${PAGE_MARGIN}px ${PAGE_MARGIN}px ${PAGE_MARGIN}px ${PAGE_MARGIN}px`,
    paddingTop: '0px'
  }

  if (layoutType === 'vertical') {
    // 竖排布局 - 不设置行间距，增加列数，保留左右边距
    // 计算最佳列数，根据网格大小动态调整
    const optimalColumns = Math.min(15, Math.floor((availableWidth - (SIDE_MARGIN * 2)) / gridSize))
    
    return {
      ...baseStyle,
      display: 'grid',
      gridTemplateColumns: `repeat(${optimalColumns}, ${gridSize}px)`, // 动态计算列数
      gridTemplateRows: `repeat(${charsPerRow}, ${gridSize}px)`,
      justifyContent: 'center',
      gridAutoFlow: 'column',
      gridAutoColumns: `${gridSize}px`,
      marginTop: '0', // 减少顶部空白
      paddingLeft: `${PAGE_MARGIN + SIDE_MARGIN}px`, // 增加左边距
      paddingRight: `${PAGE_MARGIN + SIDE_MARGIN}px` // 增加右边距
    }
  } else {
    // 网格布局 - 保留行间距
    return {
      ...baseStyle,
      display: 'grid',
      gridTemplateColumns: `repeat(${maxGridsPerRow}, ${gridSize}px)`,
      gridAutoRows: `${gridSize}px`,
      justifyContent: 'center',
      rowGap: `${ROW_GAP}px`,
      marginTop: '0', // 减少顶部空白
      paddingLeft: `${PAGE_MARGIN + SIDE_MARGIN}px`, // 增加左边距
      paddingRight: `${PAGE_MARGIN + SIDE_MARGIN}px` // 增加右边距
    }
  }
}

/**
 * 获取单元格样式
 * @param gridSize 网格大小
 * @returns 单元格样式对象
 */
export function calculateCellStyle(gridSize: number): CSSProperties {
  return {
    width: `${gridSize}px`,
    height: `${gridSize}px`,
    position: 'relative'
  }
}

/**
 * 分页计算 - 将字符列表分割成多个页面
 * @param characters 字符列表
 * @param layoutType 布局类型
 * @param charsPerRow 每行字符数
 * @param gridSize 网格大小
 * @param printSettings 打印设置
 * @returns 分页后的单元格数据
 */
export function paginateCharacters({
  characters,
  layoutType,
  charsPerRow,
  gridSize = 64, // 默认网格大小为64px
  printSettings
}: {
  characters: string[]
  layoutType: LayoutType
  charsPerRow: number
  gridSize?: number
  printSettings: {
    margins: {
      top: number
      right: number
      bottom: number
      left: number
    }
  }
}): CellData[][] {
  if (characters.length === 0) return [[]] // 返回一个空页面

  // A4页面基本参数
  const A4_WIDTH_PX = A4_DIMENSIONS.WIDTH_PX
  const A4_HEIGHT_PX = A4_DIMENSIONS.HEIGHT_PX

  // 固定的左右边距值
  const SIDE_MARGIN = 20

  // 初始化所有单元格
  const actualCharsPerRow = charsPerRow || 1 // 确保不为零

  // 计算页面边距和可用空间
  const dpi = 96
  const mmToPx = (mm: number) => (mm / 25.4) * dpi
  const margins = printSettings.margins
  const availableWidth = A4_WIDTH_PX - mmToPx(margins.left) - mmToPx(margins.right)
  const availableHeight = A4_HEIGHT_PX - mmToPx(margins.top) - mmToPx(margins.bottom)

  if (layoutType === 'vertical') {
    // 竖排布局分页
    const pages: CellData[][] = []

    // 计算可用宽度并减去左右边距
    const availableWidthWithMargin = availableWidth - SIDE_MARGIN * 2
    // 计算每页能容纳的列数
    const columnsPerPage = Math.floor(availableWidthWithMargin / gridSize)

    // 循环创建页面
    for (let charIndex = 0; charIndex < characters.length; charIndex += columnsPerPage) {
      const pageCells: CellData[] = []
      const charsInPage = Math.min(columnsPerPage, characters.length - charIndex)

      // 创建当前页的单元格
      for (let colIndex = 0; colIndex < charsInPage; colIndex++) {
        const char = characters[charIndex + colIndex]

        // 为每个字符创建多行练习
        for (let rowIndex = 0; rowIndex < actualCharsPerRow; rowIndex++) {
          pageCells.push({
            char,
            charGroup: charIndex + colIndex,
            isRowFirst: rowIndex === 0
          })
        }
      }

      // 添加当前页
      pages.push(pageCells)
    }

    return pages.length > 0 ? pages : [[]]
  } else {
    // 网格布局分页处理
    const pages: CellData[][] = []

    // 计算网格布局参数
    const gridPaddingTop = 20 // paddingTop in gridContainerStyle
    const gridRowGap = 30 // rowGap in gridContainerStyle
    const effectiveHeight = availableHeight - gridPaddingTop
    // 每行实际高度 = 网格大小 + 间距
    const rowHeight = gridSize + gridRowGap
    // 计算每页可容纳的行数
    const rowsPerPage = Math.floor(effectiveHeight / rowHeight) + 3
    // 计算每行可容纳的字符数
    const colsPerRow = Math.floor(availableWidth / gridSize)

    // 总共能容纳的字符格子数（每页）
    const cellsPerPage = rowsPerPage * colsPerRow

    // 按格子数量分页，确保充分利用每页空间
    let currentPage: CellData[] = []
    let charIndex = 0

    // 循环遍历所有字符
    while (charIndex < characters.length) {
      const char = characters[charIndex]

      // 为当前字符添加所有练习行
      const cellsNeededForChar = actualCharsPerRow
      const cellsAvailableInPage = cellsPerPage - currentPage.length

      // 检查当前页是否能容纳这个字符的所有练习行
      if (cellsNeededForChar <= cellsAvailableInPage) {
        // 当前页可以容纳这个字符的所有练习行
        for (let j = 0; j < actualCharsPerRow; j++) {
          currentPage.push({
            char: char,
            charGroup: charIndex,
            isRowFirst: j === 0
          })
        }
        charIndex++ // 移动到下一个字符
      } else {
        // 当前页不能完整容纳这个字符，创建新页
        pages.push(currentPage)
        currentPage = []
      }
    }

    // 添加最后一页（如果有内容）
    if (currentPage.length > 0) {
      pages.push(currentPage)
    }

    return pages.length > 0 ? pages : [[]]
  }
}

/**
 * 获取汉字拼音
 * @param char 汉字
 * @returns 拼音字符串
 */
export function getPinyin(char: string): string {
  if (!char || char === ' ' || char === '　') return ''

  const data = PinyinService.getPinyinData(char)
  return data ? data.pinyinWithTone : ''
}
