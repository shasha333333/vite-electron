import type { Photo } from '../types/photo'

// 生成随机图片URL
const getRandomImageUrl = (id: number) => {
  const seed = Math.floor(Math.random() * 1000)
  return `https://picsum.photos/seed/${seed}/800/600`
}

// 生成随机日期
const getRandomDate = (year: number, month: number) => {
  const day = Math.floor(Math.random() * 28) + 1
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
}

// 生成随机图片数据
const generateMockImage = (id: number, year: number, month: number): Photo => {
  const categories = ['风景', '人物', '动物', '建筑', '美食', '植物', '人文', '街拍', '夜景', '微距']
  const locations = ['北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '西安', '南京', '武汉', '厦门', '青岛', '大连', '三亚', '丽江']
  const tags = ['风景', '自然', '春天', '人物', '肖像', '街拍', '动物', '野生动物', '建筑', '城市', '现代', '美食', '川菜', '餐厅', '植物', '花卉', '人文', '历史', '文化', '夜景', '微距', '特写']
  
  const category = categories[Math.floor(Math.random() * categories.length)]
  const location = locations[Math.floor(Math.random() * locations.length)]
  const selectedTags = Array.from(new Set([
    category,
    ...Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
      tags[Math.floor(Math.random() * tags.length)]
    )
  ]))

  return {
    id,
    url: getRandomImageUrl(id),
    name: `${category}照片${id}`,
    date: getRandomDate(year, month),
    category,
    size: `${(Math.random() * 5 + 1).toFixed(1)}MB`,
    dimensions: `${Math.floor(Math.random() * 2000 + 1000)}x${Math.floor(Math.random() * 2000 + 1000)}`,
    location,
    tags: selectedTags,
    favorite: Math.random() > 0.7,
    description: `${location}${category}随拍`
  }
}

// 生成模拟图片数据
export const mockImages: Photo[] = [
  // 2024年
  ...Array.from({ length: 30 }, (_, i) => generateMockImage(i + 1, 2024, 3)),
  ...Array.from({ length: 25 }, (_, i) => generateMockImage(i + 31, 2024, 2)),
  ...Array.from({ length: 20 }, (_, i) => generateMockImage(i + 56, 2024, 1)),
  // 2023年
  ...Array.from({ length: 35 }, (_, i) => generateMockImage(i + 76, 2023, 12)),
  ...Array.from({ length: 30 }, (_, i) => generateMockImage(i + 111, 2023, 11)),
  ...Array.from({ length: 25 }, (_, i) => generateMockImage(i + 141, 2023, 10)),
  ...Array.from({ length: 28 }, (_, i) => generateMockImage(i + 166, 2023, 9)),
  ...Array.from({ length: 32 }, (_, i) => generateMockImage(i + 194, 2023, 8)),
  ...Array.from({ length: 40 }, (_, i) => generateMockImage(i + 226, 2023, 7)),
  ...Array.from({ length: 35 }, (_, i) => generateMockImage(i + 266, 2023, 6)),
  ...Array.from({ length: 30 }, (_, i) => generateMockImage(i + 301, 2023, 5)),
  ...Array.from({ length: 25 }, (_, i) => generateMockImage(i + 331, 2023, 4)),
  ...Array.from({ length: 20 }, (_, i) => generateMockImage(i + 356, 2023, 3)),
  ...Array.from({ length: 15 }, (_, i) => generateMockImage(i + 376, 2023, 2)),
  ...Array.from({ length: 10 }, (_, i) => generateMockImage(i + 391, 2023, 1)),
]

// 模拟时间线数据
export interface TimelineMonth {
  month: number
  count: number
  videos: number
  images: Photo[]
}

export interface TimelineYear {
  year: number
  months: TimelineMonth[]
}

