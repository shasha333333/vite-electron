<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import { StarFilled } from '@element-plus/icons-vue'
import BaseGalleryView from './BaseGalleryView.vue'
import type { Photo } from '../types/photo'

// 处理图片点击
const handlePhotoClick = (photo: Photo) => {
  // 实现图片点击逻辑
  console.log('查看图片:', photo)
}

// 排序选项
const sortOptions = [
  { label: '按收藏时间', value: 'favorite-time' },
  { label: '按名称', value: 'name' },
  { label: '按大小', value: 'size' }
]
</script>

<template>
  <BaseGalleryView
    :filter-fn="photo => photo.favorite"
    empty-description="暂无收藏图片"
    empty-icon="StarFilled"
    :show-sort="true"
    :sort-options="sortOptions"
    :show-timeline="true"
    @photo-click="handlePhotoClick"
  />
</template> 