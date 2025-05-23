<script setup lang="ts">
import { computed } from 'vue'
import type { Photo } from '../types/photo'
import PhotoComponent from './Photo.vue'
import PhotoCard from './PhotoCard.vue'
import PhotoActions from './PhotoActions.vue'

const props = defineProps<{
  photo: Photo
  mode?: 'grid' | 'list' | 'dialog'
}>()

const emit = defineEmits<{
  (e: 'favorite', id: number): void
  (e: 'share', id: number): void
  (e: 'delete', id: number): void
  (e: 'click', event: MouseEvent): void
}>()

// 处理操作事件
const handleFavorite = (id: number) => {
  emit('favorite', id)
}

const handleShare = (id: number) => {
  emit('share', id)
}

const handleDelete = (id: number) => {
  emit('delete', id)
}
</script>

<template>
  <div 
    class="photo-container"
    :class="[
      `mode-${mode || 'grid'}`,
      { 'is-favorite': photo.favorite }
    ]"
    @click="$emit('click', $event)"
  >
    <!-- 网格模式：只显示图片和操作按钮 -->
    <template v-if="mode === 'grid'">
      <PhotoComponent :photo="photo" />
      <PhotoActions
        :photo-id="photo.id"
        :is-favorite="photo.favorite"
        @favorite="() => handleFavorite(photo.id)"
        @share="() => handleShare(photo.id)"
        @delete="() => handleDelete(photo.id)"
      />
    </template>

    <!-- 列表模式：左侧图片，右侧信息 -->
    <template v-else-if="mode === 'list'">
      <div class="list-content">
        <div class="photo-wrapper">
          <PhotoComponent :photo="photo" aspect-ratio="4/3" />
        </div>
        <div class="card-wrapper">
          <PhotoCard :photo="photo" />
        </div>
      </div>
    </template>

    <!-- 对话框模式：大图展示 -->
    <template v-else>
      <div class="dialog-content">
        <PhotoComponent :photo="photo" aspect-ratio="16/9" :disable-hover="true" />
        <PhotoActions
          :photo-id="photo.id"
          :is-favorite="photo.favorite"
          @favorite="() => handleFavorite(photo.id)"
          @share="() => handleShare(photo.id)"
          @delete="() => handleDelete(photo.id)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.photo-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

/* 网格模式 */
.mode-grid {
  aspect-ratio: 1;
}

/* 列表模式 */
.mode-list {
  height: 33.33vh;
  min-height: 200px;
  max-height: 33.33vh;
  transition: all 0.3s ease;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 100%;
}

.list-content {
  display: flex;
  height: 100%;
  transition: all 0.3s ease;
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  max-height: 33.33vh;
}

.photo-wrapper {
  width: 40%;
  flex: 0 0 40%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 100%;
  max-height: 33.33vh;
}

.photo-wrapper :deep(.photo) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-wrapper :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.photo-wrapper:hover :deep(img) {
  transform: scale(1.05);
}

.card-wrapper {
  width: 60%;
  flex: 0 0 60%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  overflow: hidden;
}

.card-wrapper :deep(.photo-card) {
  height: 100%;
  width: 100%;
}

.card-wrapper :deep(.photo-info) {
  height: 100%;
  width: 100%;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .mode-list {
    height: auto;
    min-height: 200px;
    max-height: none;
  }

  .list-content {
    flex-direction: column;
    width: 100%;
    max-height: none;
  }

  .photo-wrapper {
    width: 100%;
    flex: 0 0 200px;
    height: 200px;
    max-height: 200px;
  }

  .card-wrapper {
    width: 100%;
    flex: 1;
    min-height: 0;
    max-height: none;
  }
}

/* 对话框模式 */
.mode-dialog {
  width: 100%;
  height: 100%;
  max-width: none;
  margin: 0;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
}

.dialog-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  transition: transform 0.3s ease;
}

.dialog-content :deep(img) {
  max-width: 100%;
  max-height: calc(100vh - 4rem);
  object-fit: contain;
  transition: transform 0.3s ease;
}

.dialog-content :deep(.photo-actions) {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  z-index: 10;
  transition: opacity 0.3s ease;
}

/* 收藏状态 */
.is-favorite {
  border: none;
}

</style> 