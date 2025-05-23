<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElButton, ElInput, ElTag, ElMessage, ElDialog } from 'element-plus'
import { 
  Plus,
  Edit,
  Delete,
  Star,
  StarFilled,
  Picture,
  VideoCamera
} from '@element-plus/icons-vue'

// 标注数据
const annotations = ref([
  {
    id: 1,
    url: 'https://picsum.photos/400/300',
    name: '风景照片1.jpg',
    tags: ['风景', '自然', '山水'],
    favorite: true,
    description: '美丽的山水风景照片'
  },
  {
    id: 2,
    url: 'https://picsum.photos/400/301',
    name: '风景照片2.jpg',
    tags: ['风景', '城市'],
    favorite: false,
    description: '城市夜景照片'
  },
  {
    id: 3,
    url: 'https://picsum.photos/400/302',
    name: '风景照片3.jpg',
    tags: ['风景', '自然'],
    favorite: false,
    description: '自然风光照片'
  }
])

// 标签管理
const tags = ref(['风景', '自然', '山水', '城市', '人物', '建筑'])
const newTag = ref('')
const showTagDialog = ref(false)
const editingTag = ref('')

// 标注编辑
const showAnnotationDialog = ref(false)
const currentAnnotation = ref<any>(null)
const newAnnotation = ref({
  tags: [] as string[],
  description: '',
  favorite: false
})

// 添加标签
const addTag = () => {
  if (newTag.value && !tags.value.includes(newTag.value)) {
    tags.value.push(newTag.value)
    newTag.value = ''
  }
}

// 删除标签
const deleteTag = (tag: string) => {
  const index = tags.value.indexOf(tag)
  if (index > -1) {
    tags.value.splice(index, 1)
  }
}

// 编辑标签
const editTag = (tag: string) => {
  editingTag.value = tag
  showTagDialog.value = true
}

// 保存标签编辑
const saveTagEdit = () => {
  if (editingTag.value && !tags.value.includes(editingTag.value)) {
    const index = tags.value.indexOf(editingTag.value)
    if (index > -1) {
      tags.value[index] = editingTag.value
    }
  }
  showTagDialog.value = false
  editingTag.value = ''
}

// 添加标注
const addAnnotation = (annotation: any) => {
  showAnnotationDialog.value = true
  currentAnnotation.value = annotation
  newAnnotation.value = {
    tags: [...annotation.tags],
    description: annotation.description,
    favorite: annotation.favorite
  }
}

// 保存标注
const saveAnnotation = () => {
  if (currentAnnotation.value) {
    currentAnnotation.value.tags = [...newAnnotation.value.tags]
    currentAnnotation.value.description = newAnnotation.value.description
    currentAnnotation.value.favorite = newAnnotation.value.favorite
  }
  showAnnotationDialog.value = false
}

// 切换收藏状态
const toggleFavorite = (annotation: any) => {
  annotation.favorite = !annotation.favorite
}

// 删除标注
const deleteAnnotation = (annotation: any) => {
  const index = annotations.value.indexOf(annotation)
  if (index > -1) {
    annotations.value.splice(index, 1)
  }
}

// 计算收藏数量
const favoriteCount = computed(() => {
  return annotations.value.filter(a => a.favorite).length
})
</script>

