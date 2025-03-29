/**
 * 自定义字体信息
 */
export interface CustomFont {
    name: string;
    family: string;
    url: string;
    type?: string; // 'woff2' | 'woff' | 'ttf' | 'otf'
  }
  
  /**
   * 加载自定义字体
   * @param font 字体信息
   * @returns 加载状态的Promise
   */
  export async function loadCustomFont(font: CustomFont): Promise<FontFace> {
    try {
      // 创建FontFace实例
      const fontFace = new FontFace(font.family, `url(${font.url})`, {
        style: 'normal',
        weight: 'normal',
        display: 'swap'
      });
      
      // 加载字体
      const loadedFont = await fontFace.load();
      
      // 添加到document.fonts
      document.fonts.add(loadedFont);
      
      console.log(`Font '${font.name}' loaded successfully`);
      return loadedFont;
    } catch (error) {
      console.error(`Error loading font '${font.name}':`, error);
      throw error;
    }
  }
  
  /**
   * 从File对象加载字体
   * @param file 字体文件
   * @param fontName 自定义字体名称
   * @returns 加载结果
   */
  export async function loadFontFromFile(file: File, fontName?: string): Promise<{ success: boolean; fontFamily: string; url?: string; error?: any }> {
    try {
      // 检查文件类型
      const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        return {
          success: false,
          fontFamily: '',
          error: new Error(`不支持的字体文件格式: ${fileExtension}。请使用 TTF, OTF, WOFF 或 WOFF2 格式。`)
        };
      }
      
      // 创建blob URL
      const url = URL.createObjectURL(file);
      const fileName = file.name;
      let customFontName = fontName || fileName.replace(/\.[^/.]+$/, "");
      const fontFamily = `CustomFont-${Date.now()}-${fileName.replace(/\.[^/.]+$/, "")}`;
      
      // 加载字体
      const font: CustomFont = {
        name: customFontName,
        family: fontFamily,
        url: url,
        type: fileExtension.replace('.', '') as string
      };
      
      await loadCustomFont(font);
      
      return {
        success: true,
        fontFamily: font.family,
        url: url
      };
    } catch (error) {
      console.error('Error loading font from file:', error);
      return {
        success: false,
        fontFamily: '',
        error
      };
    }
  }
  
  /**
   * 检测字体是否已加载
   * @param fontFamily 字体系列名称
   * @returns 是否已加载
   */
  export function isFontLoaded(fontFamily: string): boolean {
    return document.fonts.check(`12px ${fontFamily}`);
  }
  
  /**
   * 创建样式标签并添加到文档头部
   * @param styles CSS样式内容
   * @param id 样式标签ID (可选)
   * @returns 创建的style元素
   */
  export function createStyleElement(styles: string, id?: string): HTMLStyleElement {
    // 检查是否已存在同ID的style元素
    if (id) {
      const existingStyle = document.getElementById(id) as HTMLStyleElement;
      if (existingStyle) {
        existingStyle.textContent = styles;
        return existingStyle;
      }
    }
    
    // 创建新的style元素
    const style = document.createElement('style');
    style.textContent = styles;
    
    if (id) {
      style.id = id;
    }
    
    // 添加到文档头部
    document.head.appendChild(style);
    
    return style;
  }
  
  /**
   * 创建并添加字体定义的样式
   * @param font 字体信息
   * @returns 创建的style元素
   */
  export function addFontFaceStyle(font: CustomFont): HTMLStyleElement {
    const fontFaceCSS = `
      @font-face {
        font-family: '${font.family}';
        src: url('${font.url}') format('${font.type || 'truetype'}');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    
    const id = `font-face-${font.family}`;
    return createStyleElement(fontFaceCSS, id);
  }
  
  /**
   * 从URL加载字体文件
   * @param url 字体文件URL
   * @param fontName 字体名称
   * @param fontFamily 字体系列
   * @returns 加载结果Promise
   */
  export async function loadFontFromUrl(url: string, fontName: string, fontFamily?: string): Promise<{ success: boolean; fontFamily: string; error?: any }> {
    try {
      // 如果没有提供fontFamily，创建一个唯一的标识符
      const family = fontFamily || `Font-${Date.now()}-${fontName.replace(/\s+/g, '-')}`;
      
      // 从URL确定字体格式
      const fileExtension = url.substring(url.lastIndexOf('.')).toLowerCase();
      const fontType = fileExtension.replace('.', '');
      
      // 加载字体
      const font: CustomFont = {
        name: fontName,
        family,
        url,
        type: fontType
      };
      
      await loadCustomFont(font);
      addFontFaceStyle(font);
      
      return {
        success: true,
        fontFamily: family
      };
    } catch (error) {
      console.error('Error loading font from URL:', error);
      return {
        success: false,
        fontFamily: '',
        error
      };
    }
  }
  
  /**
   * 预加载系统字体以确保可用性
   * @param fontFamilies 字体系列名称数组
   */
  export function preloadSystemFonts(fontFamilies: string[]): void {
    // 创建一个不可见的div来测试字体
    const testDiv = document.createElement('div');
    testDiv.style.position = 'absolute';
    testDiv.style.visibility = 'hidden';
    testDiv.style.top = '-9999px';
    testDiv.style.left = '-9999px';
    document.body.appendChild(testDiv);
    
    // 为每个字体创建一个测试元素
    fontFamilies.forEach(family => {
      const testEl = document.createElement('span');
      testEl.textContent = '字体预加载测试';
      testEl.style.fontFamily = family;
      testDiv.appendChild(testEl);
    });
    
    // 短暂延迟后移除测试元素
    setTimeout(() => {
      document.body.removeChild(testDiv);
    }, 100);
  }