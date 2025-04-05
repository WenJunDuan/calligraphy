/**
 * 笔画生成与汉字处理工具
 * 提供笔画动画、控笔练习和拼音处理等功能
 */
import { CncharService } from '@/services/cncharService'
import { PinyinService } from '@/services/pinyinService'

// 导出类型定义
export interface StrokeData {
  character: string;
  strokeCount: number;
  strokeOrder: number[];
  strokeNames: string[];
  medians?: number[][][]; // 每个笔画的路径点
}

export interface PinyinData {
  character: string;
  pinyin: string;
  pinyinWithTone: string;
  pinyinWithoutTone: string;
  isPolyphone: boolean;
  allPinyins?: string[];
}

// 笔画符号映射表 - 扩展了更多常见笔画
const strokeSymbolMap: Record<string, string> = {
  '横': '一',
  '竖': '丨',
  '撇': '丿',
  '点': '丶',
  '捺': '㇏',
  '提': '㇀',
  '钩': '亅',
  '折': '乛',
  '横折': '⺄',
  '横撇': '𠃊',
  '横钩': '乚',
  '竖钩': '亅',
  '竖提': '㇋',
  '撇点': '㇆',
  '撇折': '𡿨',
  '弯钩': '㇉',
  '竖弯': '㇍',
  '横折钩': '㇆',
  '横折提': '㇌',
  '竖折折': '𠃑'
};

/**
 * 获取汉字笔画数据
 * @param character 汉字
 * @returns 笔画数据
 */
export function getStrokeData(character: string): StrokeData | null {
  return CncharService.getStrokeData(character);
}

/**
 * 获取汉字拼音数据
 * @param character 汉字
 * @returns 拼音数据
 */
export function getPinyinData(character: string): PinyinData | null {
  return PinyinService.getPinyinData(character);
}

/**
 * 获取文本的拼音
 * @param text 文本
 * @param options 选项
 * @returns 拼音
 */
export function getTextPinyin(
  text: string, 
  options: { tone?: boolean; spacing?: boolean; split?: string } = {}
): string {
  return PinyinService.getTextPinyin(text, {
    toneType: options.tone ? 'symbol' : 'none',
    separator: options.spacing ? ' ' : '',
  });
}

/**
 * 获取汉字笔画符号
 * @param character 汉字
 * @returns 笔画符号数组
 */
export function getStrokeSymbols(character: string): string[] {
  if (!character || character.length === 0) {
    return [];
  }
  
  try {
    const strokeData = CncharService.getStrokeData(character.charAt(0));
    
    if (strokeData && strokeData.strokeNames && strokeData.strokeNames.length > 0) {
      return strokeData.strokeNames.map(name => {
        // 查找精确匹配的笔画名称
        if (strokeSymbolMap[name]) {
          return strokeSymbolMap[name];
        }
        
        // 查找包含关键词的笔画名称
        for (const [key, symbol] of Object.entries(strokeSymbolMap)) {
          if (name.includes(key)) {
            return symbol;
          }
        }
        
        // 如果没找到匹配的，返回第一个字符
        return name.charAt(0);
      });
    }
  } catch (error) {
    console.error(`获取"${character}"的笔画符号失败:`, error);
  }
  
  return [];
}

/**
 * 获取汉字笔画符号字符串
 * @param character 汉字
 * @returns 笔画符号字符串
 */
export function getStrokeSymbolsString(character: string): string {
  return getStrokeSymbols(character).join('');
}

/**
 * 获取汉字笔画名称
 * @param character 汉字
 * @returns 笔画名称数组
 */
export function getStrokeNames(character: string): string[] {
  if (!character || character.length === 0) {
    return [];
  }
  
  try {
    const strokeData = CncharService.getStrokeData(character.charAt(0));
    return strokeData && strokeData.strokeNames ? strokeData.strokeNames : [];
  } catch (error) {
    console.error(`获取"${character}"的笔画名称失败:`, error);
    return [];
  }
}

/**
 * 获取汉字笔画名称字符串
 * @param character 汉字
 * @param separator 分隔符
 * @returns 笔画名称字符串
 */
export function getStrokeNamesString(character: string, separator: string = '·'): string {
  const names = getStrokeNames(character);
  return names.length > 0 ? names.join(separator) : '';
}

