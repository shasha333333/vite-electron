<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElButton, ElTooltip, ElDropdown, ElDropdownMenu, ElDropdownItem, ElEmpty, ElMessageBox, ElDialog } from 'element-plus'
import { Grid, List, More, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { getMockImages, getMockTimelineData, type TimelineYear } from '../middleware/mockData'
import PhotoContainer from '../components/PhotoContainer.vue'
import type { Photo } from '../types/photo'

const props = defineProps<{
  // 过滤条件函数
  filterFn: (photo: Photo) => boolean
  // 空状态描述
  emptyDescription: string
  // 空状态图标
  emptyIcon?: string
  // 是否显示排序选项
  showSort: boolean
  // 排序选项
  sortOptions?: { label: string; value: string }[]
  // 是否显示时间线
  showTimeline?: boolean
}>()

const viewMode = ref<'grid' | 'list'>('grid')
const images = ref(getMockImages())
const timelineData = ref<TimelineYear[]>(getMockTimelineData())
const currentSort = ref<string>('date') // 默认按日期排序

// 当前选中的图片
const selectedPhoto = ref<Photo | null>(null)
const showPhotoCard = ref(false)

// 获取过滤后的图片
const filteredPhotos = computed(() => {
  let result = images.value.filter(props.filterFn)
  
  // 应用排序
  switch (currentSort.value) {
    case 'date':
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'size':
      result.sort((a, b) => {
        const sizeA = parseInt(a.size.replace(/[^0-9]/g, ''))
        const sizeB = parseInt(b.size.replace(/[^0-9]/g, ''))
        return sizeB - sizeA
      })
      break
  }
  
  return result
})

// 获取排序后的时间线数据
const sortedTimelineData = computed(() => {
  // 首先获取所有图片并应用过滤和排序
  const allFilteredPhotos = images.value
    .filter(props.filterFn)
    .sort((a, b) => {
      switch (currentSort.value) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        case 'size':
          const sizeA = parseInt(a.size.replace(/[^0-9]/g, ''))
          const sizeB = parseInt(b.size.replace(/[^0-9]/g, ''))
          return sizeB - sizeA
        default:
          return 0
      }
    })

  // 然后按年份和月份重新组织数据
  const result = timelineData.value.map(year => ({
    ...year,
    months: year.months.map(month => ({
      ...month,
      images: allFilteredPhotos.filter(photo => {
        const photoDate = new Date(photo.date)
        return photoDate.getFullYear() === year.year && 
               photoDate.getMonth() + 1 === month.month
      })
    }))
  }))

  return result
})

// 处理排序方式改变
const handleSortChange = (value: string) => {
  currentSort.value = value
}

// 处理收藏
const handleFavorite = (id: number) => {
  const photo = images.value.find(img => img.id === id)
  if (photo) {
    photo.favorite = !photo.favorite
  }
}

// 处理分享
const handleShare = (id: number) => {
  console.log('分享图片:', id)
}

// 处理删除
const handleDelete = (id: number) => {
  ElMessageBox.confirm(
    '确定要删除这张图片吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const photo = images.value.find(img => img.id === id)
    if (photo) {
      photo.deleted = true
    }
  })
}

// 处理图片点击
const handlePhotoClick = (photo: Photo) => {
  selectedPhoto.value = photo
  showPhotoCard.value = true
  emit('photo-click', photo)
}

// 添加滑动相关的方法
const handlePrevPhoto = () => {
  if (!selectedPhoto.value) return
  const currentIndex = filteredPhotos.value.findIndex(p => p.id === selectedPhoto.value?.id)
  if (currentIndex > 0) {
    selectedPhoto.value = filteredPhotos.value[currentIndex - 1]
  }
}

const handleNextPhoto = () => {
  if (!selectedPhoto.value) return
  const currentIndex = filteredPhotos.value.findIndex(p => p.id === selectedPhoto.value?.id)
  if (currentIndex < filteredPhotos.value.length - 1) {
    selectedPhoto.value = filteredPhotos.value[currentIndex + 1]
  }
}

