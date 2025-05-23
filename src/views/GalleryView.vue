<script setup lang="ts">
import { ref } from 'vue'
import { ElButton } from 'element-plus'
import BaseGalleryView from './BaseGalleryView.vue'
import type { Photo } from '../types/photo'

// 处理图片点击
const handlePhotoClick = (photo: Photo) => {
  // 实现图片点击逻辑
  console.log('查看图片:', photo)
}

// 排序选项
const sortOptions = [
  { label: '按日期', value: 'date' },
  { label: '按名称', value: 'name' },
  { label: '按大小', value: 'size' }
]
</script>

<template>
  <BaseGalleryView
    :filter-fn="() => true"
    empty-description="暂无图片"
    :show-sort="true"
    :sort-options="sortOptions"
    :show-timeline="true"
    @photo-click="handlePhotoClick"
  />
</template> 