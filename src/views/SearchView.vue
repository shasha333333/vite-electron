<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElInput, ElSelect, ElOption, ElDatePicker, ElTag, ElButton } from 'element-plus'
import { Search, Filter, Location, User, Picture, VideoCamera } from '@element-plus/icons-vue'

// 搜索条件
const searchQuery = ref('')
const selectedType = ref('all')
const selectedDate = ref('')
const selectedLocation = ref('')
const selectedPerson = ref('')

// 搜索历史
const searchHistory = ref([
  '风景照片',
  '北京旅行',
  '家庭聚会',
  '工作文档'
])

// 模拟搜索结果
const searchResults = ref([
  {
    id: 1,
    type: 'image',
    url: 'https://picsum.photos/400/300',
    title: '风景照片',
    date: '2024-03-20',
    location: '北京',
    people: ['张三', '李四'],
    tags: ['风景', '自然', '旅行']
  },
  {
    id: 2,
    type: 'video',
    url: 'https://picsum.photos/400/301',
    title: '家庭聚会',
    date: '2024-03-19',
    location: '上海',
    people: ['王五', '赵六'],
    tags: ['家庭', '聚会', '欢乐']
  }
])

// 过滤后的结果
const filteredResults = computed(() => {
  return searchResults.value.filter(item => {
    const matchesQuery = !searchQuery.value || 
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesType = selectedType.value === 'all' || item.type === selectedType.value
    const matchesDate = !selectedDate.value || item.date === selectedDate.value
    const matchesLocation = !selectedLocation.value || item.location === selectedLocation.value
    const matchesPerson = !selectedPerson.value || item.people.includes(selectedPerson.value)

    return matchesQuery && matchesType && matchesDate && matchesLocation && matchesPerson
  })
})

// 清除所有筛选条件
const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = 'all'
  selectedDate.value = ''
  selectedLocation.value = ''
  selectedPerson.value = ''
}
</script>

<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <div class="search-header">
      <div class="search-input-wrapper">
        <el-input
          v-model="searchQuery"
          placeholder="搜索照片、视频、人物、地点..."
          :prefix-icon="Search"
          class="search-input"
        />
      </div>
      <el-button :icon="Filter" @click="clearFilters">
        清除筛选
      </el-button>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-if="searchHistory.length">
      <h3>搜索历史</h3>
      <div class="history-tags">
        <el-tag
          v-for="item in searchHistory"
          :key="item"
          class="history-tag"
          @click="searchQuery = item"
        >
          {{ item }}
        </el-tag>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-group">
        <el-select v-model="selectedType" placeholder="类型">
          <el-option label="全部" value="all" />
          <el-option label="照片" value="image">
            <el-icon><Picture /></el-icon>
            <span>照片</span>
          </el-option>
          <el-option label="视频" value="video">
            <el-icon><VideoCamera /></el-icon>
            <span>视频</span>
          </el-option>
        </el-select>

        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择日期"
        />

        <el-select v-model="selectedLocation" placeholder="地点">
          <el-option label="北京" value="北京" />
          <el-option label="上海" value="上海" />
          <el-option label="广州" value="广州" />
        </el-select>

        <el-select v-model="selectedPerson" placeholder="人物">
          <el-option label="张三" value="张三" />
          <el-option label="李四" value="李四" />
          <el-option label="王五" value="王五" />
        </el-select>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div class="search-results">
      <div v-if="filteredResults.length === 0" class="no-results">
        <el-icon :size="48"><Search /></el-icon>
        <p>未找到相关结果</p>
      </div>

      <div v-else class="results-grid">
        <div v-for="item in filteredResults" :key="item.id" class="result-card">
          <div class="result-media">
            <img :src="item.url" :alt="item.title" />
            <div class="media-type">
              <el-icon v-if="item.type === 'image'"><Picture /></el-icon>
              <el-icon v-else><VideoCamera /></el-icon>
            </div>
          </div>
          <div class="result-info">
            <h3>{{ item.title }}</h3>
            <div class="result-meta">
              <span class="date">{{ item.date }}</span>
              <span class="location">
                <el-icon><Location /></el-icon>
                {{ item.location }}
              </span>
            </div>
            <div class="result-tags">
              <el-tag
                v-for="tag in item.tags"
                :key="tag"
                size="small"
                class="tag"
              >
                {{ tag }}
              </el-tag>
            </div>
            <div class="result-people">
              <el-icon><User /></el-icon>
              <span v-for="person in item.people" :key="person" class="person">
                {{ person }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  height: 100%;
  padding: 24px;
  overflow-y: auto;
}

.search-header {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input-wrapper {
  flex: 1;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  background-color: #f1f3f4;
  border-radius: 8px;
  box-shadow: none;
}

.search-history {
  margin-bottom: 24px;
}

.search-history h3 {
  font-size: 16px;
  color: #5f6368;
  margin: 0 0 12px;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag {
  cursor: pointer;
}

.filter-section {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.search-results {
  margin-top: 24px;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #5f6368;
}

.no-results p {
  margin: 16px 0 0;
  font-size: 16px;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.result-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.result-media {
  position: relative;
  aspect-ratio: 16/9;
}

.result-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-type {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
}

.result-info {
  padding: 16px;
}

.result-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #202124;
}

.result-meta {
  display: flex;
  gap: 16px;
  color: #5f6368;
  font-size: 14px;
  margin-bottom: 12px;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.result-people {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5f6368;
  font-size: 14px;
}

.person {
  color: #1a73e8;
}
</style> 