/**
 * 绘制汉字笔画
 * @param character 汉字
 * @param element DOM元素
 * @param options 选项
 */
export function drawCharacterStrokes(
  character: string,
  element: HTMLElement,
  options: {
    clear?: boolean;
    animation?: boolean;
    strokeColor?: string;
    backgroundColor?: string;
    onComplete?: () => void;
    highlightStroke?: number; // 高亮显示指定索引的笔画
  } = {}
): void {
  try {
    // 处理默认选项
    const defaultOptions = {
      clear: true,
      animation: true,
      strokeColor: '#333',
      backgroundColor: 'transparent',
      onComplete: () => {},
      highlightStroke: -1
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // 调用CncharService绘制笔顺
    CncharService.drawStroke(character, element, {
      clear: mergedOptions.clear,
      animation: mergedOptions.animation,
      strokeColor: mergedOptions.strokeColor,
      backgroundColor: mergedOptions.backgroundColor,
      // 如果有指定高亮笔画，传递给cnchar
      ...( mergedOptions.highlightStroke >= 0 ? { 
        highlight: mergedOptions.highlightStroke 
      } : {})
    });
    
    // 如果有动画，添加动画完成回调
    if (mergedOptions.animation && mergedOptions.onComplete) {
      // cnchar绘制完成后的动画时长大约是笔画数*1.5秒
      const strokeData = CncharService.getStrokeData(character);
      const animationDuration = strokeData ? strokeData.strokeCount * 1500 : 3000;
      
      setTimeout(() => {
        if (mergedOptions.onComplete) {
          mergedOptions.onComplete();
        }
      }, animationDuration);
    } else if (mergedOptions.onComplete) {
      // 如果没有动画，直接调用回调
      mergedOptions.onComplete();
    }
  } catch (error) {
    console.error(`绘制"${character}"的笔画失败:`, error);
  }
}

/**
 * 生成笔画动画SVG
 * @param strokeData 笔画数据
 * @param options 配置选项
 * @returns SVG字符串
 */
export function generateStrokeSVG(
  strokeData: StrokeData,
  options: {
    width: number;
    height: number;
    strokeWidth: number;
    strokeColor: string;
    strokeOpacity: number;
    animation?: boolean;
    animationDuration?: number;
    highlightStroke?: number; // 高亮显示指定索引的笔画
    showOrder?: boolean; // 是否显示笔画顺序
  }
): string {
  if (!strokeData || !strokeData.medians || strokeData.medians.length === 0) {
    return '';
  }

  const { width, height, strokeWidth, strokeColor, strokeOpacity } = options;
  const animation = options.animation || false;
  const animationDuration = options.animationDuration || 1;
  const highlightStroke = options.highlightStroke || -1;
  const showOrder = options.showOrder || false;
  
  // 创建SVG容器
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">`;
  
  // 处理每个笔画
  strokeData.medians.forEach((median, index) => {
    if (median.length === 0) return;
    
    // 创建路径
    let pathData = '';
    median.forEach((point, i) => {
      if (i === 0) {
        // 移动到第一个点
        pathData += `M${point[0]},${point[1]} `;
      } else {
        // 连接到后续点
        pathData += `L${point[0]},${point[1]} `;
      }
    });
    
    // 判断是否为高亮笔画
    const isHighlighted = highlightStroke === index;
    const currentStrokeColor = isHighlighted ? '#ff6b6b' : strokeColor;
    const currentStrokeWidth = isHighlighted ? strokeWidth * 1.5 : strokeWidth;
    const currentOpacity = isHighlighted ? 1 : strokeOpacity;
    
    // 添加路径元素
    if (animation) {
      const totalDuration = animationDuration;
      const delay = (index / strokeData.medians.length) * totalDuration;
      const strokeDuration = totalDuration / strokeData.medians.length;
      
      svg += `
        <path
          d="${pathData}"
          fill="none"
          stroke="${currentStrokeColor}"
          stroke-width="${currentStrokeWidth}"
          stroke-opacity="${currentOpacity}"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-dasharray="0 10000"
          opacity="0"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0 10000"
            to="10000 0"
            begin="${delay}s"
            dur="${strokeDuration}s"
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            begin="${delay}s"
            dur="0.01s"
            fill="freeze"
          />
        </path>
      `;
    } else {
      svg += `
        <path
          d="${pathData}"
          fill="none"
          stroke="${currentStrokeColor}"
          stroke-width="${currentStrokeWidth}"
          stroke-opacity="${currentOpacity}"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      `;
    }
    
    // 如果需要显示笔画顺序，添加序号
    if (showOrder) {
      // 获取第一个点坐标作为序号位置
      const firstPoint = median[0];
      svg += `
        <text 
          x="${firstPoint[0]}" 
          y="${firstPoint[1]}" 
          font-size="${strokeWidth * 4}"
          fill="${currentStrokeColor}"
          text-anchor="middle"
          dominant-baseline="middle"
        >${index + 1}</text>
      `;
    }
  });
  
  svg += `</svg>`;
  return svg;
}

/**
 * 生成控笔练习SVG
 * @param pattern 图案类型
 * @param options 配置选项
 * @returns SVG字符串
 */
export function generatePatternSVG(
  pattern: string,
  options: {
    width: number;
    height: number;
    strokeWidth: number;
    strokeColor: string;
    strokeOpacity: number;
    repeat?: number;
    animation?: boolean; // 添加动画选项
  }
): string {
  const { width, height, strokeWidth, strokeColor, strokeOpacity } = options;
  const repeat = options.repeat || 1;
  const animation = options.animation || false;
  
  // 创建SVG容器
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">`;
  
  // 根据图案类型生成不同的路径
  switch (pattern) {
    case 'horizontal-line':
      for (let i = 0; i < repeat; i++) {
        const y = 10 + (80 / repeat) * i;
        svg += createPatternPath(`M10,${y} L90,${y}`, strokeColor, strokeWidth, strokeOpacity, animation, i, repeat);
      }
      break;
      
    case 'vertical-line':
      for (let i = 0; i < repeat; i++) {
        const x = 10 + (80 / repeat) * i;
        svg += createPatternPath(`M${x},10 L${x},90`, strokeColor, strokeWidth, strokeOpacity, animation, i, repeat);
      }
      break;
      
    case 'diagonal-line':
      for (let i = 0; i < repeat; i++) {
        const offset = (80 / repeat) * i;
        svg += createPatternPath(`M${10 + offset},10 L90,${90 - offset}`, strokeColor, strokeWidth, strokeOpacity, animation, i, repeat);
      }
      break;
      
    case 'wave':
      for (let i = 0; i < repeat; i++) {
        const y = 20 + (60 / repeat) * i;
        svg += createPatternPath(`M10,${y} C25,${y - 15} 40,${y + 15} 55,${y} C70,${y - 15} 85,${y + 15} 90,${y}`, strokeColor, strokeWidth, strokeOpacity, animation, i, repeat);
      }
      break;
      
    case 'zigzag':
      for (let i = 0; i < repeat; i++) {
        const y = 20 + (60 / repeat) * i;
        svg += createPatternPath(`M10,${y} L25,${y - 10} L40,${y + 10} L55,${y - 10} L70,${y + 10} L85,${y - 10} L90,${y}`, strokeColor, strokeWidth, strokeOpacity, animation, i, repeat);
      }
      break;
      
    case 'circle':
      for (let i = 0; i < repeat; i++) {
        const radius = 40 - (30 / repeat) * i;
        // 圆形需要特殊处理，无法直接使用路径动画
        if (animation) {
          svg += `
            <circle cx="50" cy="50" r="${radius}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}">
              <animate attributeName="r" from="0" to="${radius}" begin="${0.1 * i}s" dur="1s" fill="freeze"/>
              <animate attributeName="stroke-dasharray" from="0 ${2 * Math.PI * radius}" to="${2 * Math.PI * radius} 0" begin="${0.1 * i}s" dur="1s" fill="freeze"/>
            </circle>
          `;
        } else {
          svg += `<circle cx="50" cy="50" r="${radius}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />`;
        }
      }
      break;
      
    case 'spiral':
      // 螺旋线需要更复杂的路径计算
      const pathData = 'M50,50 ' + Array.from({ length: 360 }, (_, i) => {
        const angle = i * Math.PI / 180;
        const radius = 5 + i / 20;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return `L${x},${y}`;
      }).join(' ');
      
      svg += createPatternPath(pathData, strokeColor, strokeWidth, strokeOpacity, animation, 0, 1);
      break;
      
    case 'square':
      for (let i = 0; i < repeat; i++) {
        const size = 80 - (60 / repeat) * i;
        const offset = (80 - size) / 2;
        const squarePath = `M${10 + offset},${10 + offset} L${10 + offset + size},${10 + offset} L${10 + offset + size},${10 + offset + size} L${10 + offset},${10 + offset + size} Z`;
        svg += createPatternPath(squarePath, strokeColor, strokeWidth, strokeOpacity, animation, i, repeat);
      }
      break;
      
    default:
      // 默认绘制一条水平线
      svg += createPatternPath("M10,50 L90,50", strokeColor, strokeWidth, strokeOpacity, animation, 0, 1);
  }
  
  svg += `</svg>`;
  return svg;
}

/**
 * 创建带有可选动画的路径元素
 * @param pathData 路径数据
 * @param color 颜色
 * @param width 线宽
 * @param opacity 不透明度
 * @param animation 是否添加动画
 * @param index 索引（用于延迟动画）
 * @param total 总数（用于计算延迟）
 * @returns SVG路径元素字符串
 */
function createPatternPath(
  pathData: string,
  color: string,
  width: number,
  opacity: number,
  animation: boolean = false,
  index: number = 0,
  total: number = 1
): string {
  if (!animation) {
    return `<path d="${pathData}" fill="none" stroke="${color}" stroke-width="${width}" stroke-opacity="${opacity}" stroke-linecap="round" />`;
  }
  
  // 添加动画效果
  const delay = index * 0.1; // 每个路径延迟0.1秒
  const duration = 1.0; // 动画持续1秒
  
  return `
    <path 
      d="${pathData}" 
      fill="none" 
      stroke="${color}" 
      stroke-width="${width}" 
      stroke-opacity="${opacity}" 
      stroke-linecap="round"
      stroke-dasharray="1000 1000"
      stroke-dashoffset="1000"
    >
      <animate 
        attributeName="stroke-dashoffset" 
        from="1000" 
        to="0" 
        begin="${delay}s" 
        dur="${duration}s" 
        fill="freeze"
      />
    </path>
  `;
}

/**
 * 获取所有支持的控笔练习图案
 * @returns 图案列表
 */
export function getSupportedPatterns(): Array<{ id: string; name: string; }> {
  return [
    { id: 'horizontal-line', name: '横线' },
    { id: 'vertical-line', name: '竖线' },
    { id: 'diagonal-line', name: '斜线' },
    { id: 'wave', name: '波浪线' },
    { id: 'zigzag', name: '锯齿线' },
    { id: 'circle', name: '圆形' },
    { id: 'spiral', name: '螺旋' },
    { id: 'square', name: '方形' }
  ];
}

/**
 * 创建笔画练习SVG
 * @param character 汉字
 * @param options 配置选项
 * @returns SVG字符串
 */
export function createStrokePracticeSVG(
  character: string,
  options: {
    width: number;
    height: number;
    strokeWidth: number;
    strokeColor: string;
    strokeOpacity: number;
    animation?: boolean;
    showOrder?: boolean;
    showStrokeNames?: boolean;
  } = {}
): string {
  // 获取笔画数据
  const strokeData = getStrokeData(character);
  if (!strokeData) {
    return '';
  }
  
  const {
    width = 100, 
    height = 100, 
    strokeWidth = 2,
    strokeColor = '#333',
    strokeOpacity = 0.8,
    animation = true,
    showOrder = false,
    showStrokeNames = false
  } = options;
  
  // 生成基本SVG
  let svg = generateStrokeSVG(strokeData, {
    width,
    height,
    strokeWidth,
    strokeColor,
    strokeOpacity,
    animation,
    showOrder
  });
  
  // 如果需要显示笔画名称，添加额外信息
  if (showStrokeNames && strokeData.strokeNames && strokeData.strokeNames.length > 0) {
    // 在底部添加笔画名称列表
    const textY = height - 10;
    const strokeNamesString = strokeData.strokeNames.join('·');
    
    // 移除最后的</svg>标签，添加文本，然后重新添加</svg>
    svg = svg.substring(0, svg.length - 6) + 
      `<text x="${width/2}" y="${textY}" font-size="${strokeWidth * 3}" fill="${strokeColor}" text-anchor="middle" opacity="0.7">${strokeNamesString}</text></svg>`;
  }
  
  return svg;
}