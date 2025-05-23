<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElInput, ElMessage, ElDialog, ElSelect, ElOption } from 'element-plus'
import { Picture, VideoCamera, Setting, Menu } from '@element-plus/icons-vue'

const props = defineProps<{
  showSidebar: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'select-images'): void
  (e: 'open-settings'): void
  (e: 'search', query: string): void
}>()

const searchQuery = ref('')
const showCameraDialog = ref(false)
const cameraList = ref<string[]>([])
const selectedCamera = ref('')
const isCapturing = ref(false)

// 获取摄像头列表
const loadCameraList = async () => {
  try {
    const devices = await window.electronAPI.getCameraList()
    cameraList.value = devices
    if (devices.length > 0) {
      selectedCamera.value = devices[0]
    }
  } catch (error) {
    console.error('获取摄像头列表失败:', error)
    ElMessage.error('获取摄像头列表失败')
  }
}

// 打开摄像头对话框
const openCameraDialog = async () => {
  showCameraDialog.value = true
  await loadCameraList()
}

// 拍照
const capturePhoto = async () => {
  if (!selectedCamera.value) {
    ElMessage.warning('请先选择摄像头')
    return
  }

  try {
    isCapturing.value = true
    const result = await window.electronAPI.capturePhotoNative()
    ElMessage.success(`照片已保存到: ${result.filePath}`)
  } catch (error) {
    console.error('拍照失败:', error)
    ElMessage.error('拍照失败，请重试')
  } finally {
    isCapturing.value = false
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
  }
}

const handleSelectImages = async () => {
  emit('select-images')
}

const handleSettings = () => {
  emit('open-settings')
}

const toggleSidebar = () => {
  emit('toggle-sidebar')
}
</script>

<template>
  <div class="header">
    <div class="header-content">
      <div class="header-left">
        <div class="menu-toggle" @click="toggleSidebar">
          <el-icon><Menu /></el-icon>
        </div>
        <div class="logo">Photos</div>
      </div>
      <div class="header-right">
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="搜索照片、视频、人物、地点"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Picture /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="header-actions">
          <el-button :icon="Picture" circle @click="handleSelectImages" />
          <el-button :icon="VideoCamera" circle @click="openCameraDialog" />
          <el-button :icon="Setting" circle @click="handleSettings" />
        </div>
      </div>
    </div>

    <!-- 摄像头对话框 -->
    <el-dialog
      v-model="showCameraDialog"
      title="拍照"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="camera-dialog-content">
        <el-select
          v-model="selectedCamera"
          placeholder="选择摄像头"
          class="camera-select"
        >
          <el-option
            v-for="camera in cameraList"
            :key="camera"
            :label="camera"
            :value="camera"
          />
        </el-select>
        
        <el-button
          type="primary"
          :icon="VideoCamera"
          :loading="isCapturing"
          @click="capturePhoto"
          class="capture-button"
        >
          拍照
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.header {
  height: 8vh;
  min-height: 8vh;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.header-content {
  width: 100%;
  height: 100%;
  padding: 0 2vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1vw;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2vw;
}

.logo {
  font-size: 1.5rem;
  font-weight: 500;
  color: #1a73e8;
  flex-shrink: 0;
}

.search-box {
  width: 40%;
  min-width: 300px;
  max-width: 600px;
}

.header-actions {
  display: flex;
  gap: 0.5vw;
  flex-shrink: 0;
}

.menu-toggle {
  display: none;
  margin-right: 1vw;
  cursor: pointer;
}

.camera-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  padding: 20px 0;
}

.camera-select {
  width: 100%;
}

.capture-button {
  width: 120px;
}

@media screen and (max-width: 1200px) {
  .menu-toggle {
    display: block;
  }
}
</style> 