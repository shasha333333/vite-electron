<script setup lang="ts">
import { ElButton, ElTooltip } from 'element-plus'
import { Star, StarFilled, Share, Delete } from '@element-plus/icons-vue'

const props = defineProps<{
  photoId: number
  isFavorite: boolean
}>()

const emit = defineEmits<{
  (e: 'favorite'): void
  (e: 'share'): void
  (e: 'delete'): void
}>()
</script>

<template>
  <div class="photo-actions">
    <el-tooltip content="收藏" placement="top">
      <el-button
        :icon="Star"
        circle
        :class="{ 'is-favorite': isFavorite }"
        @click.stop="$emit('favorite')"
      />
    </el-tooltip>
    <!-- <el-tooltip content="分享" placement="top">
      <el-button
        :icon="Share"
        circle
        @click.stop="$emit('share')"
      />
    </el-tooltip> -->
    <el-tooltip content="删除" placement="top">
      <el-button
        :icon="Delete"
        circle
        type="danger"
        @click.stop="$emit('delete')"
      />
    </el-tooltip>
  </div>
</template>

<style scoped>
.photo-actions {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-actions:hover {
  opacity: 1;
}

.photo-actions .el-button {
  transition: transform 0.2s ease;
}

.photo-actions .el-button:hover {
  transform: scale(1.1);
}

.photo-actions .el-button:active {
  transform: scale(0.95);
}

.photo-actions .el-button.is-favorite {
  color: #f56c6c;
}
</style> 