<template>
  <div class="annotation-container">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="left">
        <el-button :icon="StarFilled" type="primary" plain>
          收藏夹 ({{ favoriteCount }})
        </el-button>
      </div>
      <div class="right">
        <el-button :icon="Plus" @click="showTagDialog = true">管理标签</el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧标签列表 -->
      <div class="tags-panel">
        <h3>标签列表</h3>
        <div class="tags-list">
          <el-tag
            v-for="tag in tags"
            :key="tag"
            closable
            @close="deleteTag(tag)"
            @click="editTag(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <!-- 右侧标注列表 -->
      <div class="annotations-panel">
        <div class="annotations-grid">
          <div
            v-for="annotation in annotations"
            :key="annotation.id"
            class="annotation-item"
          >
            <div class="image-container">
              <img :src="annotation.url" :alt="annotation.name" />
              <div class="image-overlay">
                <el-button
                  :icon="annotation.favorite ? StarFilled : Star"
                  circle
                  @click="toggleFavorite(annotation)"
                />
                <el-button
                  :icon="Edit"
                  circle
                  @click="addAnnotation(annotation)"
                />
                <el-button
                  :icon="Delete"
                  circle
                  type="danger"
                  @click="deleteAnnotation(annotation)"
                />
              </div>
            </div>
            <div class="annotation-info">
              <div class="annotation-header">
                <span class="image-name">{{ annotation.name }}</span>
                <el-button
                  :icon="annotation.favorite ? StarFilled : Star"
                  circle
                  @click="toggleFavorite(annotation)"
                />
              </div>
              <div class="annotation-tags">
                <el-tag
                  v-for="tag in annotation.tags"
                  :key="tag"
                  size="small"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <p class="annotation-description">{{ annotation.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签管理对话框 -->
    <el-dialog
      v-model="showTagDialog"
      title="管理标签"
      width="400px"
    >
      <div class="tag-dialog-content">
        <div class="tag-input">
          <el-input
            v-model="newTag"
            placeholder="输入新标签"
            @keyup.enter="addTag"
          >
            <template #append>
              <el-button @click="addTag">添加</el-button>
            </template>
          </el-input>
        </div>
        <div class="tags-list">
          <el-tag
            v-for="tag in tags"
            :key="tag"
            closable
            @close="deleteTag(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </el-dialog>

    <!-- 标注编辑对话框 -->
    <el-dialog
      v-model="showAnnotationDialog"
      title="编辑标注"
      width="500px"
    >
      <div class="annotation-dialog-content">
        <div class="form-item">
          <label>标签</label>
          <div class="tags-input">
            <el-tag
              v-for="tag in newAnnotation.tags"
              :key="tag"
              closable
              @close="newAnnotation.tags = newAnnotation.tags.filter(t => t !== tag)"
            >
              {{ tag }}
            </el-tag>
            <el-select
              v-model="newAnnotation.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="选择或创建标签"
            >
              <el-option
                v-for="tag in tags"
                :key="tag"
                :label="tag"
                :value="tag"
              />
            </el-select>
          </div>
        </div>
        <div class="form-item">
          <label>描述</label>
          <el-input
            v-model="newAnnotation.description"
            type="textarea"
            :rows="3"
            placeholder="输入图片描述"
          />
        </div>
        <div class="form-item">
          <el-checkbox v-model="newAnnotation.favorite">
            添加到收藏夹
          </el-checkbox>
        </div>
      </div>
      <template #footer>
        <el-button @click="showAnnotationDialog = false">取消</el-button>
        <el-button type="primary" @click="saveAnnotation">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.annotation-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.toolbar {
  height: 64px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.tags-panel {
  width: 250px;
  padding: 24px;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.tags-panel h3 {
  margin: 0 0 16px;
  font-size: 16px;
  color: #202124;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags-list .el-tag {
  cursor: pointer;
}

.annotations-panel {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.annotations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.annotation-item {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.annotation-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-container {
  position: relative;
  aspect-ratio: 16/9;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.annotation-item:hover .image-overlay {
  opacity: 1;
}

.annotation-info {
  padding: 16px;
}

.annotation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.image-name {
  font-size: 16px;
  color: #202124;
  font-weight: 500;
}

.annotation-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.annotation-description {
  margin: 0;
  font-size: 14px;
  color: #5f6368;
  line-height: 1.5;
}

.tag-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tag-input {
  margin-bottom: 16px;
}

.annotation-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item label {
  font-size: 14px;
  color: #5f6368;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.tags-input .el-select {
  width: 100%;
}
</style> 