import type { StrokeData, Stroke, StrokeType } from "@/types";

// 这是一个简单的笔画服务，实际应用中可能需要更复杂的实现或使用API
// 这里只提供几个常用汉字的笔画数据示例

// 笔画类型映射
const strokeTypeMap: Record<string, StrokeType> = {
  h: "horizontal", // 横
  v: "vertical", // 竖
  s: "left-falling", // 撇
  n: "right-falling", // 捺
  r: "rising", // 提
  d: "dot", // 点
  k: "hook", // 钩
  o: "other", // 其他
};

// 简单的笔画数据样例（实际应用中应该有更完整的数据集或API调用）
// 格式：[汉字, 笔画类型序列, 笔画路径序列]
const sampleStrokeData: [string, string[], string[]][] = [
  [
    "永",
    ["d", "h", "s", "n", "v", "h", "h"],
    [
      "M30,30 Q35,25 40,30",
      "M25,40 L75,40",
      "M70,30 Q60,60 30,80",
      "M40,50 Q60,70 80,90",
      "M50,40 L50,85",
      "M40,65 L60,65",
      "M35,85 L65,85",
    ],
  ],
  [
    "和",
    ["h", "v", "h", "s", "h", "s", "h", "v", "n", "h"],
    [
      "M15,25 L40,25",
      "M30,25 L30,90",
      "M15,40 L45,40",
      "M42,40 Q35,65 25,75",
      "M50,30 L85,30",
      "M80,30 Q70,50 60,60",
      "M55,50 L80,50",
      "M70,50 L70,85",
      "M55,65 Q65,75 80,85",
      "M60,85 L80,85",
    ],
  ],
  ["人", ["s", "n"], ["M40,20 Q35,50 20,80", "M50,20 Q60,50 80,80"]],
  [
    "大",
    ["h", "s", "n"],
    ["M30,30 L70,30", "M30,30 Q30,60 20,90", "M70,30 Q75,60 80,90"],
  ],
  [
    "中",
    ["v", "h", "h", "v", "h"],
    [
      "M50,15 L50,85",
      "M20,35 L80,35",
      "M20,50 L80,50",
      "M30,50 L30,85",
      "M20,85 L80,85",
    ],
  ],
  [
    "会",
    ["h", "v", "h", "h", "s", "v", "n"],
    [
      "M20,20 L80,20",
      "M50,20 L50,35",
      "M30,35 L70,35",
      "M20,50 L80,50",
      "M70,50 Q60,65 50,80",
      "M40,50 L40,80",
      "M30,65 Q40,75 60,80",
    ],
  ],
  [
    "于",
    ["h", "v", "s", "n"],
    [
      "M20,30 L80,30",
      "M50,30 L50,60",
      "M50,60 Q40,70 20,80",
      "M50,60 Q65,70 80,80",
    ],
  ],
  [
    "山",
    ["h", "s", "n"],
    ["M15,40 L85,40", "M30,40 Q40,65 25,85", "M70,40 Q60,65 75,85"],
  ],
  [
    "修",
    ["s", "h", "s", "h", "v", "s", "n", "h", "v"],
    [
      "M20,20 Q25,30 30,40",
      "M15,40 L45,40",
      "M15,55 Q30,65 40,80",
      "M50,25 L85,25",
      "M70,25 L70,50",
      "M70,50 Q65,60 55,70",
      "M70,50 Q75,60 85,70",
      "M55,85 L85,85",
      "M70,70 L70,85",
    ],
  ],
  [
    "行",
    ["s", "h", "v", "s", "n", "h"],
    [
      "M30,25 Q40,35 45,45",
      "M25,45 L65,45",
      "M45,25 L45,85",
      "M45,65 Q40,75 30,85",
      "M45,65 Q55,75 65,85",
      "M30,65 L60,65",
    ],
  ],
];

// 构建汉字笔画数据映射
const strokeDataMap = new Map<string, StrokeData>();

sampleStrokeData.forEach(([char, types, paths]) => {
  const strokes: Stroke[] = types.map((type, index) => ({
    type: strokeTypeMap[type] || "other",
    path: paths[index],
  }));

  strokeDataMap.set(char, {
    character: char,
    strokes,
  });
});

export const StrokeService = {
  // 获取汉字的笔画数据
  getStrokeData(character: string): StrokeData | null {
    return strokeDataMap.get(character) || null;
  },

  // 检查是否有指定汉字的笔画数据
  hasStrokeData(character: string): boolean {
    return strokeDataMap.has(character);
  },

  // 获取笔画类型对应的颜色
  getStrokeColor(type: StrokeType): string {
    const colorMap: Record<StrokeType, string> = {
      horizontal: "#FF5252", // 红色
      vertical: "#2196F3", // 蓝色
      "left-falling": "#4CAF50", // 绿色
      "right-falling": "#FFC107", // 黄色
      rising: "#9C27B0", // 紫色
      dot: "#FF9800", // 橙色
      hook: "#795548", // 棕色
      other: "#607D8B", // 蓝灰色
    };

    return colorMap[type];
  },

  // 获取笔画类型的中文名称
  getStrokeTypeName(type: StrokeType): string {
    const nameMap: Record<StrokeType, string> = {
      horizontal: "横",
      vertical: "竖",
      "left-falling": "撇",
      "right-falling": "捺",
      rising: "提",
      dot: "点",
      hook: "钩",
      other: "其他",
    };

    return nameMap[type];
  },
};

export default StrokeService;
