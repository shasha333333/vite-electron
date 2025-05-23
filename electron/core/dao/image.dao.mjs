import { BaseDAO } from './base.dao.mjs';
import { ImageStatus } from '../../types/common.mjs';
import { databaseService } from '../services/database.mjs';

export class ImageDAO extends BaseDAO {
  constructor() {
    super('images');
  }

  // 创建图片记录
  async createImage(imageData) {
    const now = new Date();
    const image = {
      ...imageData,
      status: ImageStatus.UPLOADING,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    
    const result = await databaseService.insert(this.tableName, image);
    return result.lastID;
  }

  // 批量创建图片记录
  async batchCreateImages(imagesData) {
    const now = new Date();
    const images = imagesData.map(data => ({
      ...data,
      status: ImageStatus.UPLOADING,
      createdAt: now,
      updatedAt: now,
      version: 1
    }));
    
    return await databaseService.batchInsert(this.tableName, images);
  }

  // 更新图片信息
  async updateImage(id, imageData) {
    const now = new Date();
    const image = {
      ...imageData,
      updatedAt: now,
      version: imageData.version ? imageData.version + 1 : 1
    };
    
    const result = await databaseService.update(
      this.tableName,
      image,
      { id }
    );
    return result.changes > 0;
  }

  // 批量更新图片信息
  async batchUpdateImages(updates) {
    const now = new Date();
    const data = updates.map(update => ({
      ...update.data,
      updatedAt: now,
      version: update.data.version ? update.data.version + 1 : 1
    }));
    
    return await databaseService.batchUpdate(
      this.tableName,
      updates.map(update => update.id),
      data
    );
  }

  // 删除图片记录
  async deleteImage(id) {
    const result = await databaseService.delete(
      this.tableName,
      { id }
    );
    return result.changes > 0;
  }

  // 批量删除图片记录
  async batchDeleteImages(ids) {
    return await databaseService.batchDelete(
      this.tableName,
      ids
    );
  }

  // 获取单个图片信息
  async getImage(id) {
    return await databaseService.get(
      this.tableName,
      { id }
    );
  }

  // 获取图片列表
  async listImages(filters = {}, options = {}) {
    const { page, pageSize, sortBy, sortOrder } = options;
    return await databaseService.list(
      this.tableName,
      filters,
      { page, pageSize, sortBy, sortOrder }
    );
  }

  // 统计图片数量
  async countImages(filters = {}) {
    return await databaseService.count(
      this.tableName,
      filters
    );
  }

  // 检查图片是否存在
  async imageExists(id) {
    const count = await this.countImages({ id });
    return count > 0;
  }

  // 更新图片状态
  async updateStatus(id, status) {
    return await this.update(id, { status });
  }

  // 批量更新图片状态
  async batchUpdateStatus(ids, status) {
    return await this.batchUpdate(
      ids.map(id => ({
        id,
        data: { status }
      }))
    );
  }

  // 添加标签
  async addTag(imageId, tagId) {
    return await databaseService.insert('image_tags', {
      imageId,
      tagId,
      createdAt: new Date()
    });
  }

  // 移除标签
  async removeTag(imageId, tagId) {
    return await databaseService.delete('image_tags', {
      imageId,
      tagId
    });
  }

  // 获取图片的所有标签
  async getTags(imageId) {
    const tags = await databaseService.query(`
      SELECT t.* FROM tags t
      INNER JOIN image_tags it ON t.id = it.tagId
      WHERE it.imageId = ?
    `, [imageId]);
    return tags;
  }

  // 获取图片的所有标注
  async getAnnotations(imageId) {
    return await databaseService.list('annotations', { imageId });
  }

  // 获取图片的预测结果
  async getPredictions(imageId) {
    return await databaseService.list('predictions', { imageId });
  }

  // 搜索图片
  async search(query) {
    const { tagIds, status, dateRange, hasAnnotations, annotationType } = query;
    
    let sql = 'SELECT DISTINCT i.* FROM images i';
    const params = [];
    
    if (tagIds?.length) {
      sql += ' INNER JOIN image_tags it ON i.id = it.imageId';
      sql += ' WHERE it.tagId IN (' + tagIds.map(() => '?').join(',') + ')';
      params.push(...tagIds);
    }
    
    if (status) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' i.status = ?';
      params.push(status);
    }
    
    if (dateRange) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' i.createdAt BETWEEN ? AND ?';
      params.push(dateRange.start, dateRange.end);
    }
    
    if (hasAnnotations) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' EXISTS (SELECT 1 FROM annotations a WHERE a.imageId = i.id)';
    }
    
    if (annotationType) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' EXISTS (SELECT 1 FROM annotations a WHERE a.imageId = i.id AND a.type = ?)';
      params.push(annotationType);
    }
    
    return await databaseService.query(sql, params);
  }

  // 获取图片统计信息
  async getStats() {
    const stats = await databaseService.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as uploading,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as processing,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as ready,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as error,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as deleted
      FROM images
    `, [
      ImageStatus.UPLOADING,
      ImageStatus.PROCESSING,
      ImageStatus.READY,
      ImageStatus.ERROR,
      ImageStatus.DELETED
    ]);
    
    return stats[0];
  }
} 