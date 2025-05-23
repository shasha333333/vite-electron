<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import PhotoContainer from '@/components/PhotoContainer.vue'
import type { Photo } from '@/types/photo'
import { ElButton } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

const props = defineProps<{
  album: {
    id: string
    name: string
    description: string
    coverUrl: string
    photoCount: number
    createdAt: string
  }
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const route = useRoute()
const albumId = computed(() => route.params.id)

// 模拟相册数据
const album = ref({
  id: 1,
  name: '我的相册',
  description: '这是一个示例相册',
  cover: '',
  photoCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

// 模拟照片数据
const photos = ref<Photo[]>([
  {
    id: 1,
    name: '示例照片1',
    url: 'https://picsum.photos/800/600',
    size: '2.5MB',
    date: new Date().toISOString(),
    dimensions: '1920x1080',
    location: '北京',
    tags: ['风景', '自然'],
    description: '这是一张示例照片',
    favorite: true,
    category: '风景'
  },
  // 可以添加更多示例照片
])

// 加载相册数据
const loadAlbumData = async () => {
  try {
    // TODO: 调用API加载相册数据
    console.log('加载相册数据:', albumId.value)
  } catch (error) {
    console.error('加载相册数据失败:', error)
  }
}

// 加载照片列表
const loadPhotos = async () => {
  try {
    // TODO: 调用API加载照片列表
    console.log('加载照片列表:', albumId.value)
  } catch (error) {
    console.error('加载照片列表失败:', error)
  }
}

// 返回相册列表
const handleBack = () => {
  emit('back')
}

onMounted(() => {
  loadAlbumData()
  loadPhotos()
})
</script>

<template>
  <div class="album-content">
    <!-- 顶部导航栏 -->
    <div class="album-header">
      <el-button 
        :icon="ArrowLeft" 
        @click="handleBack"
      >
        返回相册列表
      </el-button>
      <h1>{{ album.name }}</h1>
    </div>

    <!-- 相册内容 -->
    <div class="album-body">
      <!-- 相册头部信息 -->
      <div class="album-info">
        <p class="album-description">{{ album.description }}</p>
        <div class="album-meta">
          <span class="photo-count">{{ album.photoCount }} 张照片</span>
          <span class="update-time">更新于 {{ new Date(album.updatedAt).toLocaleDateString() }}</span>
        </div>
      </div>

      <!-- 照片列表 -->
      <div class="photo-list">
        <PhotoContainer
          v-for="photo in photos"
          :key="photo.id"
          :photo="photo"
          mode="list"
          @favorite="(id) => console.log('收藏照片:', id)"
          @share="(id) => console.log('分享照片:', id)"
          @delete="(id) => console.log('删除照片:', id)"
          @click="(event) => console.log('点击照片:', event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.album-content {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  padding: 2rem;
  gap: 2rem;
  overflow-y: auto;
}

.album-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--el-border-color-light);
}

.album-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.album-body {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

.album-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.album-description {
  font-size: 1rem;
  color: var(--el-text-color-regular);
  margin: 0;
  line-height: 1.5;
}

.album-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: var(--el-text-color-secondary);
  font-size: 0.875rem;
}

.photo-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  min-height: 0;
}

@media screen and (max-width: 768px) {
  .album-content {
    padding: 1rem;
    gap: 1rem;
  }

  .album-header {
    padding: 1.5rem;
  }

  .album-title {
    font-size: 1.5rem;
  }

  .album-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style> 