import { BaseDAO } from './base.dao.mjs';
import { ModelStatus } from '../../types/common.mjs';

export class ModelDAO extends BaseDAO {
  constructor() {
    super('models');
  }

  // 更新模型状态
  async updateStatus(id, status) {
    return await this.update(id, { status });
  }

  // 批量更新模型状态
  async batchUpdateStatus(ids, status) {
    return await this.batchUpdate(
      ids.map(id => ({
        id,
        data: { status }
      }))
    );
  }

  // 获取模型评估结果
  async getEvaluationResults(modelId) {
    return await databaseService.list('model_evaluations', { modelId });
  }

  // 添加模型评估结果
  async addEvaluationResult(evaluationData) {
    return await databaseService.insert('model_evaluations', {
      ...evaluationData,
      createdAt: new Date()
    });
  }

  // 获取模型训练配置
  async getTrainingConfig(modelId) {
    const model = await this.get(modelId);
    return model?.metadata?.trainingConfig;
  }

  // 更新模型训练配置
  async updateTrainingConfig(modelId, config) {
    const model = await this.get(modelId);
    return await this.update(modelId, {
      metadata: {
        ...model.metadata,
        trainingConfig: config
      }
    });
  }

  // 获取模型统计信息
  async getStats() {
    const stats = await databaseService.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as training,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as ready,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as deprecated,
        SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as error,
        AVG(metadata->>"$.accuracy") as avgAccuracy
      FROM models
    `, [
      ModelStatus.TRAINING,
      ModelStatus.READY,
      ModelStatus.DEPRECATED,
      ModelStatus.ERROR
    ]);
    
    return stats[0];
  }

  // 搜索模型
  async search(query) {
    const { name, type, status, minAccuracy, maxAccuracy } = query;
    
    let sql = 'SELECT * FROM models WHERE 1=1';
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
    
    if (minAccuracy !== undefined) {
      sql += ' AND CAST(metadata->>"$.accuracy" AS DECIMAL) >= ?';
      params.push(minAccuracy);
    }
    
    if (maxAccuracy !== undefined) {
      sql += ' AND CAST(metadata->>"$.accuracy" AS DECIMAL) <= ?';
      params.push(maxAccuracy);
    }
    
    return await databaseService.query(sql, params);
  }

  // 获取模型版本历史
  async getVersionHistory(modelId) {
    return await databaseService.query(`
      SELECT 
        version,
        metadata->>"$.accuracy" as accuracy,
        metadata->>"$.trainingData" as trainingData,
        createdAt,
        createdBy
      FROM models
      WHERE id = ?
      ORDER BY version DESC
    `, [modelId]);
  }

  // 获取模型使用统计
  async getUsageStats(modelId) {
    const stats = await databaseService.query(`
      SELECT 
        COUNT(DISTINCT p.imageId) as totalImages,
        COUNT(DISTINCT p.id) as totalPredictions,
        AVG(p.processingTime) as avgProcessingTime,
        MAX(p.createdAt) as lastUsed
      FROM predictions p
      WHERE p.modelId = ?
    `, [modelId]);
    
    return stats[0];
  }
} 