<template>
    <div class="character-grid-container" :style="containerStyle">
        <!-- 网格背景 -->
        <div class="character-grid" ref="gridRef"></div>

        <!-- 汉字 -->
        <div class="character" :style="characterStyle">
            {{ character }}
        </div>

        <!-- 笔画显示层 -->
        <svg v-if="showStrokes && hasStrokeData" class="stroke-layer" :viewBox="`0 0 100 100`"
            xmlns="http://www.w3.org/2000/svg">
            <g v-for="(stroke, index) in strokes" :key="index">
                <path :d="stroke.path" :stroke="strokeColors ? getStrokeColor(stroke.type) : '#333'" :stroke-width="2"
                    fill="none" stroke-linecap="round" stroke-linejoin="round" :style="{ opacity: strokeOpacity }" />

                <!-- 笔顺序号 -->
                <text v-if="strokeNumbering" :x="getStrokeNumberPosition(stroke.path).x"
                    :y="getStrokeNumberPosition(stroke.path).y" font-size="8"
                    :fill="strokeColors ? getStrokeColor(stroke.type) : '#333'" text-anchor="middle"
                    dominant-baseline="middle" :style="{ opacity: strokeOpacity }">{{ index + 1 }}</text>
            </g>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useHanziStore } from '@/stores/hanziStore';
import StrokeService from '@/services/strokeService';
import GridService from '@/services/gridService';
import type { StrokeType } from '@/types';

const props = defineProps<{
    character: string;
}>();

const store = useHanziStore();
const settings = computed(() => store.settings);
const gridRef = ref<HTMLElement | null>(null);

// 网格容器样式
const containerStyle = computed(() => {
    return {
        width: `${settings.value.gridSize}px`,
        height: `${settings.value.gridSize}px`,
        position: 'relative',
    };
});

// 汉字样式
const characterStyle = computed(() => {
    return {
        fontFamily: store.currentFont.family,
        fontSize: `${settings.value.fontSize}px`,
        color: settings.value.fontColor,
        opacity: settings.value.fontOpacity,
    };
});

// 笔画相关
const showStrokes = computed(() => settings.value.showStrokes);
const strokeNumbering = computed(() => settings.value.strokeNumbering);
const strokeColors = computed(() => settings.value.strokeColors);
const strokeOpacity = computed(() => settings.value.strokeOpacity);

// 检查是否有笔画数据
const hasStrokeData = computed(() => {
    return StrokeService.hasStrokeData(props.character);
});

// 获取笔画数据
const strokes = computed(() => {
    if (!hasStrokeData.value) return [];

    const strokeData = StrokeService.getStrokeData(props.character);
    return strokeData ? strokeData.strokes : [];
});

// 获取笔画颜色
const getStrokeColor = (type: StrokeType): string => {
    return StrokeService.getStrokeColor(type);
};

// 获取笔顺序号位置（取笔画路径的起始点）
const getStrokeNumberPosition = (path: string): { x: number, y: number } => {
    try {
        // 简单解析路径的起始点坐标
        const match = path.match(/[Mm]\s*(\d+)\s*,\s*(\d+)/);
        if (match && match.length >= 3) {
            return {
                x: parseInt(match[1]),
                y: parseInt(match[2])
            };
        }
    } catch (e) {
        console.error('解析笔画路径失败', e);
    }

    // 默认位置（中心）
    return { x: 50, y: 50 };
};

// 绘制网格
const drawGrid = () => {
    if (!gridRef.value) return;

    const gridElement = gridRef.value;

    // 使用GridService生成网格样式
    const gridCSSVariables = {
        '--grid-line-width': `${settings.value.gridLineWidth}px`,
        '--grid-line-color': settings.value.gridLineColor,
        '--grid-line-style': settings.value.gridLineStyle,
    };

    // 设置CSS变量
    Object.entries(gridCSSVariables).forEach(([key, value]) => {
        gridElement.style.setProperty(key, value);
    });

    // 添加网格类型类名
    gridElement.className = `character-grid grid-${settings.value.gridType}`;

    // 添加辅助线类名
    if (settings.value.gridSublines) {
        gridElement.classList.add('with-sublines');
    } else {
        gridElement.classList.remove('with-sublines');
    }
};

// 监听设置变化，更新网格
watch(
    () => [
        settings.value.gridType,
        settings.value.gridLineWidth,
        settings.value.gridLineColor,
        settings.value.gridLineStyle,
        settings.value.gridSize,
        settings.value.gridSublines
    ],
    () => {
        drawGrid();
    }
);

// 初始化
onMounted(() => {
    drawGrid();
});
</script>

<style scoped>
.character-grid-container {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
}

.character-grid {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    pointer-events: none;
}

.character {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    user-select: none;
}

.stroke-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
}

/* 田字格 */
.grid-tian {
    border: var(--grid-line-width) var(--grid-line-style) var(--grid-line-color);
}

.grid-tian.with-sublines::before,
.grid-tian.with-sublines::after {
    content: '';
    position: absolute;
    background-color: var(--grid-line-color);
}

.grid-tian.with-sublines::before {
    width: 100%;
    height: var(--grid-line-width);
    top: 50%;
    left: 0;
    transform: translateY(-50%);
}

.grid-tian.with-sublines::after {
    width: var(--grid-line-width);
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
}

