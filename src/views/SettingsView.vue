<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElTabs, ElTabPane, ElForm, ElFormItem, ElInput, ElSwitch, ElButton, ElMessage } from 'element-plus'
import { Folder, Monitor, Upload } from '@element-plus/icons-vue'

// 存储设置
const storageSettings = ref<{
  targetDirectory: string | null;
  autoBackup: boolean;
  backupInterval: number;
}>({
  targetDirectory: null,
  autoBackup: false,
  backupInterval: 24
})

// 界面设置
const uiSettings = ref({
  theme: 'light',
  layout: 'grid',
  enableShortcuts: true
})

// 导入设置
const importSettings = ref({
  autoImport: false,
  importRules: {
    renamePattern: '{date}_{name}',
    organizeByDate: true
  }
})

// 获取当前设置
const loadSettings = async () => {
  try {
    const targetDir = await window.electronAPI.getTargetDirectory()
    if (typeof targetDir === 'string' || targetDir === null) {
      storageSettings.value.targetDirectory = targetDir
    }
  } catch (error) {
    console.error('加载设置失败:', error)
    ElMessage.error('加载设置失败')
  }
}

// 保存设置
const saveSettings = async () => {
  try {
    // TODO: 实现设置保存逻辑
    ElMessage.success('设置已保存')
  } catch (error) {
    console.error('保存设置失败:', error)
    ElMessage.error('保存设置失败')
  }
}

// 选择存储目录
const handleSelectDirectory = async () => {
  try {
    const newDir = await window.electronAPI.selectTargetDirectory()
    if (typeof newDir === 'string') {
      storageSettings.value.targetDirectory = newDir
      ElMessage.success('存储目录已更新')
    }
  } catch (error) {
    console.error('选择目录失败:', error)
    ElMessage.error('选择目录失败')
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="settings-view">
    <el-tabs type="border-card">
      <!-- 存储设置 -->
      <el-tab-pane>
        <template #label>
          <el-icon><Folder /></el-icon>
          <span>存储设置</span>
        </template>
        <el-form label-position="top">
          <el-form-item label="存储位置">
            <div class="directory-select">
              <el-input :value="storageSettings.targetDirectory || ''" readonly />
              <el-button @click="handleSelectDirectory">选择目录</el-button>
            </div>
          </el-form-item>
          <el-form-item label="自动备份">
            <el-switch v-model="storageSettings.autoBackup" />
          </el-form-item>
          <el-form-item label="备份间隔（小时）">
            <el-input-number v-model="storageSettings.backupInterval" :min="1" :max="168" />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 界面设置 -->
      <el-tab-pane>
        <template #label>
          <el-icon><Monitor /></el-icon>
          <span>界面设置</span>
        </template>
        <el-form label-position="top">
          <el-form-item label="主题">
            <el-select v-model="uiSettings.theme">
              <el-option label="浅色" value="light" />
              <el-option label="深色" value="dark" />
            </el-select>
          </el-form-item>
          <el-form-item label="布局">
            <el-select v-model="uiSettings.layout">
              <el-option label="网格" value="grid" />
              <el-option label="列表" value="list" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用快捷键">
            <el-switch v-model="uiSettings.enableShortcuts" />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 导入设置 -->
      <el-tab-pane>
        <template #label>
          <el-icon><Upload /></el-icon>
          <span>导入设置</span>
        </template>
        <el-form label-position="top">
          <el-form-item label="自动导入">
            <el-switch v-model="importSettings.autoImport" />
          </el-form-item>
          <el-form-item label="文件命名规则">
            <el-input v-model="importSettings.importRules.renamePattern" />
          </el-form-item>
          <el-form-item label="按日期整理">
            <el-switch v-model="importSettings.importRules.organizeByDate" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <div class="settings-actions">
      <el-button type="primary" @click="saveSettings">保存设置</el-button>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.directory-select {
  display: flex;
  gap: 10px;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
}

:deep(.el-tabs__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style> 