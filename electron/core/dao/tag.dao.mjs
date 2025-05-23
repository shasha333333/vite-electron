import { BaseDAO } from './base.dao.mjs';
import { TagStatus, TagSource } from '../../types/common.mjs';

export class TagDAO extends BaseDAO {
  constructor() {
    super('tags');
  }

  // 获取子标签
  async getChildren(parentId) {
    return await this.list({ parentId });
  }

  // 获取父标签
  async getParent(id) {
    const tag = await this.get(id);
    return tag?.parentId ? await this.get(tag.parentId) : null;
  }

  // 获取所有祖先标签
  async getAncestors(id) {
    const ancestors = [];
    let current = await this.get(id);
    
    while (current?.parentId) {
      current = await this.get(current.parentId);
      if (current) {
        ancestors.push(current);
      }
    }
    
    return ancestors;
  }

  // 获取所有后代标签
  async getDescendants(id) {
    const descendants = [];
    const children = await this.getChildren(id);
    
    for (const child of children) {
      descendants.push(child);
      descendants.push(...await this.getDescendants(child.id));
    }
    
    return descendants;
  }

  // 添加标签关系
  async addRelation(sourceId, targetId, relationType, confidence) {
    return await databaseService.insert('tag_relations', {
      sourceId,
      targetId,
      relationType,
      confidence,
      createdAt: new Date()
    });
  }

  // 移除标签关系
  async removeRelation(sourceId, targetId) {
    return await databaseService.delete('tag_relations', {
      sourceId,
      targetId
    });
  }

  // 获取相关标签
  async getRelatedTags(id) {
    const relations = await databaseService.query(`
      SELECT t.*, tr.relationType, tr.confidence
      FROM tags t
      INNER JOIN tag_relations tr ON t.id = tr.targetId
      WHERE tr.sourceId = ?
    `, [id]);
    return relations;
  }

  // 更新标签状态
  async updateStatus(id, status) {
    return await this.update(id, { status });
  }

  // 批量更新标签状态
  async batchUpdateStatus(ids, status) {
    return await this.batchUpdate(
      ids.map(id => ({
        id,
        data: { status }
      }))
    );
  }

  // 获取标签统计信息
  async getStats(tagId) {
    const stats = await databaseService.query(`
      SELECT 
        COUNT(DISTINCT i.id) as totalImages,
        COUNT(DISTINCT a.id) as totalAnnotations,
        SUM(CASE WHEN it.source = ? THEN 1 ELSE 0 END) as manualTags,
        SUM(CASE WHEN it.source = ? THEN 1 ELSE 0 END) as autoTags,
        SUM(CASE WHEN it.source = ? THEN 1 ELSE 0 END) as suggestedTags,
        MAX(it.createdAt) as lastUsed
      FROM tags t
      LEFT JOIN image_tags it ON t.id = it.tagId
      LEFT JOIN images i ON it.imageId = i.id
      LEFT JOIN annotations a ON t.id = a.tagId
      WHERE t.id = ?
      GROUP BY t.id
    `, [
      TagSource.MANUAL,
      TagSource.AI_AUTO,
      TagSource.AI_SUGGESTION,
      tagId
    ]);
    
    return stats[0];
  }

  // 搜索标签
  async search(query) {
    const { name, type, status, parentId, category } = query;
    
    let sql = 'SELECT * FROM tags WHERE 1=1';
    const params = [];
    
    if (name) {
      sql += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }
    
    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }
    
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    
    if (parentId) {
      sql += ' AND parentId = ?';
      params.push(parentId);
    }
    
    if (category) {
      sql += ' AND metadata->>"$.category" = ?';
      params.push(category);
    }
    
    return await databaseService.query(sql, params);
  }
} 