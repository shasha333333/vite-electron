<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMenu, ElMenuItem, ElCollapse, ElCollapseItem } from 'element-plus'
import { 
  Picture, 
  VideoCamera, 
  Star, 
  Folder, 
  Share, 
  Delete, 
  Setting,
  Edit,
  Collection,
  Document,
  DataLine,
  Box
} from '@element-plus/icons-vue'

const props = defineProps<{
  showSidebar: boolean
  isSidebarHovered: boolean
  currentView: string
}>()

const emit = defineEmits<{
  (e: 'update:showSidebar', value: boolean): void
  (e: 'update:isSidebarHovered', value: boolean): void
  (e: 'select-view', view: string): void
}>()

// 折叠面板激活项
const activeCollapseItems = ref<string[]>([])

// 菜单配置
const menuConfig = [
  {
    name: '1',
    title: '照片',
    icon: Picture,
    items: [
      { index: 'gallery', label: '照片库', icon: Picture },
      { index: 'album', label: '相册', icon: Folder },
      { index: 'search', label: '搜索', icon: Document }
    ]
  },
  {
    name: '2',
    title: '编辑',
    icon: Edit,
    items: [
      { index: 'editor', label: '图片编辑', icon: Edit },
      { index: 'batchEdit', label: '批量编辑', icon: Collection },
      { index: 'annotation', label: '标注管理', icon: Document }
    ]
  },
  {
    name: '3',
    title: '收藏',
    icon: Star,
    items: [
      { index: 'favorites', label: '收藏夹', icon: Star }
    ]
  },
  {
    name: '4',
    title: '其他',
    icon: Box,
    items: [
      { index: 'trash', label: '回收站', icon: Delete },
      { index: 'stats', label: '统计', icon: DataLine },
      { index: 'new', label: '新视图', icon: Box }
    ]
  }
]

// 根据当前视图找到对应的折叠面板
const findCollapseItemByView = (view: string) => {
  const section = menuConfig.find(section => 
    section.items.some(item => item.index === view)
  )
  return section?.name
}

// 监听当前视图变化
watch(() => props.currentView, (newView) => {
  const collapseItem = findCollapseItemByView(newView)
  if (collapseItem) {
    activeCollapseItems.value = [collapseItem]
  }
}, { immediate: true })

// 监听侧边栏状态
watch([() => props.showSidebar, () => props.isSidebarHovered], ([newShowSidebar, newIsSidebarHovered]) => {
  if (!newShowSidebar && !newIsSidebarHovered) {
    activeCollapseItems.value = []
  } else if (newShowSidebar || newIsSidebarHovered) {
    // 当侧边栏展开时，自动展开当前视图所在的折叠面板
    const collapseItem = findCollapseItemByView(props.currentView)
    if (collapseItem) {
      activeCollapseItems.value = [collapseItem]
    }
  }
})

const handleSidebarMouseEnter = () => {
  emit('update:isSidebarHovered', true)
}

const handleSidebarMouseLeave = () => {
  emit('update:isSidebarHovered', false)
}

const handleViewSelect = (index: string) => {
  emit('select-view', index)
}
</script>

<template>
  <div 
    class="sidebar" 
    :class="{ 
      'show': showSidebar || isSidebarHovered,
      'hover': isSidebarHovered
    }"
    @mouseenter="handleSidebarMouseEnter"
    @mouseleave="handleSidebarMouseLeave"
  >
    <el-collapse v-model="activeCollapseItems">
      <el-collapse-item 
        v-for="section in menuConfig" 
        :key="section.name"
        :name="section.name"
      >
        <template #title>
          <div class="collapse-title">
            <el-icon><component :is="section.icon" /></el-icon>
            <span>{{ section.title }}</span>
          </div>
        </template>
        <el-menu
          class="sidebar-menu"
          :default-active="currentView"
          @select="handleViewSelect"
        >
          <el-menu-item 
            v-for="item in section.items" 
            :key="item.index"
            :index="item.index"
          >
            <el-icon><component :is="item.icon" /></el-icon>
            <span>{{ item.label }}</span>
          </el-menu-item>
        </el-menu>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped>
.sidebar {
  width: 5%;
  min-width: 60px;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  flex-shrink: 0;
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  z-index: 10;
}

.sidebar.show {
  width: 10%;
  min-width: 200px;
}

.sidebar.hover {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.collapse-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 100%;
}

.collapse-title .el-icon {
  width: 33.33%;
  display: flex;
  justify-content: center;
}

.collapse-title span {
  width: 33.33%;
  display: none;
}

.sidebar.show .collapse-title {
  justify-content: flex-start;
  gap: 8%;
}

.sidebar.show .collapse-title span {
  display: inline;
}

.sidebar-menu {
  border-right: none;
  flex-shrink: 0;
}

/* 控制折叠图标显示 */
:deep(.el-collapse-item__header .el-collapse-item__arrow) {
  display: none;
}

.sidebar.show :deep(.el-collapse-item__header .el-collapse-item__arrow) {
  display: inline-flex;
}

/* 折叠面板标题样式 */
:deep(.el-collapse-item__header) {
  outline: none !important;
  border: none !important;
  background: none !important;
  padding: 0 5%;
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.el-collapse-item__header .el-icon) {
  font-size: 1.2em;
  margin-right: 0;
}

.sidebar.show :deep(.el-collapse-item__header) {
  justify-content: flex-start;
  padding-right: 15%;
}

.sidebar.show :deep(.el-collapse-item__header .el-icon) {
  margin-right: 8%;
}

/* 菜单项样式 */
:deep(.el-menu-item) {
  padding: 0 5%;
  height: 7vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1% 0;
}

:deep(.el-menu-item .el-icon) {
  font-size: 1em;
  margin-right: 0;
  width: 33.33%;
  display: flex;
  justify-content: center;
}

:deep(.el-menu-item span) {
  width: 33.33%;
  display: none;
}

.sidebar.show :deep(.el-menu-item) {
  justify-content: flex-start;
}

.sidebar.show :deep(.el-menu-item .el-icon) {
  margin-right: 5%;
}

.sidebar.show :deep(.el-menu-item span) {
  display: inline;
}

/* 折叠面板内容样式 */
:deep(.el-collapse-item__content) {
  padding: 1% 0 !important;
  border: none !important;
  outline: none !important;
}

:deep(.el-menu) {
  border-right: none;
  padding: 1% 0;
}

/* 调整间距 */
:deep(.el-collapse-item) {
  margin-bottom: 1%;
  border: none !important;
}

:deep(.el-menu-item) {
  margin: 2px 0;
}

/* 移除边框和轮廓 */
:deep(.el-collapse) {
  border: none !important;
}

:deep(.el-collapse-item__wrap) {
  border: none !important;
  outline: none !important;
}

:deep(.el-collapse-item__header:focus),
:deep(.el-collapse-item__header.is-active) {
  outline: none !important;
  border: none !important;
  background: none !important;
}

/* 优化悬停效果 */
:deep(.el-collapse-item__header:hover) {
  background-color: #f5f7fa !important;
}

:deep(.el-menu-item:hover) {
  background-color: #f5f7fa !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #e8f0fe !important;
  color: #1a73e8 !important;
}

@media screen and (max-width: 1200px) {
  .sidebar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    transform: translateX(-100%);
    z-index: 99;
  }

  .sidebar.show {
    transform: translateX(0);
  }
}
</style> 