// 处理键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (!showPhotoCard.value) return
  if (e.key === 'ArrowLeft') {
    handlePrevPhoto()
  } else if (e.key === 'ArrowRight') {
    handleNextPhoto()
  }
}

// 添加键盘事件监听
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const emit = defineEmits<{
  (e: 'photo-click', photo: Photo): void
}>()
</script>

<template>
  <div class="gallery-view">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="left-controls">
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
          <slot name="actions" />
        </div>
      </div>
      <div class="right-controls">
        <div class="sort-controls" v-if="showSort">
          <el-dropdown @command="handleSortChange">
            <el-button>
              {{ sortOptions?.find(opt => opt.value === currentSort)?.label || '排序方式' }}
              <el-icon class="el-icon--right"><More /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="option in sortOptions" 
                  :key="option.value"
                  :command="option.value"
                >
                  {{ option.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 图片内容 -->
    <div class="gallery-content">
      <template v-if="filteredPhotos.length > 0">
        <!-- 时间线视图 -->
        <template v-if="showTimeline">
          <div 
            v-for="year in sortedTimelineData" 
            :key="year.year" 
            class="timeline-section"
          >
            <h2 class="year-title">{{ year.year }}</h2>
            <div 
              v-for="month in year.months" 
              :key="month.month" 
              class="month-section"
            >
              <div class="month-header">
                <h3>{{ month.month }}月</h3>
                <div class="month-stats">
                  <span>{{ month.images.length }}张照片</span>
                </div>
              </div>

              <div 
                :class="[
                  'photo-grid',
                  viewMode === 'list' ? 'list-view' : 'grid-view'
                ]"
              >
                <PhotoContainer
                  v-for="photo in month.images"
                  :key="photo.id"
                  :photo="photo"
                  :mode="viewMode"
                  @favorite="handleFavorite"
                  @share="handleShare"
                  @delete="handleDelete"
                  @click="handlePhotoClick(photo)"
                />
              </div>
            </div>
          </div>
        </template>

        <!-- 普通视图 -->
        <template v-else>
          <div 
            :class="[
              'photo-grid',
              viewMode === 'list' ? 'list-view' : 'grid-view'
            ]"
          >
            <PhotoContainer
              v-for="photo in filteredPhotos"
              :key="photo.id"
              :photo="photo"
              :mode="viewMode"
              @favorite="handleFavorite"
              @share="handleShare"
              @delete="handleDelete"
              @click="handlePhotoClick(photo)"
            />
          </div>
        </template>
      </template>
      <el-empty
        v-else
        :description="emptyDescription"
      >
        <template #image>
          <el-icon :size="60" color="#909399">
            <component :is="emptyIcon || 'Picture'" />
          </el-icon>
        </template>
      </el-empty>
    </div>

    <!-- 图片预览对话框dui -->
    <el-dialog
      v-model="showPhotoCard"
      width="100%"
      class="photo-card-dialog"
      destroy-on-close
      :show-close="true"
      :fullscreen="true"
      :modal="true"
      :append-to-body="true"
      :close-on-click-modal="true"
      :close-on-press-escape="true"
    >
      <div class="photo-viewer">
        <div class="nav-area prev-area"></div>
        <div 
          class="nav-button prev-button"
          :class="{ disabled: !selectedPhoto || filteredPhotos.findIndex(p => p.id === selectedPhoto?.id) === 0 }"
          @click="handlePrevPhoto"
        >
          <el-icon><ArrowLeft /></el-icon>
        </div>
        
        <PhotoContainer
          v-if="selectedPhoto"
          :photo="selectedPhoto"
          mode="dialog"
          @favorite="handleFavorite"
          @share="handleShare"
          @delete="handleDelete"
        />

        <div class="nav-area next-area"></div>
        <div 
          class="nav-button next-button"
          :class="{ disabled: !selectedPhoto || filteredPhotos.findIndex(p => p.id === selectedPhoto?.id) === filteredPhotos.length - 1 }"
          @click="handleNextPhoto"
        >
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.gallery-view {
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

.left-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.right-controls {
  display: flex;
  align-items: center;
}

.view-controls {
  display: flex;
  gap: 8px;
}

.view-controls .el-button.active {
  background-color: #e8f0fe;
  color: #1a73e8;
}

.gallery-content {
  flex: 1;
  overflow-y: auto;
}

.timeline-section {
  margin-bottom: 32px;
}

.year-title {
  font-size: 24px;
  color: #202124;
  margin: 0 0 16px;
  padding: 0 8px;
  display: flex;
}

.month-section {
  margin-bottom: 24px;
}

.month-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  margin-bottom: 16px;
}

