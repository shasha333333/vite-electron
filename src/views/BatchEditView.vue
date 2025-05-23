<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElButton, ElSlider, ElCheckbox, ElMessage } from 'element-plus'
import { 
  Refresh, 
  Download, 
  Delete, 
  Picture, 
  VideoCamera,
  ZoomIn,
  ZoomOut
} from '@element-plus/icons-vue'
import type { Photo } from '../types/photo'
import type { CheckboxValueType } from 'element-plus'

// 编辑参数类型定义
interface EditParams {
  brightness: number
  contrast: number
  saturation: number
  resize: number
  quality: number
  format: string
}

// 状态
const selectedPhotos = ref<Photo[]>([])
const editParams = ref<EditParams>({
  brightness: 100,
  contrast: 100,
  saturation: 100,
  resize: 100,
  quality: 80,
  format: 'jpeg'
})

// 预览缩放
const previewZoom = ref(100)

// 计算属性
const selectedCount = computed(() => selectedPhotos.value.length)

// 方法
const handleParamChange = (param: keyof EditParams, value: number) => {
  (editParams.value[param] as number) = value
}

const handleSelectAll = (val: CheckboxValueType) => {
  // 实现全选逻辑
  console.log('Select all:', val)
}

// 预览缩放
const zoomPreview = (delta: number) => {
  previewZoom.value = Math.max(50, Math.min(200, previewZoom.value + delta))
}

const applyEdit = () => {
  ElMessage.success('批量编辑已应用')
}

const exportPhotos = () => {
  ElMessage.success('照片已导出')
}

const deletePhotos = () => {
  ElMessage.success('照片已删除')
}

const resetEdit = () => {
  editParams.value = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    resize: 100,
    quality: 80,
    format: 'jpeg'
  }
}
</script>

<template>
  <div class="batch-edit">
    <div class="toolbar">
      <div class="left">
        <el-checkbox
          :model-value="selectedCount > 0"
          @change="handleSelectAll"
        >
          全选 ({{ selectedCount }})
        </el-checkbox>
      </div>
      <div class="right">
        <el-button type="primary" @click="applyEdit">应用编辑</el-button>
        <el-button @click="exportPhotos">导出</el-button>
        <el-button type="danger" @click="deletePhotos">删除</el-button>
      </div>
    </div>

    <div class="content">
      <div class="edit-panel">
        <h3>编辑参数</h3>
        <div class="param-item">
          <span>亮度</span>
          <el-slider
            v-model="editParams.brightness"
            :min="0"
            :max="200"
            @change="(val) => handleParamChange('brightness', val as number)"
          />
        </div>
        <div class="param-item">
          <span>对比度</span>
          <el-slider
            v-model="editParams.contrast"
            :min="0"
            :max="200"
            @change="(val) => handleParamChange('contrast', val as number)"
          />
        </div>
        <div class="param-item">
          <span>饱和度</span>
          <el-slider
            v-model="editParams.saturation"
            :min="0"
            :max="200"
            @change="(val) => handleParamChange('saturation', val as number)"
          />
        </div>
        <div class="param-item">
          <span>缩放</span>
          <el-slider
            v-model="editParams.resize"
            :min="10"
            :max="200"
            @change="(val) => handleParamChange('resize', val as number)"
          />
        </div>
        <div class="param-item">
          <span>质量</span>
          <el-slider
            v-model="editParams.quality"
            :min="0"
            :max="100"
            @change="(val) => handleParamChange('quality', val as number)"
          />
        </div>
        <el-button @click="resetEdit">重置</el-button>
      </div>

      <div class="preview-panel">
        <h3>预览</h3>
        <div class="preview-toolbar">
          <div class="zoom-controls">
            <el-button :icon="ZoomOut" circle @click="zoomPreview(-10)" />
            <span>{{ previewZoom }}%</span>
            <el-button :icon="ZoomIn" circle @click="zoomPreview(10)" />
          </div>
        </div>
        <div class="photo-grid">
          <div
            v-for="photo in selectedPhotos"
            :key="photo.id"
            class="photo-item"
          >
            <img :src="photo.url" :alt="photo.name" />
            <div class="photo-info">
              <span class="photo-name">{{ photo.name }}</span>
              <span class="photo-size">{{ photo.size }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.batch-edit {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.toolbar {
  padding: 16px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.edit-panel {
  width: 300px;
  padding: 16px;
  border-right: 1px solid #dcdfe6;
  overflow-y: auto;
}

.preview-panel {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.param-item {
  margin-bottom: 16px;
}

.param-item span {
  display: block;
  margin-bottom: 8px;
  color: #606266;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
}

.photo-item {
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.photo-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.photo-info {
  padding: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.photo-name {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.photo-size {
  font-size: 12px;
  opacity: 0.8;
}

.preview-toolbar {
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-controls span {
  min-width: 48px;
  text-align: center;
  color: #5f6368;
  font-size: 14px;
}
</style> 