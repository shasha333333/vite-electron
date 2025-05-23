import type { Photo } from '../types/photo'
import type { ImageService } from '../types/electron/services'
import { ImageStatus } from '../../electron/types/common'

// 图片服务中间件
class ImageServiceMiddleware {
  private service: ImageService

  constructor() {
    this.service = window.electronAPI.image
  }

  // 获取图片列表
  async getImages(filters?: Record<string, any>, options?: {
    page?: number;
    pageSize?: number;
  }): Promise<Photo[]> {
    try {
      const response = await this.service.listImages(filters, options)
      if (response.success && response.data) {
        return response.data.map(img => ({
          id: parseInt(img.id),
          url: img.path,
          name: img.name,
          date: new Date().toISOString().split('T')[0], // 从元数据中获取
          category: '', // 从标签中获取
          size: `${(img.size / (1024 * 1024)).toFixed(1)}MB`,
          dimensions: '', // 从元数据中获取
          location: '', // 从元数据中获取
          tags: [], // 从标签中获取
          favorite: false,
          description: ''
        }))
      }
      return []
    } catch (error) {
      console.error('获取图片列表失败:', error)
      return []
    }
  }

  // 添加新图片
  async addImage(imageData: Omit<Photo, 'id'>): Promise<Photo | null> {
    try {
      const response = await this.service.createImage({
        name: imageData.name,
        path: imageData.url,
        size: parseInt(imageData.size) * 1024 * 1024, // 转换为字节
        status: ImageStatus.UPLOADING
      })

      if (response.success && response.data) {
        return {
          ...imageData,
          id: parseInt(response.data.id)
        }
      }
      return null
    } catch (error) {
      console.error('添加图片失败:', error)
      return null
    }
  }

  // 更新图片
  async updateImage(id: number, updates: Partial<Photo>): Promise<Photo | null> {
    try {
      const response = await this.service.updateImage(id.toString(), {
        name: updates.name,
        path: updates.url,
        size: updates.size ? parseInt(updates.size) * 1024 * 1024 : undefined,
        status: updates.favorite ? ImageStatus.READY : ImageStatus.PROCESSING
      })

      if (response.success && response.data?.updated) {
        const image = await this.getImage(id)
        return image
      }
      return null
    } catch (error) {
      console.error('更新图片失败:', error)
      return null
    }
  }

  // 删除图片
  async deleteImage(id: number): Promise<boolean> {
    try {
      const response = await this.service.deleteImage(id.toString())
      return response.success && response.data?.deleted || false
    } catch (error) {
      console.error('删除图片失败:', error)
      return false
    }
  }

  // 获取单个图片
  async getImage(id: number): Promise<Photo | null> {
    try {
      const response = await this.service.getImage(id.toString())
      if (response.success && response.data) {
        const img = response.data
        return {
          id: parseInt(img.id),
          url: img.path,
          name: img.name,
          date: new Date().toISOString().split('T')[0],
          category: '',
          size: `${(img.size / (1024 * 1024)).toFixed(1)}MB`,
          dimensions: '',
          location: '',
          tags: [],
          favorite: img.status === ImageStatus.READY,
          description: ''
        }
      }
      return null
    } catch (error) {
      console.error('获取图片失败:', error)
      return null
    }
  }

  // 按类别获取图片
  async getImagesByCategory(category: string): Promise<Photo[]> {
    return this.getImages({ category })
  }

  // 获取收藏的图片
  async getFavoriteImages(): Promise<Photo[]> {
    return this.getImages({ status: ImageStatus.READY })
  }

  // 按标签获取图片
  async getImagesByTag(tag: string): Promise<Photo[]> {
    return this.getImages({ tags: [tag] })
  }

  // 按日期范围获取图片
  async getImagesByDateRange(startDate: string, endDate: string): Promise<Photo[]> {
    return this.getImages({
      dateRange: {
        start: startDate,
        end: endDate
      }
    })
  }

  // 获取所有标签
  async getAllTags(): Promise<string[]> {
    try {
      // 这里需要调用后端的标签服务
      // 暂时返回空数组
      return []
    } catch (error) {
      console.error('获取标签列表失败:', error)
      return []
    }
  }

  // 获取所有类别
  async getAllCategories(): Promise<string[]> {
    try {
      // 这里需要调用后端的分类服务
      // 暂时返回空数组
      return []
    } catch (error) {
      console.error('获取类别列表失败:', error)
      return []
    }
  }
}

// 导出单例实例
export const imageService = new ImageServiceMiddleware() 