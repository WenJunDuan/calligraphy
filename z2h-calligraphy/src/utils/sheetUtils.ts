import { CSSProperties } from 'vue';
import { GridType, LayoutType, CellData } from '@/types';
import { PinyinService } from '@/services/pinyinService';
import { A4_DIMENSIONS } from '@/constants';

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
  gridSize: number;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  verticalOffset?: number;
  layoutType?: LayoutType;
}): CSSProperties {
  return {
    fontFamily,
    fontSize: `${fontSize * gridSize / 100}px`,
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
  layoutType: LayoutType;
  gridSize: number;
  charsPerRow: number;
}): CSSProperties {
  // 基本设置 - 适用于所有布局
  const baseStyle: CSSProperties = {
    paddingTop: layoutType === 'vertical' ? '10px' : '20px',
    boxSizing: 'border-box',
    width: '100%',
  }
  
  if (layoutType === 'vertical') {  
    // 竖排布局
    // 计算打印页面宽度相关参数
    const availableWidthInsidePaper = A4_DIMENSIONS.WIDTH_PX - 40 // 20px padding each side
    const horizontalMargin = 20 // 左右各增加20px边距
    const availableWidthWithMargin = availableWidthInsidePaper - (horizontalMargin * 2)
    const maxColsForScreen = Math.max(1, Math.floor(availableWidthWithMargin / gridSize))
    // 目标最多12列的网格结构
    const targetGridCols = Math.min(12, maxColsForScreen)
    // 确保网格结构至少有11列（如果可能）
    const displayGridCols = Math.max(11, targetGridCols)
    
    return {  
      ...baseStyle,
      display: 'grid',
      // 根据计算定义网格结构列（最小11，最大12，如果适合）
      gridTemplateColumns: `repeat(${displayGridCols}, ${gridSize}px)`,
      gridTemplateRows: `repeat(${charsPerRow || 1}, ${gridSize}px)`,
      justifyContent: 'center', // 使其居中显示
      gridAutoFlow: 'column',
      gridAutoColumns: `${gridSize}px`,
      paddingLeft: `${horizontalMargin}px`,
      paddingRight: `${horizontalMargin}px`,
    }  
  } else { // grid (默认)
    // 网格布局
    return {  
      ...baseStyle,
      display: 'grid',  
      gridTemplateColumns: `repeat(auto-fit, minmax(${gridSize}px, 0fr))`,
      gridAutoRows: `${gridSize}px`,
      justifyContent: 'center',
      rowGap: '30px'
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
 * @param printSettings 打印设置
 * @returns 分页后的单元格数据
 */
export function paginateCharacters({
  characters,
  layoutType,
  charsPerRow,
  printSettings
}: {
  characters: string[];
  layoutType: LayoutType;
  charsPerRow: number;
  printSettings: {
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
}): CellData[][] {
  if (characters.length === 0) return [[]]; // 返回一个空页面
  
  // A4页面基本参数
  const A4_WIDTH_PX = A4_DIMENSIONS.WIDTH_PX;
  const A4_HEIGHT_PX = A4_DIMENSIONS.HEIGHT_PX;
  
  // 初始化所有单元格
  const allCells: CellData[] = [];
  const actualCharsPerRow = charsPerRow || 1; // 确保不为零
  
  // 1. 生成所有单元格
  if (layoutType === 'vertical') {  
    // 竖排布局处理
    for (let charIndex = 0; charIndex < characters.length; charIndex++) {
      for (let rowIndex = 0; rowIndex < actualCharsPerRow; rowIndex++) {
        allCells.push({ 
          char: characters[charIndex], 
          charGroup: charIndex, 
          isRowFirst: rowIndex === 0 
        });
      }
    }
  } else {
    // 网格布局处理
    for (let i = 0; i < characters.length; i++) {
      const char = characters[i];
      for (let j = 0; j < actualCharsPerRow; j++) {
        allCells.push({ 
          char, 
          charGroup: i, 
          isRowFirst: j === 0 
        });
      }
    }
  }
  
  // 2. 计算页面边距和可用空间
  const dpi = 96;
  const mmToPx = (mm: number) => (mm / 25.4) * dpi;
  const margins = printSettings.margins;
  const availableWidth = A4_WIDTH_PX - mmToPx(margins.left) - mmToPx(margins.right);
  const availableHeight = A4_HEIGHT_PX - mmToPx(margins.top) - mmToPx(margins.bottom);
  
  // 3. 根据布局类型进行分页
  if (layoutType === 'vertical') {
    // 竖排布局分页
    const pages: CellData[][] = [];
    // 计算每列实际容纳的字符数量
    const charsInColumn = actualCharsPerRow;
    // 计算可容纳的最大列数，减少一列并增加左右边距20px
    const horizontalMargin = 20; // 左右各增加20px边距
    const availableWidthWithMargin = availableWidth - (horizontalMargin * 2);
    const maxColsPerPage = Math.floor(availableWidthWithMargin / 64); // 假设gridSize=64
    // 确保至少能放11列（比之前的12列少1列）
    const actualMaxCols = Math.min(12, Math.max(11, maxColsPerPage));
    // 每页能容纳的总字符数
    const charsPerPage = actualMaxCols; // 每页字符数 = 列数
    
    // 按页分割
    for (let startChar = 0; startChar < characters.length; startChar += charsPerPage) {
      const endChar = Math.min(startChar + charsPerPage, characters.length);
      const pageChars = characters.slice(startChar, endChar);
      
      // 创建当前页的所有单元格
      const pageCells: CellData[] = [];
      for (let i = 0; i < pageChars.length; i++) {
        for (let j = 0; j < charsInColumn; j++) {
          pageCells.push({
            char: pageChars[i],
            charGroup: startChar + i,
            isRowFirst: j === 0
          });
        }
      }
      
      pages.push(pageCells);
    }
    
    return pages.length > 0 ? pages : [[]];
  } else {
    // 网格布局分页处理
    const pages: CellData[][] = [];
    
    // 计算网格布局参数
    const gridPaddingTop = 20; // paddingTop in gridContainerStyle
    const gridRowGap = 30;     // rowGap in gridContainerStyle
    const effectiveHeight = availableHeight - gridPaddingTop;
    // 每行实际高度 = 字体大小 + 间距
    const rowHeight = 64 + gridRowGap; // 假设gridSize=64
    // 计算每页可容纳的行数，向下取整，确保满行显示 (增加3行额外空间)
    const rowsPerPage = Math.floor(effectiveHeight / rowHeight) + 3;
    // 计算每行可容纳的字符数
    const colsPerRow = Math.floor(availableWidth / 64); // 假设gridSize=64
    
    // 总共能容纳的字符格子数（每页）
    const cellsPerPage = rowsPerPage * colsPerRow;
    
    // 按格子数量分页，确保充分利用每页空间
    let currentPage: CellData[] = [];
    let charIndex = 0;
    
    // 循环遍历所有字符
    while (charIndex < characters.length) {
      const char = characters[charIndex];
      
      // 为当前字符添加所有练习行
      const cellsNeededForChar = actualCharsPerRow;
      const cellsAvailableInPage = cellsPerPage - currentPage.length;
      
      // 检查当前页是否能容纳这个字符的所有练习行
      if (cellsNeededForChar <= cellsAvailableInPage) {
        // 当前页可以容纳这个字符的所有练习行
        for (let j = 0; j < actualCharsPerRow; j++) {
          currentPage.push({
            char: char,
            charGroup: charIndex,
            isRowFirst: j === 0
          });
        }
        charIndex++; // 移动到下一个字符
      } else {
        // 当前页不能完整容纳这个字符，创建新页
        pages.push(currentPage);
        currentPage = [];
      }
    }
    
    // 添加最后一页（如果有内容）
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }
    
    return pages.length > 0 ? pages : [[]];
  }
}

/**
 * 获取汉字拼音
 * @param char 汉字
 * @returns 拼音字符串
 */
export function getPinyin(char: string): string {
  if (!char || char === ' ' || char === '　') return '';
  
  const data = PinyinService.getPinyinData(char);
  return data ? data.pinyinWithTone : '';
}