<script setup lang="ts">
import { ref } from 'vue'
import { ElButton, ElInput, ElMessage } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

// 示例数据
const items = ref([
  {
    id: 1,
    title: '示例项目 1',
    description: '这是一个示例项目的描述',
    date: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 2,
    title: '示例项目 2',
    description: '这是另一个示例项目的描述',
    date: new Date().toISOString(),
    status: 'pending'
  }
])

// 搜索功能
const searchQuery = ref('')
const handleSearch = () => {
  ElMessage.success(`搜索: ${searchQuery.value}`)
}

// 新建功能
const handleCreate = () => {
  ElMessage.success('创建新项目')
}
</script>

<template>
  <div class="new-view">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="left">
        <h2>新视图</h2>
      </div>
      <div class="right">
        <el-input
          v-model="searchQuery"
          placeholder="搜索..."
          class="search-input"
          :prefix-icon="Search"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" :icon="Plus" @click="handleCreate">
          新建
        </el-button>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <div v-for="item in items" :key="item.id" class="item-card">
        <div class="item-header">
          <h3>{{ item.title }}</h3>
          <span class="status" :class="item.status">{{ item.status }}</span>
        </div>
        <p class="description">{{ item.description }}</p>
        <div class="meta">
          <span class="date">{{ new Date(item.date).toLocaleDateString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-view {
  height: 100%;
  padding: 24px;
  overflow-y: auto;
  background: var(--el-bg-color);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.toolbar h2 {
  margin: 0;
  font-size: 24px;
  color: var(--el-text-color-primary);
}

.right {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  width: 240px;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.item-card {
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.active {
  background: var(--el-color-success-light-9);
  color: var(--el-color-success);
}

.status.pending {
  background: var(--el-color-warning-light-9);
  color: var(--el-color-warning);
}

.description {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

@media screen and (max-width: 768px) {
  .new-view {
    padding: 16px;
  }

  .toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .right {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }

  .content {
    grid-template-columns: 1fr;
  }
}
</style> 