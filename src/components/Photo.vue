<script setup lang="ts">
import type { Photo as PhotoType } from '../types/photo'

const props = defineProps<{
  photo: PhotoType
  aspectRatio?: string
  disableHover?: boolean
}>()
</script>

<template>
  <div 
    class="photo"
    :class="{ 'disable-hover': disableHover }"
    :style="{ aspectRatio: aspectRatio || '1/1' }"
  >
    <img 
      :src="photo.url" 
      :alt="photo.name"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.photo {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f5f5f5;
  border-radius: 8px;
}

.photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo:not(.disable-hover):hover img {
  transform: scale(1.05);
}
</style> 