/* 米字格 */
.grid-mi {
    border: var(--grid-line-width) var(--grid-line-style) var(--grid-line-color);
}

.grid-mi.with-sublines {
    position: relative;
}

.grid-mi.with-sublines::before,
.grid-mi.with-sublines::after {
    content: '';
    position: absolute;
    background-color: var(--grid-line-color);
}

/* 十字线 */
.grid-mi.with-sublines::before {
    width: 100%;
    height: var(--grid-line-width);
    top: 50%;
    left: 0;
    transform: translateY(-50%);
}

.grid-mi.with-sublines::after {
    width: var(--grid-line-width);
    height: 100%;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
}

/* 对角线 - 使用伪元素添加 */
.grid-mi.with-sublines {
    background:
        /* 从左上到右下的对角线 */
        linear-gradient(45deg, transparent calc(50% - var(--grid-line-width) / 2), var(--grid-line-color) calc(50% - var(--grid-line-width) / 2), var(--grid-line-color) calc(50% + var(--grid-line-width) / 2), transparent calc(50% + var(--grid-line-width) / 2)),
        /* 从右上到左下的对角线 */
        linear-gradient(-45deg, transparent calc(50% - var(--grid-line-width) / 2), var(--grid-line-color) calc(50% - var(--grid-line-width) / 2), var(--grid-line-color) calc(50% + var(--grid-line-width) / 2), transparent calc(50% + var(--grid-line-width) / 2));
}

/* 回宫格 */
.grid-hui {
    border: var(--grid-line-width) var(--grid-line-style) var(--grid-line-color);
    position: relative;
}

.grid-hui::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    box-sizing: border-box;
    border: var(--grid-line-width) var(--grid-line-style) var(--grid-line-color);
}

.grid-hui.with-sublines::after {
    content: '';
    position: absolute;
    background-color: var(--grid-line-color);
    width: 100%;
    height: var(--grid-line-width);
    top: 50%;
    left: 0;
    transform: translateY(-50%);
}

/* 水平十字线使用background添加 */
.grid-hui.with-sublines {
    background: linear-gradient(to bottom, transparent calc(50% - var(--grid-line-width) / 2), var(--grid-line-color) calc(50% - var(--grid-line-width) / 2), var(--grid-line-color) calc(50% + var(--grid-line-width) / 2), transparent calc(50% + var(--grid-line-width) / 2));
}

/* 九宫格 */
.grid-jiu {
    border: var(--grid-line-width) var(--grid-line-style) var(--grid-line-color);
    background:
        /* 垂直线 */
        linear-gradient(to right,
            transparent calc(33.33% - var(--grid-line-width) / 2),
            var(--grid-line-color) calc(33.33% - var(--grid-line-width) / 2),
            var(--grid-line-color) calc(33.33% + var(--grid-line-width) / 2),
            transparent calc(33.33% + var(--grid-line-width) / 2)),
        linear-gradient(to right,
            transparent calc(66.66% - var(--grid-line-width) / 2),
            var(--grid-line-color) calc(66.66% - var(--grid-line-width) / 2),
            var(--grid-line-color) calc(66.66% + var(--grid-line-width) / 2),
            transparent calc(66.66% + var(--grid-line-width) / 2)),
        /* 水平线 */
        linear-gradient(to bottom,
            transparent calc(33.33% - var(--grid-line-width) / 2),
            var(--grid-line-color) calc(33.33% - var(--grid-line-width) / 2),
            var(--grid-line-color) calc(33.33% + var(--grid-line-width) / 2),
            transparent calc(33.33% + var(--grid-line-width) / 2)),
        linear-gradient(to bottom,
            transparent calc(66.66% - var(--grid-line-width) / 2),
            var(--grid-line-color) calc(66.66% - var(--grid-line-width) / 2),
            var(--grid-line-color) calc(66.66% + var(--grid-line-width) / 2),
            transparent calc(66.66% + var(--grid-line-width) / 2));
}

/* 钩线格 */
.grid-gou {
    border: var(--grid-line-width) var(--grid-line-style) var(--grid-line-color);
    position: relative;
}

.grid-gou::before,
.grid-gou::after {
    content: '';
    position: absolute;
    background-color: var(--grid-line-color);
}

/* 顶部钩线 */
.grid-gou::before {
    width: var(--grid-line-width);
    height: 25%;
    top: 0;
    left: 25%;
}

/* 左侧钩线 */
.grid-gou::after {
    width: 25%;
    height: var(--grid-line-width);
    top: 25%;
    left: 0;
}

/* 方格 */
.grid-fang {
    border: var(--grid-line-width) var(--grid-line-style) var(--grid-line-color);
}

/* 横线格 */
.grid-heng {
    border: none;
    border-bottom: var(--grid-line-width) var(--grid-line-style) var(--grid-line-color);
}

/* 中线格 */
.grid-zhong {
    border: none;
    border-bottom: var(--grid-line-width) var(--grid-line-style) var(--grid-line-color);
    position: relative;
}

.grid-zhong::after {
    content: '';
    position: absolute;
    width: 100%;
    height: calc(var(--grid-line-width) * 0.6);
    background-color: var(--grid-line-color);
    top: 50%;
    left: 0;
    transform: translateY(-50%);
}

@media print {
    .character-grid {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }

    .character {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }

    .stroke-layer {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
    }
}
</style>