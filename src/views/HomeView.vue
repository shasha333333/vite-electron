<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppContent from '@/components/layout/AppContent.vue'

// 定义视图类型
type ViewType = 'gallery' | 'album' | 'search' | 'editor' | 'batchEdit' | 'annotation' | 'favorites' | 'trash' | 'settings' | 'stats'

// 当前视图
const currentView = ref<ViewType>('gallery')

// 侧边栏显示状态
const showSidebar = ref(false)

// 侧边栏悬停状态
const isSidebarHovered = ref(false)

// 切换视图
const handleViewSelect = (view: string) => {
  currentView.value = view as ViewType
}

// 选择并复制图片
const handleSelectImages = async () => {
  try {
    // 选择图片文件
    const sourcePaths = await window.electronAPI.selectImages()
    if (!sourcePaths || sourcePaths.length === 0) return

    // 选择目标目录
    const targetDir = await window.electronAPI.getTargetDirectory()
    if (!targetDir) return

    // 复制图片
    const results = await window.electronAPI.copyImages(sourcePaths, targetDir)
    console.log('复制结果:', results)
  } catch (error) {
    console.error('操作失败:', error)
  }
}
</script>

<template>
  <div class="home-container">
    <AppHeader
      :show-sidebar="showSidebar"
      @toggle-sidebar="showSidebar = !showSidebar"
      @select-images="handleSelectImages"
      @open-settings="handleViewSelect('settings')"
    />

    <div class="main-content">
      <AppSidebar
        v-model:show-sidebar="showSidebar"
        v-model:is-sidebar-hovered="isSidebarHovered"
        :current-view="currentView"
        @select-view="handleViewSelect"
      />

      <AppContent
        :current-view="currentView"
        :is-sidebar-expanded="showSidebar || isSidebarHovered"
      />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
  position: relative;
  width: 100%;
  height: calc(100% - 8vh);
}
</style> 