<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElButton, ElTooltip, ElDropdown, ElDropdownMenu, ElDropdownItem, ElEmpty, ElMessageBox } from 'element-plus'
import { Grid, List, More, Delete, RefreshRight } from '@element-plus/icons-vue'
import { getMockImages } from '../middleware/mockData'
import PhotoContainer from '../components/PhotoContainer.vue'
import type { Photo } from '../types/photo'

const viewMode = ref<'grid' | 'list'>('grid')
const images = ref(getMockImages())

// 获取已删除的图片
const deletedPhotos = computed(() => {
  return images.value.filter(photo => photo.deleted)
})

// 处理恢复
const handleRestore = (id: number) => {
  const photo = images.value.find(img => img.id === id)
  if (photo) {
    photo.deleted = false
  }
}

// 处理永久删除
const handleDelete = (id: number) => {
  ElMessageBox.confirm(
    '确定要永久删除这张图片吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = images.value.findIndex(img => img.id === id)
    if (index !== -1) {
      images.value.splice(index, 1)
    }
  })
}

// 清空回收站
const handleEmptyTrash = () => {
  ElMessageBox.confirm(
    '确定要清空回收站吗？此操作不可恢复。',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    images.value = images.value.filter(img => !img.deleted)
  })
}
</script>

<template>
  <div class="trash-view">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="view-controls">
        <el-tooltip content="网格视图" placement="bottom">
          <el-button 
            :icon="Grid" 
            circle 
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          />
        </el-tooltip>
        <el-tooltip content="列表视图" placement="bottom">
          <el-button 
            :icon="List" 
            circle 
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          />
        </el-tooltip>
      </div>
      <div class="action-controls">
        <el-button
          type="danger"
          :icon="Delete"
          @click="handleEmptyTrash"
          :disabled="!deletedPhotos.length"
        >
          清空回收站
        </el-button>
      </div>
    </div>

    <!-- 回收站内容 -->
    <div class="trash-content">
      <template v-if="deletedPhotos.length > 0">
        <div 
          :class="[
            'photo-grid',
            viewMode === 'list' ? 'list-view' : 'grid-view'
          ]"
        >
          <PhotoContainer
            v-for="photo in deletedPhotos"
            :key="photo.id"
            :photo="photo"
            :mode="viewMode"
          >
            <template #actions>
              <el-tooltip content="恢复" placement="top">
                <el-button
                  :icon="RefreshRight"
                  circle
                  @click.stop="handleRestore(photo.id)"
                />
              </el-tooltip>
              <el-tooltip content="永久删除" placement="top">
                <el-button
                  :icon="Delete"
                  circle
                  type="danger"
                  @click.stop="handleDelete(photo.id)"
                />
              </el-tooltip>
            </template>
          </PhotoContainer>
        </div>
      </template>
      <el-empty
        v-else
        description="回收站为空"
      >
        <template #image>
          <el-icon :size="60" color="#909399"><Delete /></el-icon>
        </template>
      </el-empty>
    </div>
  </div>
</template>

<style scoped>
.trash-view {
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 8px;
}

.view-controls {
  display: flex;
  gap: 8px;
}

.view-controls .el-button.active {
  background-color: #e8f0fe;
  color: #1a73e8;
}

.trash-content {
  flex: 1;
  overflow-y: auto;
}

.photo-grid {
  display: grid;
  gap: 16px;
}

.grid-view {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.list-view {
  grid-template-columns: 1fr;
}

:deep(.el-empty) {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style> 