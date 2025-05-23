<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElSlider, ElColorPicker, ElTooltip } from 'element-plus'
import { 
  Crop, 
  Operation, 
  Picture, 
  Refresh, 
  Download, 
  Upload, 
  ZoomIn, 
  ZoomOut,
  Brush,
  Histogram
} from '@element-plus/icons-vue'

// 编辑状态
const imageUrl = ref('https://picsum.photos/800/600')
const brightness = ref(0)
const contrast = ref(0)
const saturation = ref(0)
const zoom = ref(100)
const rotation = ref(0)
const selectedTool = ref('crop')

// 工具栏选项
const tools = [
  { name: 'crop', icon: Crop, label: '裁剪' },
  { name: 'adjust', icon: Operation, label: '调整' },
  { name: 'filter', icon: Picture, label: '滤镜' },
  { name: 'draw', icon: Brush, label: '绘画' },
  { name: 'histogram', icon: Histogram, label: '直方图' }
]

// 滤镜预设
const filters = [
  { name: '原图', value: 'none' },
  { name: '黑白', value: 'grayscale' },
  { name: '复古', value: 'sepia' },
  { name: '冷色调', value: 'cool' },
  { name: '暖色调', value: 'warm' }
]

// 调整图片
const adjustImage = (type: string, value: number) => {
  switch (type) {
    case 'brightness':
      brightness.value = value
      break
    case 'contrast':
      contrast.value = value
      break
    case 'saturation':
      saturation.value = value
      break
  }
}

// 缩放图片
const zoomImage = (delta: number) => {
  zoom.value = Math.max(50, Math.min(200, zoom.value + delta))
}

// 旋转图片
const rotateImage = (angle: number) => {
  rotation.value = (rotation.value + angle) % 360
}

// 重置编辑
const resetEdit = () => {
  brightness.value = 0
  contrast.value = 0
  saturation.value = 0
  zoom.value = 100
  rotation.value = 0
}

// 保存编辑
const saveEdit = () => {
  // 实现保存逻辑
  console.log('保存编辑')
}

// 导出图片
const exportImage = () => {
  // 实现导出逻辑
  console.log('导出图片')
}
</script>

<template>
  <div class="editor-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="tool-group">
        <el-tooltip
          v-for="tool in tools"
          :key="tool.name"
          :content="tool.label"
          placement="bottom"
        >
          <el-button
            :icon="tool.icon"
            circle
            :class="{ active: selectedTool === tool.name }"
            @click="selectedTool = tool.name"
          />
        </el-tooltip>
      </div>

      <div class="action-group">
        <el-tooltip content="重置" placement="bottom">
          <el-button :icon="Refresh" circle @click="resetEdit" />
        </el-tooltip>
        <el-tooltip content="保存" placement="bottom">
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </el-tooltip>
        <el-tooltip content="导出" placement="bottom">
          <el-button :icon="Download" circle @click="exportImage" />
        </el-tooltip>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-content">
      <!-- 左侧工具面板 -->
      <div class="tool-panel" v-if="selectedTool !== 'crop'">
        <template v-if="selectedTool === 'adjust'">
          <div class="adjust-group">
            <h4>亮度</h4>
            <el-slider
              v-model="brightness"
              :min="-100"
              :max="100"
            />
          </div>
          <div class="adjust-group">
            <h4>对比度</h4>
            <el-slider
              v-model="contrast"
              :min="-100"
              :max="100"
            />
          </div>
          <div class="adjust-group">
            <h4>饱和度</h4>
            <el-slider
              v-model="saturation"
              :min="-100"
              :max="100"
            />
          </div>
        </template>

        <template v-if="selectedTool === 'filter'">
          <div class="filter-group">
            <div
              v-for="filter in filters"
              :key="filter.name"
              class="filter-item"
              :class="{ active: filter.value === 'none' }"
            >
              <div class="filter-preview" :class="filter.value">
                <img :src="imageUrl" alt="filter preview" />
              </div>
              <span>{{ filter.name }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- 图片编辑区域 -->
      <div class="image-editor">
        <div class="image-container" :style="{
          transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
          filter: `brightness(${brightness + 100}%) contrast(${contrast + 100}%) saturate(${saturation + 100}%)`
        }">
          <img :src="imageUrl" alt="editing image" />
        </div>
      </div>

      <!-- 右侧缩放控制 -->
      <div class="zoom-controls">
        <el-tooltip content="缩小" placement="left">
          <el-button :icon="ZoomOut" circle @click="zoomImage(-10)" />
        </el-tooltip>
        <span>{{ zoom }}%</span>
        <el-tooltip content="放大" placement="left">
          <el-button :icon="ZoomIn" circle @click="zoomImage(10)" />
        </el-tooltip>
        <el-tooltip content="旋转" placement="left">
          <el-button :icon="Refresh" circle @click="rotateImage(90)" />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1e1e1e;
}

.toolbar {
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}

.tool-group {
  display: flex;
  gap: 8px;
}

.action-group {
  display: flex;
  gap: 8px;
}

.tool-group .el-button.active {
  background-color: #1a73e8;
  color: #fff;
}

.editor-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.tool-panel {
  width: 280px;
  padding: 24px;
  background-color: #2d2d2d;
  border-right: 1px solid #3d3d3d;
  overflow-y: auto;
}

.adjust-group {
  margin-bottom: 24px;
}

.adjust-group h4 {
  margin: 0 0 12px;
  color: #fff;
  font-size: 14px;
}

.image-editor {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #1e1e1e;
}

.image-container {
  position: relative;
  transition: transform 0.3s;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.zoom-controls {
  width: 64px;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background-color: #2d2d2d;
  border-left: 1px solid #3d3d3d;
}

.zoom-controls span {
  color: #fff;
  font-size: 14px;
}

.filter-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.filter-item {
  cursor: pointer;
  text-align: center;
}

.filter-preview {
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 8px;
  border-radius: 8px;
  overflow: hidden;
}

.filter-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.filter-item span {
  color: #fff;
  font-size: 12px;
}

.filter-item.active .filter-preview {
  border: 2px solid #1a73e8;
}

/* 滤镜效果 */
.grayscale {
  filter: grayscale(100%);
}

.sepia {
  filter: sepia(100%);
}

.cool {
  filter: hue-rotate(180deg);
}

.warm {
  filter: sepia(30%) saturate(150%);
}
</style> 