<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElTag, ElInput, ElButton } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'

interface Annotation {
  id: string
  label: string
  confidence: number
  color: string
}

interface ImageAnnotation {
  imageId: string
  annotations: Annotation[]
}

const currentImage = ref<HTMLImageElement | null>(null)
const imageUrl = ref('')
const annotations = ref<Annotation[]>([])
const newLabel = ref('')
const selectedAnnotation = ref<Annotation | null>(null)
const isDrawing = ref(false)
const startPoint = ref({ x: 0, y: 0 })
const currentRect = ref({ x: 0, y: 0, width: 0, height: 0 })
const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

const colors = [
  '#409EFF', '#67C23A', '#E6A23C', '#F56C6C',
  '#909399', '#9B59B6', '#3498DB', '#E74C3C'
]

onMounted(() => {
  // 初始化画布
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
  }
})

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  currentImage.value = img
  if (canvas.value && ctx.value) {
    canvas.value.width = img.width
    canvas.value.height = img.height
    ctx.value.drawImage(img, 0, 0)
  }
}

const addAnnotation = () => {
  if (!newLabel.value) {
    ElMessage.warning('请输入标签名称')
    return
  }

  const color = colors[annotations.value.length % colors.length]
  const annotation: Annotation = {
    id: Date.now().toString(),
    label: newLabel.value,
    confidence: 1,
    color
  }

  annotations.value.push(annotation)
  newLabel.value = ''
  drawAnnotations()
}

const removeAnnotation = (id: string) => {
  annotations.value = annotations.value.filter(a => a.id !== id)
  drawAnnotations()
}

const startDrawing = (event: MouseEvent) => {
  if (!canvas.value) return
  
  isDrawing.value = true
  const rect = canvas.value.getBoundingClientRect()
  startPoint.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

const draw = (event: MouseEvent) => {
  if (!isDrawing.value || !canvas.value) return
  
  const rect = canvas.value.getBoundingClientRect()
  const currentX = event.clientX - rect.left
  const currentY = event.clientY - rect.top
  
  currentRect.value = {
    x: Math.min(startPoint.value.x, currentX),
    y: Math.min(startPoint.value.y, currentY),
    width: Math.abs(currentX - startPoint.value.x),
    height: Math.abs(currentY - startPoint.value.y)
  }
  
  drawAnnotations()
  if (ctx.value) {
    ctx.value.strokeStyle = '#409EFF'
    ctx.value.lineWidth = 2
    ctx.value.strokeRect(
      currentRect.value.x,
      currentRect.value.y,
      currentRect.value.width,
      currentRect.value.height
    )
  }
}

const stopDrawing = () => {
  isDrawing.value = false
  if (selectedAnnotation.value) {
    // 保存标注区域
    drawAnnotations()
  }
}

const drawAnnotations = () => {
  if (!ctx.value || !currentImage.value) return
  
  ctx.value.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
  ctx.value.drawImage(currentImage.value, 0, 0)
  
  annotations.value.forEach(annotation => {
    ctx.value!.strokeStyle = annotation.color
    ctx.value!.lineWidth = 2
    ctx.value!.strokeRect(
      currentRect.value.x,
      currentRect.value.y,
      currentRect.value.width,
      currentRect.value.height
    )
  })
}

const saveAnnotations = () => {
  // 这里应该调用后端 API 保存标注
  ElMessage.success('标注已保存')
}
</script>

<template>
  <div class="annotation-editor">
    <div class="editor-container">
      <div class="canvas-container">
        <canvas
          ref="canvas"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
        ></canvas>
      </div>
      
      <div class="annotation-panel">
        <div class="annotation-input">
          <el-input
            v-model="newLabel"
            placeholder="输入标签名称"
            @keyup.enter="addAnnotation"
          >
            <template #append>
              <el-button @click="addAnnotation">
                <el-icon><Plus /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
        
        <div class="annotation-list">
          <div
            v-for="annotation in annotations"
            :key="annotation.id"
            class="annotation-item"
          >
            <el-tag
              :color="annotation.color"
              effect="dark"
              class="annotation-tag"
            >
              {{ annotation.label }}
            </el-tag>
            <el-button
              type="danger"
              :icon="Delete"
              circle
              size="small"
              @click="removeAnnotation(annotation.id)"
            />
          </div>
        </div>
        
        <div class="annotation-actions">
          <el-button type="primary" @click="saveAnnotations">
            保存标注
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.annotation-editor {
  padding: 20px;
  height: 100%;
}

.editor-container {
  display: flex;
  gap: 20px;
  height: 100%;
}

.canvas-container {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.canvas-container canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.annotation-panel {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.annotation-input {
  margin-bottom: 20px;
}

.annotation-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.annotation-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.annotation-tag {
  margin-right: 10px;
}

.annotation-actions {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #dcdfe6;
}
</style> 