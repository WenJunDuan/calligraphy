import type { GridType, LineStyle } from "@/types";

export const GridService = {
  // 生成网格CSS样式对象
  generateGridStyles(
    type: GridType,
    lineWidth: number,
    lineColor: string,
    lineStyle: LineStyle,
    size: number,
    showSublines: boolean
  ): Record<string, any> {
    // 基础样式
    const baseStyles = {
      width: `${size}px`,
      height: `${size}px`,
      position: "relative",
      boxSizing: "border-box",
    };

    // 根据不同网格类型生成样式
    let specificStyles = {};

    switch (type) {
      case "tian":
        specificStyles = this.generateTianGridStyles(
          lineWidth,
          lineColor,
          lineStyle,
          showSublines
        );
        break;
      case "mi":
        specificStyles = this.generateMiGridStyles(
          lineWidth,
          lineColor,
          lineStyle,
          showSublines
        );
        break;
      case "hui":
        specificStyles = this.generateHuiGridStyles(
          lineWidth,
          lineColor,
          lineStyle,
          showSublines
        );
        break;
      case "jiu":
        specificStyles = this.generateJiuGridStyles(
          lineWidth,
          lineColor,
          lineStyle,
          showSublines
        );
        break;
      case "gou":
        specificStyles = this.generateGouGridStyles(
          lineWidth,
          lineColor,
          lineStyle,
          showSublines
        );
        break;
      case "fang":
        specificStyles = this.generateFangGridStyles(
          lineWidth,
          lineColor,
          lineStyle
        );
        break;
      case "heng":
        specificStyles = this.generateHengGridStyles(
          lineWidth,
          lineColor,
          lineStyle
        );
        break;
      case "zhong":
        specificStyles = this.generateZhongGridStyles(
          lineWidth,
          lineColor,
          lineStyle
        );
        break;
      default:
        specificStyles = this.generateTianGridStyles(
          lineWidth,
          lineColor,
          lineStyle,
          showSublines
        );
    }

    return { ...baseStyles, ...specificStyles };
  },

  // 生成田字格样式
  generateTianGridStyles(
    lineWidth: number,
    lineColor: string,
    lineStyle: LineStyle,
    showSublines: boolean
  ): Record<string, any> {
    // 边框样式
    const borderStyle = `${lineWidth}px ${lineStyle} ${lineColor}`;

    const styles: Record<string, any> = {
      border: borderStyle,
      "--grid-line-color": lineColor,
      "--grid-line-width": `${lineWidth}px`,
      "--grid-line-style": lineStyle,
    };

    if (showSublines) {
      styles["&::before"] = {
        content: '""',
        position: "absolute",
        width: "100%",
        height: `${lineWidth}px`,
        top: "50%",
        left: 0,
        transform: "translateY(-50%)",
        backgroundColor: lineColor,
      };

      styles["&::after"] = {
        content: '""',
        position: "absolute",
        width: `${lineWidth}px`,
        height: "100%",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: lineColor,
      };
    }

    return styles;
  },

  // 生成米字格样式
  generateMiGridStyles(
    lineWidth: number,
    lineColor: string,
    lineStyle: LineStyle,
    showSublines: boolean
  ): Record<string, any> {
    // 先添加田字格基础样式
    const baseStyles = this.generateTianGridStyles(
      lineWidth,
      lineColor,
      lineStyle,
      true
    );

    // 添加米字格特有的对角线样式
    const additionalStyles: Record<string, any> = {};

    if (showSublines) {
      // 左上角到右下角的对角线
      additionalStyles["&::before"] = {
        ...baseStyles["&::before"],
        width: "141.4%", // √2 = 1.414，取为141.4%
        transform: "rotate(45deg)",
        transformOrigin: "center",
        top: "50%",
        left: "-20.7%",
      };

      // 右上角到左下角的对角线
      additionalStyles["&::after"] = {
        ...baseStyles["&::after"],
        width: "141.4%",
        transform: "rotate(-45deg)",
        transformOrigin: "center",
        left: "-20.7%",
        top: "50%",
        height: `${lineWidth}px`,
      };

      // 需要添加额外的十字线，因为对角线已经占用了before和after
      additionalStyles.backgroundImage = `
        linear-gradient(to right, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px),
        linear-gradient(to bottom, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px)
      `;
      additionalStyles.backgroundPosition = "center, center";
      additionalStyles.backgroundSize =
        "100% ${lineWidth}px, ${lineWidth}px 100%";
    }

    return { ...baseStyles, ...additionalStyles };
  },

  // 生成回宫格样式
  generateHuiGridStyles(
    lineWidth: number,
    lineColor: string,
    lineStyle: LineStyle,
    showSublines: boolean
  ): Record<string, any> {
    // 边框样式
    const borderStyle = `${lineWidth}px ${lineStyle} ${lineColor}`;

    const styles: Record<string, any> = {
      border: borderStyle,
      position: "relative",
    };

    // 内框
    styles["&::before"] = {
      content: '""',
      position: "absolute",
      top: "20%",
      left: "20%",
      width: "60%",
      height: "60%",
      border: borderStyle,
    };

    // 如果需要显示辅助线（十字）
    if (showSublines) {
      styles["&::after"] = {
        content: '""',
        position: "absolute",
        width: "100%",
        height: `${lineWidth}px`,
        top: "50%",
        left: 0,
        transform: "translateY(-50%)",
        backgroundColor: lineColor,
      };

      // 由于只能有两个伪元素，需要使用背景图来创建另一条辅助线
      styles.backgroundImage = `linear-gradient(to right, ${lineColor} ${lineWidth}px, transparent ${lineWidth}px)`;
      styles.backgroundPosition = "50% 0";
      styles.backgroundSize = `${lineWidth}px 100%`;
      styles.backgroundRepeat = "no-repeat";
    }

    return styles;
  },

  // 生成九宫格样式
  generateJiuGridStyles(
    lineWidth: number,
    lineColor: string,
    lineStyle: LineStyle,
    showSublines: boolean
  ): Record<string, any> {
    // 边框样式
    const borderStyle = `${lineWidth}px ${lineStyle} ${lineColor}`;

    const styles: Record<string, any> = {
      border: borderStyle,
      position: "relative",
    };

    // 九宫格内部线条
    const thinnerLineWidth = Math.max(1, lineWidth * 0.7);

    styles.backgroundImage = `
      linear-gradient(to right, ${lineColor} ${thinnerLineWidth}px, transparent ${thinnerLineWidth}px),
      linear-gradient(to right, ${lineColor} ${thinnerLineWidth}px, transparent ${thinnerLineWidth}px),
      linear-gradient(to bottom, ${lineColor} ${thinnerLineWidth}px, transparent ${thinnerLineWidth}px),
      linear-gradient(to bottom, ${lineColor} ${thinnerLineWidth}px, transparent ${thinnerLineWidth}px)
    `;
    styles.backgroundPosition =
      "calc(33.33% - ${thinnerLineWidth/2}px) 0, calc(66.66% - ${thinnerLineWidth/2}px) 0, 0 calc(33.33% - ${thinnerLineWidth/2}px), 0 calc(66.66% - ${thinnerLineWidth/2}px)";
    styles.backgroundSize = `${thinnerLineWidth}px 100%, ${thinnerLineWidth}px 100%, 100% ${thinnerLineWidth}px, 100% ${thinnerLineWidth}px`;
    styles.backgroundRepeat = "no-repeat, no-repeat, no-repeat, no-repeat";

    return styles;
  },

  // 生成钩线格样式
  generateGouGridStyles(
    lineWidth: number,
    lineColor: string,
    lineStyle: LineStyle,
    showSublines: boolean
  ): Record<string, any> {
    // 边框样式
    const borderStyle = `${lineWidth}px ${lineStyle} ${lineColor}`;

    const styles: Record<string, any> = {
      border: borderStyle,
      position: "relative",
    };

    // 顶部和左侧的钩线
    styles["&::before"] = {
      content: '""',
      position: "absolute",
      top: "0",
      left: "25%",
      width: `${lineWidth}px`,
      height: "25%",
      backgroundColor: lineColor,
    };

    styles["&::after"] = {
      content: '""',
      position: "absolute",
      top: "25%",
      left: "0",
      width: "25%",
      height: `${lineWidth}px`,
      backgroundColor: lineColor,
    };

    return styles;
  },

  // 生成方格样式（简单方格，无内部辅助线）
  generateFangGridStyles(
    lineWidth: number,
    lineColor: string,
    lineStyle: LineStyle
  ): Record<string, any> {
    // 边框样式
    const borderStyle = `${lineWidth}px ${lineStyle} ${lineColor}`;

    return {
      border: borderStyle,
    };
  },

  // 生成横线格样式（仅有横线，类似英文本）
  generateHengGridStyles(
    lineWidth: number,
    lineColor: string,
    lineStyle: LineStyle
  ): Record<string, any> {
    const styles: Record<string, any> = {
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      borderBottom: `${lineWidth}px ${lineStyle} ${lineColor}`,
      backgroundColor: "transparent",
    };

    return styles;
  },

  // 生成中线格样式（含中线的横线格）
  generateZhongGridStyles(
    lineWidth: number,
    lineColor: string,
    lineStyle: LineStyle
  ): Record<string, any> {
    const styles = this.generateHengGridStyles(lineWidth, lineColor, lineStyle);

    styles["&::after"] = {
      content: '""',
      position: "absolute",
      width: "100%",
      height: `${Math.max(1, lineWidth * 0.5)}px`,
      top: "50%",
      left: 0,
      transform: "translateY(-50%)",
      backgroundColor: lineColor,
      borderStyle: lineStyle,
    };

    return styles;
  },

  // 生成用于SVG的网格路径
  generateGridPath(
    type: GridType,
    size: number,
    showSublines: boolean
  ): string {
    const halfSize = size / 2;
    let path = `M0,0 H${size} V${size} H0 Z`; // 外框

    switch (type) {
      case "tian":
        if (showSublines) {
          // 十字线
          path += ` M0,${halfSize} H${size} M${halfSize},0 V${size}`;
        }
        break;
      case "mi":
        if (showSublines) {
          // 十字线
          path += ` M0,${halfSize} H${size} M${halfSize},0 V${size}`;
          // 对角线
          path += ` M0,0 L${size},${size} M${size},0 L0,${size}`;
        }
        break;
      case "hui":
        // 内框
        const inset = size * 0.2;
        path += ` M${inset},${inset} H${size - inset} V${
          size - inset
        } H${inset} Z`;
        if (showSublines) {
          // 十字线
          path += ` M0,${halfSize} H${size} M${halfSize},0 V${size}`;
        }
        break;
      case "jiu":
        // 九宫格内线
        const third = size / 3;
        path += ` M${third},0 V${size} M${third * 2},0 V${size}`;
        path += ` M0,${third} H${size} M0,${third * 2} H${size}`;
        break;
      case "gou":
        // 钩线
        const quarter = size * 0.25;
        path += ` M${quarter},0 V${quarter} M0,${quarter} H${quarter}`;
        break;
      case "heng":
        // 只保留底线，移除其他
        path = `M0,${size} H${size}`;
        break;
      case "zhong":
        // 底线和中线
        path = `M0,${size} H${size} M0,${halfSize} H${size}`;
        break;
      default:
        break;
    }

    return path;
  },
};

export default GridService;
