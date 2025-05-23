<script setup lang="ts">
import { ref } from 'vue'
import { ElCard, ElTabs, ElTabPane } from 'element-plus'
import { DataLine, Histogram, PieChart } from '@element-plus/icons-vue'

// 预留数据结构
const storageStats = ref({
  totalSpace: 0,
  usedSpace: 0,
  fileTypes: []
})

const usageStats = ref({
  editHistory: [],
  favorites: [],
  shares: []
})

// TODO: 实现统计数据的获取和展示逻辑
</script>

<template>
  <div class="stats-view">
    <el-tabs type="border-card">
      <!-- 存储统计 -->
      <el-tab-pane>
        <template #label>
          <el-icon><DataLine /></el-icon>
          <span>存储统计</span>
        </template>
        <div class="stats-content">
          <el-card class="stats-card">
            <template #header>
              <div class="card-header">
                <span>存储空间</span>
              </div>
            </template>
            <div class="placeholder-content">
              存储空间统计（待实现）
            </div>
          </el-card>
          
          <el-card class="stats-card">
            <template #header>
              <div class="card-header">
                <span>文件类型分布</span>
              </div>
            </template>
            <div class="placeholder-content">
              文件类型分布统计（待实现）
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 使用统计 -->
      <el-tab-pane>
        <template #label>
          <el-icon><Histogram /></el-icon>
          <span>使用统计</span>
        </template>
        <div class="stats-content">
          <el-card class="stats-card">
            <template #header>
              <div class="card-header">
                <span>编辑历史</span>
              </div>
            </template>
            <div class="placeholder-content">
              编辑历史统计（待实现）
            </div>
          </el-card>
          
          <el-card class="stats-card">
            <template #header>
              <div class="card-header">
                <span>收藏统计</span>
              </div>
            </template>
            <div class="placeholder-content">
              收藏统计（待实现）
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 分享统计 -->
      <el-tab-pane>
        <template #label>
          <el-icon><PieChart /></el-icon>
          <span>分享统计</span>
        </template>
        <div class="stats-content">
          <el-card class="stats-card">
            <template #header>
              <div class="card-header">
                <span>分享历史</span>
              </div>
            </template>
            <div class="placeholder-content">
              分享历史统计（待实现）
            </div>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.stats-view {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.stats-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
}

.stats-card {
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.placeholder-content {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

:deep(.el-tabs__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style> 