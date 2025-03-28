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
  } = {}
): void {
  try {
    // 处理默认选项
    const defaultOptions = {
      clear: true,
      animation: true,
      strokeColor: '#333',
      backgroundColor: 'transparent',
      onComplete: () => {}
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    // 调用CncharService绘制笔顺
    CncharService.drawStroke(character, element, {
      clear: mergedOptions.clear,
      animation: mergedOptions.animation,
      strokeColor: mergedOptions.strokeColor,
      backgroundColor: mergedOptions.backgroundColor
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
 * 生成笔画SVG
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
  }
): string {
  if (!strokeData || !strokeData.medians || strokeData.medians.length === 0) {
    return '';
  }

  const { width, height, strokeWidth, strokeColor, strokeOpacity } = options;
  const animation = options.animation || false;
  const animationDuration = options.animationDuration || 1;
  
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
    
    // 添加路径元素
    if (animation) {
      const totalDuration = animationDuration;
      const delay = (index / strokeData.medians.length) * totalDuration;
      const strokeDuration = totalDuration / strokeData.medians.length;
      
      svg += `
        <path
          d="${pathData}"
          fill="none"
          stroke="${strokeColor}"
          stroke-width="${strokeWidth}"
          stroke-opacity="${strokeOpacity}"
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
          stroke="${strokeColor}"
          stroke-width="${strokeWidth}"
          stroke-opacity="${strokeOpacity}"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
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
  }
): string {
  const { width, height, strokeWidth, strokeColor, strokeOpacity } = options;
  const repeat = options.repeat || 1;
  
  // 创建SVG容器
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">`;
  
  // 根据图案类型生成不同的路径
  switch (pattern) {
    case 'horizontal-line':
      for (let i = 0; i < repeat; i++) {
        const y = 10 + (80 / repeat) * i;
        svg += `<line x1="10" y1="${y}" x2="90" y2="${y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />`;
      }
      break;
      
    case 'vertical-line':
      for (let i = 0; i < repeat; i++) {
        const x = 10 + (80 / repeat) * i;
        svg += `<line x1="${x}" y1="10" x2="${x}" y2="90" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />`;
      }
      break;
      
    case 'diagonal-line':
      for (let i = 0; i < repeat; i++) {
        const offset = (80 / repeat) * i;
        svg += `<line x1="${10 + offset}" y1="10" x2="${90}" y2="${90 - offset}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />`;
      }
      break;
      
    case 'wave':
      for (let i = 0; i < repeat; i++) {
        const y = 20 + (60 / repeat) * i;
        svg += `<path d="M10,${y} C25,${y - 15} 40,${y + 15} 55,${y} C70,${y - 15} 85,${y + 15} 90,${y}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />`;
      }
      break;
      
    case 'zigzag':
      for (let i = 0; i < repeat; i++) {
        const y = 20 + (60 / repeat) * i;
        svg += `<polyline points="10,${y} 25,${y - 10} 40,${y + 10} 55,${y - 10} 70,${y + 10} 85,${y - 10} 90,${y}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />`;
      }
      break;
      
    case 'circle':
      for (let i = 0; i < repeat; i++) {
        const radius = 40 - (30 / repeat) * i;
        svg += `<circle cx="50" cy="50" r="${radius}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />`;
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
      svg += `<path d="${pathData}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />`;
      break;
      
    case 'square':
      for (let i = 0; i < repeat; i++) {
        const size = 80 - (60 / repeat) * i;
        const offset = (80 - size) / 2;
        svg += `<rect x="${10 + offset}" y="${10 + offset}" width="${size}" height="${size}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />`;
      }
      break;
      
    default:
      // 默认绘制一条水平线
      svg += `<line x1="10" y1="50" x2="90" y2="50" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-opacity="${strokeOpacity}" />`;
  }
  
  svg += `</svg>`;
  return svg;
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