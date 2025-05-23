<script setup lang="ts">
import { computed } from 'vue'
import { ElTag, ElCard, ElDescriptions, ElDescriptionsItem, ElDivider } from 'element-plus'
import type { Photo } from '../types/photo'

const props = defineProps<{
  photo: Photo
}>()

const formattedDate = computed(() => {
  return new Date(props.photo.date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>

<template>
  <el-card class="photo-card" :body-style="{ padding: '0' }">
    <div class="photo-info">
      <!-- 标题区域 -->
      <div class="photo-header">
        <div class="title-section">
          <div class="title-row">
            <h3 class="photo-name">{{ photo.name }}</h3>
            <el-tag
              v-if="photo.favorite"
              type="warning"
              effect="light"
              size="small"
              class="favorite-tag"
            >
              已收藏
            </el-tag>
          </div>
          <div class="meta-brief">
            <span class="date">
              <el-icon><Calendar /></el-icon>
              {{ formattedDate }}
            </span>
            <el-divider direction="vertical" />
            <span class="size">
              <el-icon><Document /></el-icon>
              {{ photo.size }}
            </span>
          </div>
        </div>
      </div>

      <el-divider class="custom-divider" />

      <!-- 详细信息区域 -->
      <div class="details-section">
        <div class="details-grid">
          <div v-if="photo.dimensions" class="detail-item">
            <div class="detail-icon">📐</div>
            <div class="detail-content">
              <div class="detail-label">图片尺寸</div>
              <div class="detail-value">{{ photo.dimensions }}</div>
            </div>
          </div>
          <div v-if="photo.location" class="detail-item">
            <div class="detail-icon">📍</div>
            <div class="detail-content">
              <div class="detail-label">拍摄地点</div>
              <div class="detail-value">{{ photo.location }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签区域 -->
      <div v-if="photo.tags?.length" class="tags-section">
        <div class="photo-tags">
          <el-tag
            v-for="tag in photo.tags"
            :key="tag"
            size="small"
            effect="plain"
            class="tag-item"
          >
            <el-icon class="tag-icon"><Collection /></el-icon>
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <!-- 描述区域 -->
      <el-card
        v-if="photo.description"
        class="description-card"
        shadow="never"
      >
        <div class="description-content">
          <el-icon class="description-icon"><Document /></el-icon>
          <div class="description-text">{{ photo.description }}</div>
        </div>
      </el-card>
    </div>
  </el-card>
</template>

<style scoped>
.photo-card {
  height: 100%;
  width: 100%;
  border: none;
  box-shadow: none !important;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  transition: all 0.3s ease;
}

.photo-info {
  padding: 1.5rem;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--el-border-color) transparent;
}

.photo-info::-webkit-scrollbar {
  width: 6px;
}

.photo-info::-webkit-scrollbar-track {
  background: transparent;
}

.photo-info::-webkit-scrollbar-thumb {
  background-color: var(--el-border-color);
  border-radius: 3px;
}

.photo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-shrink: 0;
  width: 100%;
}

.title-section {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.photo-name {
  font-size: 1.25rem;
  color: var(--el-text-color-primary);
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.meta-brief {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--el-text-color-secondary);
  font-size: 0.875rem;
}

.meta-brief .el-icon {
  margin-right: 0.25rem;
  font-size: 1rem;
  color: var(--el-text-color-secondary);
  opacity: 0.8;
}

.favorite-tag {
  border-radius: 6px;
  padding: 0 0.75rem;
  height: 24px;
  line-height: 24px;
  font-weight: 500;
  background: #fff7ed;
  border: none;
  color: #c2410c;
  opacity: 0.9;
  transition: all 0.2s ease;
}

.favorite-tag:hover {
  opacity: 1;
  transform: translateY(-1px);
}

.custom-divider {
  margin: 0.5rem 0;
  opacity: 0.6;
}

.details-section {
  background: var(--el-fill-color-light);
  border-radius: 12px;
  padding: 1.25rem;
  flex-shrink: 0;
  width: 100%;
  transition: all 0.3s ease;
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--el-bg-color);
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 100%;
  border: 1px solid var(--el-border-color-lighter);
}

.detail-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border-color: var(--el-border-color);
}

.detail-icon {
  font-size: 1.5rem;
  opacity: 0.8;
  flex-shrink: 0;
  width: 2rem;
  text-align: center;
  color: var(--el-text-color-secondary);
}

.detail-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--el-text-color-secondary);
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  color: var(--el-text-color-primary);
  font-weight: 500;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tags-section {
  margin-top: auto;
  background: var(--el-fill-color-light);
  border-radius: 12px;
  padding: 1.25rem;
  flex-shrink: 0;
  width: 100%;
  transition: all 0.3s ease;
}

.photo-tags {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tag-item {
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  padding: 0 1rem;
  height: 32px;
  line-height: 32px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.tag-icon {
  font-size: 1rem;
  color: var(--el-text-color-secondary);
  opacity: 0.8;
}

.tag-item:hover {
  background: var(--el-fill-color);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-color: var(--el-border-color);
}

.description-card {
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  font-size: 0.875rem;
  color: var(--el-text-color-regular);
  line-height: 1.5;
  border-radius: 12px;
  max-height: 80px;
  overflow-y: auto;
  flex-shrink: 0;
  width: 100%;
  transition: all 0.3s ease;
}

.description-card:hover {
  border-color: var(--el-border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.description-content {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  width: 100%;
}

.description-icon {
  font-size: 1.125rem;
  color: var(--el-text-color-secondary);
  margin-top: 0.125rem;
  flex-shrink: 0;
  width: 1.5rem;
  text-align: center;
  opacity: 0.8;
}

.description-text {
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media screen and (max-width: 768px) {
  .photo-info {
    padding: 1.25rem;
    gap: 1rem;
  }

  .photo-name {
    font-size: 1.125rem;
  }

  .details-section,
  .tags-section {
    padding: 1rem;
  }

  .detail-item {
    padding: 0.75rem;
  }

  .tag-item {
    height: 28px;
    line-height: 28px;
    padding: 0 0.75rem;
    font-size: 0.8125rem;
  }

  .description-card {
    max-height: 60px;
  }

  .description-content {
    padding: 0.75rem;
    gap: 0.625rem;
  }
}
</style> 