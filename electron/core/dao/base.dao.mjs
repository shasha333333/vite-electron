import { databaseService } from '../services/database.mjs';
import { UUID, BaseMetadata } from '../../types/common.mjs';

export class BaseDAO {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // 创建记录
  async create(data) {
    const now = new Date();
    const record = {
      ...data,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    
    const result = await databaseService.insert(this.tableName, record);
    return result.lastID;
  }

  // 更新记录
  async update(id, data) {
    const now = new Date();
    const record = {
      ...data,
      updatedAt: now,
      version: data.version ? data.version + 1 : 1
    };
    
    const result = await databaseService.update(
      this.tableName,
      record,
      { id }
    );
    return result.changes > 0;
  }

  // 删除记录
  async delete(id) {
    const result = await databaseService.delete(
      this.tableName,
      { id }
    );
    return result.changes > 0;
  }

  // 获取单条记录
  async get(id) {
    return await databaseService.get(
      this.tableName,
      { id }
    );
  }

  // 查询记录列表
  async list(filters = {}, options = {}) {
    const { page, pageSize, sortBy, sortOrder } = options;
    return await databaseService.list(
      this.tableName,
      filters,
      { page, pageSize, sortBy, sortOrder }
    );
  }

  // 批量创建
  async batchCreate(records) {
    const now = new Date();
    const data = records.map(record => ({
      ...record,
      createdAt: now,
      updatedAt: now,
      version: 1
    }));
    
    return await databaseService.batchInsert(this.tableName, data);
  }

  // 批量更新
  async batchUpdate(updates) {
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

  // 批量删除
  async batchDelete(ids) {
    return await databaseService.batchDelete(
      this.tableName,
      ids
    );
  }

  // 统计记录数
  async count(filters = {}) {
    return await databaseService.count(
      this.tableName,
      filters
    );
  }

  // 检查记录是否存在
  async exists(id) {
    const count = await this.count({ id });
    return count > 0;
  }
} 