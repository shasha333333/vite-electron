<script setup lang="ts">
import { computed } from 'vue'
import GalleryView from '@/views/GalleryView.vue'
import AlbumView from '@/views/AlbumView.vue'
import SearchView from '@/views/SearchView.vue'
import EditorView from '@/views/EditorView.vue'
import BatchEditView from '@/views/BatchEditView.vue'
import AnnotationView from '@/views/AnnotationView.vue'
import TrashView from '@/views/TrashView.vue'
import FavoriteView from '@/views/FavoriteView.vue'
import SettingsView from '@/views/SettingsView.vue'
import StatsView from '@/views/StatsView.vue'
import NewView from '@/views/NewView.vue'

// 定义视图类型
type ViewType = 'gallery' | 'album' | 'search' | 'editor' | 'batchEdit' | 'annotation' | 'favorites' | 'trash' | 'settings' | 'stats' | 'new'

const props = defineProps<{
  currentView: ViewType
  isSidebarExpanded: boolean
}>()

// 视图组件映射
const viewComponents: Record<ViewType, any> = {
  gallery: GalleryView,
  album: AlbumView,
  search: SearchView,
  editor: EditorView,
  batchEdit: BatchEditView,
  annotation: AnnotationView,
  favorites: FavoriteView, 
  trash: TrashView,
  settings: SettingsView,
  stats: StatsView,
  new: NewView
}

// 当前视图组件
const currentViewComponent = computed(() => {
  return viewComponents[props.currentView]
})
</script>

<template>
  <div class="content" :class="{ 'sidebar-expanded': isSidebarExpanded }">
    <div class="content-wrapper">
      <component :is="currentViewComponent" />
    </div>
  </div>
</template>

<style scoped>
.content {
  flex: 1;
  overflow: hidden;
  background-color: #f8f9fa;
  min-width: 0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  height: 100%;
}

.content.sidebar-expanded {
  margin-left: 0;
}

.content-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
</style> 