import { ImageDAO } from '../dao/image.dao.mjs';
import { ImageStatus } from '../../types/common.ts';

export class ImageService {
  constructor() {
    this.imageDAO = new ImageDAO();
  }

  // 创建图片
  async createImage(imageData) {
    try {
      const imageId = await this.imageDAO.createImage(imageData);
      return { success: true, data: { id: imageId } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 获取图片
  async getImage(id) {
    try {
      const image = await this.imageDAO.getImage(id);
      if (!image) {
        return { success: false, error: '图片不存在' };
      }
      return { success: true, data: image };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 更新图片
  async updateImage(id, imageData) {
    try {
      const exists = await this.imageDAO.imageExists(id);
      if (!exists) {
        return { success: false, error: '图片不存在' };
      }
      
      const updated = await this.imageDAO.updateImage(id, imageData);
      return { success: updated, data: { updated } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 删除图片
  async deleteImage(id) {
    try {
      const exists = await this.imageDAO.imageExists(id);
      if (!exists) {
        return { success: false, error: '图片不存在' };
      }
      
      const deleted = await this.imageDAO.deleteImage(id);
      return { success: deleted, data: { deleted } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 获取图片列表
  async listImages(filters = {}, options = {}) {
    try {
      const images = await this.imageDAO.listImages(filters, options);
      return { success: true, data: images };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 更新图片状态
  async updateImageStatus(id, status) {
    try {
      const exists = await this.imageDAO.imageExists(id);
      if (!exists) {
        return { success: false, error: '图片不存在' };
      }
      
      const updated = await this.imageDAO.updateStatus(id, status);
      return { success: updated, data: { updated } };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
} 