// 生成时间线数据
export const mockTimelineData: TimelineYear[] = [
  {
    year: 2024,
    months: [
      {
        month: 3,
        count: 30,
        videos: 2,
        images: mockImages.filter(img => img.date.startsWith('2024-03'))
      },
      {
        month: 2,
        count: 25,
        videos: 1,
        images: mockImages.filter(img => img.date.startsWith('2024-02'))
      },
      {
        month: 1,
        count: 20,
        videos: 0,
        images: mockImages.filter(img => img.date.startsWith('2024-01'))
      }
    ]
  },
  {
    year: 2023,
    months: [
      {
        month: 12,
        count: 35,
        videos: 3,
        images: mockImages.filter(img => img.date.startsWith('2023-12'))
      },
      {
        month: 11,
        count: 30,
        videos: 2,
        images: mockImages.filter(img => img.date.startsWith('2023-11'))
      },
      {
        month: 10,
        count: 25,
        videos: 1,
        images: mockImages.filter(img => img.date.startsWith('2023-10'))
      },
      {
        month: 9,
        count: 28,
        videos: 2,
        images: mockImages.filter(img => img.date.startsWith('2023-09'))
      },
      {
        month: 8,
        count: 32,
        videos: 3,
        images: mockImages.filter(img => img.date.startsWith('2023-08'))
      },
      {
        month: 7,
        count: 40,
        videos: 4,
        images: mockImages.filter(img => img.date.startsWith('2023-07'))
      },
      {
        month: 6,
        count: 35,
        videos: 2,
        images: mockImages.filter(img => img.date.startsWith('2023-06'))
      },
      {
        month: 5,
        count: 30,
        videos: 1,
        images: mockImages.filter(img => img.date.startsWith('2023-05'))
      },
      {
        month: 4,
        count: 25,
        videos: 2,
        images: mockImages.filter(img => img.date.startsWith('2023-04'))
      },
      {
        month: 3,
        count: 20,
        videos: 1,
        images: mockImages.filter(img => img.date.startsWith('2023-03'))
      },
      {
        month: 2,
        count: 15,
        videos: 0,
        images: mockImages.filter(img => img.date.startsWith('2023-02'))
      },
      {
        month: 1,
        count: 10,
        videos: 1,
        images: mockImages.filter(img => img.date.startsWith('2023-01'))
      }
    ]
  }
]

// 获取模拟图片数据
export const getMockImages = () => {
  return mockImages
}

// 获取模拟时间线数据
export const getMockTimelineData = () => {
  return mockTimelineData
}

// 添加新的模拟图片
export const addMockImage = (image: Omit<Photo, 'id'>) => {
  const newImage: Photo = {
    ...image,
    id: mockImages.length + 1
  }
  mockImages.push(newImage)
  return newImage
}

// 更新模拟图片
export const updateMockImage = (id: number, updates: Partial<Photo>) => {
  const index = mockImages.findIndex(img => img.id === id)
  if (index !== -1) {
    mockImages[index] = { ...mockImages[index], ...updates }
    return mockImages[index]
  }
  return null
}

// 删除模拟图片
export const deleteMockImage = (id: number) => {
  const index = mockImages.findIndex(img => img.id === id)
  if (index !== -1) {
    mockImages.splice(index, 1)
    return true
  }
  return false
}

// 按类别获取图片
export const getImagesByCategory = (category: string) => {
  return mockImages.filter(img => img.category === category)
}

// 获取收藏的图片
export const getFavoriteImages = () => {
  return mockImages.filter(img => img.favorite)
}

// 按标签获取图片
export const getImagesByTag = (tag: string) => {
  return mockImages.filter(img => img.tags.includes(tag))
}

// 按日期范围获取图片
export const getImagesByDateRange = (startDate: string, endDate: string) => {
  return mockImages.filter(img => {
    const date = new Date(img.date)
    return date >= new Date(startDate) && date <= new Date(endDate)
  })
}

// 获取所有标签
export const getAllTags = () => {
  const tags = new Set<string>()
  mockImages.forEach(img => {
    img.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
}

// 获取所有类别
export const getAllCategories = () => {
  const categories = new Set<string>()
  mockImages.forEach(img => categories.add(img.category))
  return Array.from(categories)
} 