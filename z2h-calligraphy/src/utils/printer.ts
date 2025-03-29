import { useSettingsStore } from '@/stores/settings'

interface PrintOptions {
  title?: string;
  content?: HTMLElement | null;
  addStyles?: string;
  removeSelectors?: string[];
  callback?: () => void;
}

/**
 * 打印指定内容
 * @param options 打印选项
 */
export function printContent(options: PrintOptions = {}) {
  const settingsStore = useSettingsStore()
  const printSettings = settingsStore.printSettings
  
  const defaultOptions: PrintOptions = {
    title: document.title,
    content: null,
    addStyles: '',
    removeSelectors: ['.app-header', '.control-panel', '.n-button', '.panel-section', '.n-modal'],
    callback: () => {}
  }
  
  const mergedOptions = { ...defaultOptions, ...options }
  
  // 如果没有指定内容，默认尝试查找预览区域
  if (!mergedOptions.content) {
    mergedOptions.content = document.querySelector('.paper')
  }
  
  // 如果找不到内容，直接返回
  if (!mergedOptions.content) {
    console.error('无法找到要打印的内容')
    return
  }
  
  // 创建打印框架
  const printFrame = document.createElement('iframe')
  printFrame.style.position = 'fixed'
  printFrame.style.right = '0'
  printFrame.style.bottom = '0'
  printFrame.style.width = '0'
  printFrame.style.height = '0'
  printFrame.style.border = '0'
  
  document.body.appendChild(printFrame)
  
  // 获取打印框架的document对象
  const frameWindow = printFrame.contentWindow
  const frameDocument = frameWindow?.document
  
  if (!frameDocument) {
    console.error('无法创建打印框架')
    return
  }
  
  // 写入打印内容
  frameDocument.open()
  frameDocument.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${mergedOptions.title}</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- Basic styles will be added below, plus copied stylesheets -->
    </head>
    <body>
      <div class="print-content"></div>
    </body>
    </html>
  `)

  // === Copy stylesheets from main document to iframe ===
  const head = frameDocument.head
  if (head) {
    const styles = document.querySelectorAll('style, link[rel="stylesheet"]')
    styles.forEach(styleNode => {
      head.appendChild(styleNode.cloneNode(true))
    })
    
    // Add specific print styles AFTER copying main styles
    const printSpecificStyle = frameDocument.createElement('style')
    printSpecificStyle.textContent = `
      @page {
        size: ${printSettings.paperSize} ${printSettings.orientation};
        margin: ${printSettings.margins.top}mm ${printSettings.margins.right}mm ${printSettings.margins.bottom}mm ${printSettings.margins.left}mm;
        ${!printSettings.headerFooter ? 'margin-header: 0; margin-footer: 0;' : ''}
      }
      body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact; /* Ensure background graphics print */
        print-color-adjust: exact;
      }
      .print-content {
        width: 100%;
        overflow: visible;
      }
      /* Hide elements specifically for print */
      ${mergedOptions.removeSelectors.map(selector => `${selector} { display: none !important; }`).join('\n')}
      /* Page break avoidance */
      .character-cell {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      /* Disable hover effects during print */
      .character-cell:hover {
        transform: none !important;
        box-shadow: none !important;
      }
      /* Add user-provided extra styles */
      ${mergedOptions.addStyles}
    `;
    head.appendChild(printSpecificStyle);
  }
  // === End copying stylesheets ===

  frameDocument.close()
  
  // 克隆并添加内容
  const contentClone = mergedOptions.content.cloneNode(true) as HTMLElement
  
  // 移除不需要的元素
  mergedOptions.removeSelectors.forEach(selector => {
    const elementsToRemove = contentClone.querySelectorAll(selector)
    elementsToRemove.forEach(element => {
      element.parentNode?.removeChild(element)
    })
  })
  
  // 将内容添加到打印框架
  const printContentContainer = frameDocument.querySelector('.print-content')
  if (printContentContainer) {
    printContentContainer.appendChild(contentClone)
  }
  
  // 等待图片和资源加载完成
  setTimeout(() => {
    // 调用打印
    frameWindow?.focus()
    frameWindow?.print()
    
    // 打印完成后移除打印框架
    setTimeout(() => {
      document.body.removeChild(printFrame)
      
      // 执行回调
      if (typeof mergedOptions.callback === 'function') {
        mergedOptions.callback()
      }
    }, 1000)
  }, 500)
}

/**
 * 导出为PDF
 * 注意: 这实际上也是调用打印功能，但提示用户保存为PDF
 * @param title PDF文档标题
 * @param content 要导出的HTML内容
 */
export function exportAsPDF(title: string, content: HTMLElement | null = null) {
  printContent({
    title,
    content,
    addStyles: `
      @media print {
        body { -webkit-print-color-adjust: exact; color-adjust: exact; }
      }
    `,
    callback: () => {
      console.log('PDF导出成功')
    }
  })
}