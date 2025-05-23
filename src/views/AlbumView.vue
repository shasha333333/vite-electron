<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElButton, ElInput, ElDialog, ElMessage } from 'element-plus'
import { Plus, Edit, Delete, Picture } from '@element-plus/icons-vue'
import AlbumContentView from './AlbumContentView.vue'

const router = useRouter()

// 相册数据
const albums = ref([
  {
    id: 1,
    name: '风景相册',
    cover: 'https://picsum.photos/400/300',
    count: 45,
    lastUpdate: '2024-03-20',
    description: '收集了各种美丽的风景照片'
  },
  {
    id: 2,
    name: '人物相册',
    cover: 'https://picsum.photos/400/301',
    count: 32,
    lastUpdate: '2024-03-19',
    description: '家人和朋友的照片'
  },
  {
    id: 3,
    name: '旅行相册',
    cover: 'https://picsum.photos/400/302',
    count: 78,
    lastUpdate: '2024-03-18',
    description: '旅行中的精彩瞬间'
  }
])

// 新建相册对话框
const showCreateDialog = ref(false)
const newAlbum = ref({
  name: '',
  description: ''
})

// 编辑相册对话框
const showEditDialog = ref(false)
const editingAlbum = ref({
  id: 0,
  name: '',
  description: ''
})

// 当前显示的视图
const currentView = ref<'list' | 'content'>('list')
// 当前选中的相册
const selectedAlbum = ref<any>(null)

// 创建新相册
const createAlbum = () => {
  if (!newAlbum.value.name) {
    ElMessage.warning('请输入相册名称')
    return
  }
  
  albums.value.push({
    id: Date.now(),
    name: newAlbum.value.name,
    cover: 'https://picsum.photos/400/300',
    count: 0,
    lastUpdate: new Date().toISOString().split('T')[0],
    description: newAlbum.value.description
  })
  
  showCreateDialog.value = false
  newAlbum.value = { name: '', description: '' }
  ElMessage.success('相册创建成功')
}

// 编辑相册
const editAlbum = (album: any) => {
  editingAlbum.value = { ...album }
  showEditDialog.value = true
}

// 保存编辑
const saveEdit = () => {
  const index = albums.value.findIndex(a => a.id === editingAlbum.value.id)
  if (index !== -1) {
    albums.value[index] = {
      ...albums.value[index],
      name: editingAlbum.value.name,
      description: editingAlbum.value.description
    }
    showEditDialog.value = false
    ElMessage.success('相册更新成功')
  }
}

// 删除相册
const deleteAlbum = (id: number) => {
  const index = albums.value.findIndex(a => a.id === id)
  if (index !== -1) {
    albums.value.splice(index, 1)
    ElMessage.success('相册删除成功')
  }
}

// 跳转到相册内容页面
const navigateToAlbumContent = (albumId: number) => {
  router.push(`/album/${albumId}`)
}

// 处理相册卡片点击
const handleAlbumClick = (event: MouseEvent, album: any) => {
  // 如果点击的是操作按钮，不进行跳转
  const target = event.target as HTMLElement
  if (target.closest('.album-actions')) {
    return
  }
  // 切换到相册内容视图
  showAlbumContent(album)
}

// 切换到相册内容视图
const showAlbumContent = (album: any) => {
  selectedAlbum.value = {
    id: album.id,
    name: album.name,
    description: album.description,
    coverUrl: album.cover,
    photoCount: album.count,
    createdAt: album.lastUpdate
  }
  currentView.value = 'content'
}

// 返回相册列表
const backToList = () => {
  currentView.value = 'list'
  selectedAlbum.value = null
}
</script>

<template>
  <div class="album-view">
    <!-- 相册列表视图 -->
    <div v-if="currentView === 'list'">
      <div class="album-container">
        <!-- 工具栏 -->
        <div class="toolbar">
          <div class="left">
            <h2>相册</h2>
          </div>
          <div class="right">
            <el-button type="primary" :icon="Plus" @click="showCreateDialog = true">
              新建相册
            </el-button>
          </div>
        </div>

        <!-- 相册网格 -->
        <div class="album-grid">
          <div 
            v-for="album in albums" 
            :key="album.id" 
            class="album-card"
            @click="(event) => handleAlbumClick(event, album)"
          >
            <div class="album-cover">
              <img :src="album.cover" :alt="album.name" />
              <div class="album-actions">
                <el-button :icon="Edit" circle @click.stop="editAlbum(album)" />
                <el-button :icon="Delete" circle @click.stop="deleteAlbum(album.id)" />
              </div>
            </div>
            <div class="album-info">
              <h3>{{ album.name }}</h3>
              <p class="album-description">{{ album.description }}</p>
              <div class="album-meta">
                <span class="count">
                  <el-icon><Picture /></el-icon>
                  {{ album.count }}张照片
                </span>
                <span class="date">更新于 {{ album.lastUpdate }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 新建相册对话框 -->
        <el-dialog
          v-model="showCreateDialog"
          title="新建相册"
          width="500px"
        >
          <el-input
            v-model="newAlbum.name"
            placeholder="相册名称"
            class="mb-4"
          />
          <el-input
            v-model="newAlbum.description"
            type="textarea"
            placeholder="相册描述"
            :rows="3"
          />
          <template #footer>
            <el-button @click="showCreateDialog = false">取消</el-button>
            <el-button type="primary" @click="createAlbum">创建</el-button>
          </template>
        </el-dialog>

        <!-- 编辑相册对话框 -->
        <el-dialog
          v-model="showEditDialog"
          title="编辑相册"
          width="500px"
        >
          <el-input
            v-model="editingAlbum.name"
            placeholder="相册名称"
            class="mb-4"
          />
          <el-input
            v-model="editingAlbum.description"
            type="textarea"
            placeholder="相册描述"
            :rows="3"
          />
          <template #footer>
            <el-button @click="showEditDialog = false">取消</el-button>
            <el-button type="primary" @click="saveEdit">保存</el-button>
          </template>
        </el-dialog>
      </div>
    </div>

    <!-- 相册内容视图 -->
    <AlbumContentView
      v-else
      :album="selectedAlbum"
      @back="backToList"
    />
  </div>
</template>

<style scoped>
.album-view {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.album-container {
  height: 100%;
  padding: 24px;
  overflow-y: auto;
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
  color: #202124;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.album-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.album-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.album-cover {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.album-actions {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.3s;
}

.album-card:hover .album-actions {
  opacity: 1;
}

.album-info {
  padding: 16px;
}

.album-info h3 {
  margin: 0 0 8px;
  font-size: 18px;
  color: #202124;
}

.album-description {
  margin: 0 0 12px;
  font-size: 14px;
  color: #5f6368;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.album-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #5f6368;
}

.count {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>