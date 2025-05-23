<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElUpload, ElButton, ElProgress } from 'element-plus'
import { Upload, Delete, Download } from '@element-plus/icons-vue'

interface ImageFile {
  id: string
  name: string
  url: string
  thumbnail: string
  size: number
  type: string
  uploadTime: Date
}

const imageList = ref<ImageFile[]>([])
const uploadRef = ref()
const uploading = ref(false)
const uploadProgress = ref(0)

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const files = e.dataTransfer?.files
  if (files) {
    handleFiles(Array.from(files))
  }
}

const handleFiles = async (files: File[]) => {
  uploading.value = true
  uploadProgress.value = 0
  
  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      ElMessage.error(`${file.name} 不是有效的图片文件`)
      continue
    }
    
    try {
      // 这里应该调用后端 API 上传文件
      // 现在只是模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const imageUrl = URL.createObjectURL(file)
      const thumbnail = await createThumbnail(file)
      
      imageList.value.push({
        id: Date.now().toString(),
        name: file.name,
        url: imageUrl,
        thumbnail,
        size: file.size,
        type: file.type,
        uploadTime: new Date()
      })
      
      uploadProgress.value += (100 / files.length)
    } catch (error) {
      ElMessage.error(`上传 ${file.name} 失败`)
    }
  }
  
  uploading.value = false
  uploadProgress.value = 100
  ElMessage.success('上传完成')
}

const createThumbnail = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const size = 200
        
        canvas.width = size
        canvas.height = size
        
        ctx?.drawImage(img, 0, 0, size, size)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

const handleDelete = (id: string) => {
  imageList.value = imageList.value.filter(img => img.id !== id)
  ElMessage.success('删除成功')
}

const handleDownload = (image: ImageFile) => {
  const link = document.createElement('a')
  link.href = image.url
  link.download = image.name
  link.click()
}
</script>

<template>
  <div class="file-management">
    <div class="upload-area"
         @drop="handleDrop"
         @dragover.prevent
         @dragenter.prevent>
      <el-upload
        ref="uploadRef"
        class="upload-component"
        drag
        multiple
        :auto-upload="false"
        :show-file-list="false"
        accept="image/*"
        @change="(file) => file.raw ? handleFiles([file.raw]) : null"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽文件到此处或 <em>点击上传</em>
        </div>
      </el-upload>
    </div>

    <el-progress
      v-if="uploading"
      :percentage="uploadProgress"
      :format="(percentage) => `上传进度: ${percentage}%`"
    />

    <div class="image-grid">
      <div v-for="image in imageList" :key="image.id" class="image-item">
        <img :src="image.thumbnail" :alt="image.name" />
        <div class="image-info">
          <span class="image-name">{{ image.name }}</span>
          <div class="image-actions">
            <el-button
              type="danger"
              :icon="Delete"
              circle
              @click="handleDelete(image.id)"
            />
            <el-button
              type="primary"
              :icon="Download"
              circle
              @click="handleDownload(image)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-management {
  padding: 20px;
}

.upload-area {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
  background-color: #fafafa;
}

.upload-area:hover {
  border-color: #409eff;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.image-item {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s;
}

.image-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.image-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.image-info {
  padding: 10px;
  background-color: #fff;
}

.image-name {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.image-actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
</style> 