.month-header h3 {
  margin: 0;
  font-size: 18px;
  color: #202124;
}

.month-stats {
  color: #5f6368;
  font-size: 14px;
}

.month-stats span {
  margin-left: 16px;
}

.photo-grid {
  display: grid;
  gap: 16px;
}

.grid-view {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.list-view {
  grid-template-columns: repeat(auto-fill, minmax(40%, 2fr));
}

.list-view :deep(.photo-container) {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.3s;
  height: 100%;
}

.list-view :deep(.photo-container:hover) {
  background: #e9ecef;
}

.list-view :deep(.photo-preview) {
  width: 160px;
  height: 100px;
  margin-right: 16px;
  border-radius: 4px;
  object-fit: cover;
}

.list-view :deep(.photo-info) {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0; /* 防止文本溢出 */
}

.list-view :deep(.photo-name) {
  font-size: 16px;
  font-weight: 500;
  color: #202124;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.list-view :deep(.photo-meta) {
  display: flex;
  gap: 16px;
  color: #5f6368;
  font-size: 14px;
  flex-wrap: wrap;
}

.list-view :deep(.photo-actions) {
  margin-left: 16px;
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  gap: 8px;
}

.list-view :deep(.photo-container:hover .photo-actions) {
  opacity: 1;
}

:deep(.el-empty) {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.photo-card-dialog {
  :deep(.el-dialog) {
    margin: 0 !important;
    height: 100vh;
    max-width: 100vw;
    background: #000000;
    border-radius: 0;
  }

  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.photo-container) {
    position: relative;
    max-width: 100%;
    max-height: 100%;
    margin: 0;
    padding: 0;
  }

  :deep(.photo-preview) {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  :deep(.photo-actions) {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 16px;
    background: rgba(0, 0, 0, 0.8);
    padding: 8px 16px;
    border-radius: 24px;
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 10;
  }

  :deep(.photo-container:hover .photo-actions) {
    opacity: 1;
  }

  :deep(.photo-actions .el-button) {
    color: #ffffff;
    background: transparent;
    border: none;
    padding: 8px;
  }

  :deep(.photo-actions .el-button:hover) {
    background: rgba(255, 255, 255, 0.1);
  }
}

.photo-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) scale(0.8);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  opacity: 0;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 1);
  transform: translateY(-50%) scale(1.1);
  opacity: 1;
}

.nav-button.disabled {
  opacity: 0;
  cursor: not-allowed;
  pointer-events: none;
}

.nav-button .el-icon {
  font-size: 28px;
  color: #ffffff;
}

.prev-button {
  left: 2rem;
}

.next-button {
  right: 2rem;
}

/* 添加导航按钮的悬停区域 */
.nav-area {
  position: absolute;
  top: 0;
  width: 120px;
  height: 100%;
  z-index: 5;
}

.nav-area:hover + .nav-button,
.nav-button:hover {
  opacity: 1;
  transform: translateY(-50%) scale(1);
}

.prev-area {
  left: 0;
}

.next-area {
  right: 0;
}
</style> 