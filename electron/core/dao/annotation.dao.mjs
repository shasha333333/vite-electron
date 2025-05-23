import { BaseDAO } from './base.dao.mjs';
import { AnnotationType } from '../../types/common.mjs';

export class AnnotationDAO extends BaseDAO {
  constructor() {
    super('annotations');
  }

  // 添加标签到标注
  async addTag(annotationId, tagId, confidence) {
    return await databaseService.insert('annotation_tags', {
      annotationId,
      tagId,
      confidence,
      createdAt: new Date()
    });
  }

  // 从标注移除标签
  async removeTag(annotationId, tagId) {
    return await databaseService.delete('annotation_tags', {
      annotationId,
      tagId
    });
  }

  // 获取标注的所有标签
  async getTags(annotationId) {
    const tags = await databaseService.query(`
      SELECT t.*, at.confidence 
      FROM tags t
      INNER JOIN annotation_tags at ON t.id = at.tagId
      WHERE at.annotationId = ?
    `, [annotationId]);
    return tags;
  }

  // 获取图片的所有标注
  async getByImageId(imageId) {
    return await this.list({ imageId });
  }

  // 按类型获取标注
  async getByType(type) {
    return await this.list({ type });
  }

  // 获取已验证的标注
  async getVerified() {
    return await this.list({ isVerified: true });
  }

  // 获取未验证的标注
  async getUnverified() {
    return await this.list({ isVerified: false });
  }

  // 更新标注验证状态
  async updateVerification(id, isVerified, verifiedBy) {
    return await this.update(id, {
      isVerified,
      verifiedBy,
      verifiedAt: new Date()
    });
  }

  // 批量更新标注验证状态
  async batchUpdateVerification(ids, isVerified, verifiedBy) {
    return await this.batchUpdate(
      ids.map(id => ({
        id,
        data: {
          isVerified,
          verifiedBy,
          verifiedAt: new Date()
        }
      }))
    );
  }

  // 获取标注统计信息
  async getStats() {
    const stats = await databaseService.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN type = ? THEN 1 ELSE 0 END) as boundingBox,
        SUM(CASE WHEN type = ? THEN 1 ELSE 0 END) as polygon,
        SUM(CASE WHEN type = ? THEN 1 ELSE 0 END) as point,
        SUM(CASE WHEN type = ? THEN 1 ELSE 0 END) as segmentation,
        SUM(CASE WHEN type = ? THEN 1 ELSE 0 END) as classification,
        SUM(CASE WHEN isVerified = 1 THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN isVerified = 0 THEN 1 ELSE 0 END) as unverified
      FROM annotations
    `, [
      AnnotationType.BOUNDING_BOX,
      AnnotationType.POLYGON,
      AnnotationType.POINT,
      AnnotationType.SEGMENTATION,
      AnnotationType.CLASSIFICATION
    ]);
    
    return stats[0];
  }

  // 搜索标注
  async search(query) {
    const { imageId, type, tagIds, isVerified, dateRange, confidence } = query;
    
    let sql = 'SELECT DISTINCT a.* FROM annotations a';
    const params = [];
    
    if (tagIds?.length) {
      sql += ' INNER JOIN annotation_tags at ON a.id = at.annotationId';
      sql += ' WHERE at.tagId IN (' + tagIds.map(() => '?').join(',') + ')';
      params.push(...tagIds);
    }
    
    if (imageId) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' a.imageId = ?';
      params.push(imageId);
    }
    
    if (type) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' a.type = ?';
      params.push(type);
    }
    
    if (typeof isVerified === 'boolean') {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' a.isVerified = ?';
      params.push(isVerified);
    }
    
    if (dateRange) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' a.createdAt BETWEEN ? AND ?';
      params.push(dateRange.start, dateRange.end);
    }
    
    if (confidence) {
      sql += params.length ? ' AND' : ' WHERE';
      sql += ' a.confidence BETWEEN ? AND ?';
      params.push(confidence.min, confidence.max);
    }
    
    return await databaseService.query(sql, params);
  }
} 