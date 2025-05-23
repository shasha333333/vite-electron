/**
 * 数据库迁移服务
 * 负责管理数据库架构的版本控制和迁移
 */
import { databaseService } from './database.mjs'
import fs from 'fs/promises'
import path from 'path'
import { app } from 'electron'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 迁移说明文档
const MIGRATION_DOCS = {
  '1_initial_schema': {
    description: '初始数据库架构',
    tables: {
      images: '图片表：存储图片基本信息，包括文件路径、名称、尺寸、格式等',
      models: '模型表：存储AI模型信息，包括名称、版本、类型等',
      annotations: '标注表：存储图片标注信息，关联图片和模型',
      tags: '标签表：存储标签信息，用于分类和标记',
      annotation_tags: '标注标签关联表：存储标注和标签的多对多关系',
      image_tags: '图片标签关联表：存储图片和标签的多对多关系'
    }
  }
};

class MigrationService {
  /**
   * 构造函数
   * 初始化迁移服务的基本配置
   */
  constructor() {
    // 迁移文件存储路径
    this.migrationsPath = path.join(__dirname, '../../resources/migrations')
    // 当前数据库版本
    this.currentVersion = 0
  }

  /**
   * 初始化迁移服务
   * 创建必要的目录和表，获取当前数据库版本
   */
  async initialize() {
    try {
      // 确保迁移目录存在
      await fs.mkdir(this.migrationsPath, { recursive: true })
      
      // 创建迁移记录表
      await this.createMigrationsTable()
      
      // 获取当前数据库版本
      this.currentVersion = await this.getCurrentVersion()
      
      console.log('迁移服务初始化成功，当前版本:', this.currentVersion)
    } catch (error) {
      console.error('迁移服务初始化失败:', error)
      throw error
    }
  }

  /**
   * 创建迁移记录表
   * 用于跟踪已应用的迁移
   */
  async createMigrationsTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER NOT NULL,
        name TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `
    await databaseService.executeQuery(query)
  }

  /**
   * 获取当前数据库版本
   * @returns {Promise<number>} 当前数据库版本号
   */
  async getCurrentVersion() {
    const query = 'SELECT MAX(version) as version FROM migrations'
    const result = await databaseService.executeQuery(query)
    return result.values?.[0]?.version || 0
  }

  /**
   * 创建新的迁移
   * @param {string} name - 迁移名称
   * @param {string|string[]} upQuery - 升级查询语句
   * @param {string|string[]} downQuery - 回滚查询语句
   * @returns {Promise<string>} 迁移文件名
   */
  async createMigration(name, upQuery, downQuery) {
    const version = this.currentVersion + 1
    const migrationName = `${version}_${name}`
    
    // 保存迁移文件
    const migrationContent = {
      version,
      name: migrationName,
      up: upQuery,
      down: downQuery
    }
    
    const filePath = path.join(this.migrationsPath, `${migrationName}.json`)
    await fs.writeFile(filePath, JSON.stringify(migrationContent, null, 2))
    
    console.log(`创建迁移: ${migrationName}`)
    return migrationName
  }

  /**
   * 获取迁移说明
   * @param {string} migrationName - 迁移名称
   * @returns {Object} 迁移说明对象
   */
  getMigrationDoc(migrationName) {
    return MIGRATION_DOCS[migrationName] || null;
  }

  /**
   * 应用指定的迁移
   * @param {string} migrationName - 迁移文件名
   */
  async applyMigration(migrationName) {
    try {
      const migrationPath = path.join(this.migrationsPath, `${migrationName}.json`);
      const migration = JSON.parse(await fs.readFile(migrationPath, 'utf-8'));
      const doc = this.getMigrationDoc(migrationName);

      console.log(`正在应用迁移: ${migrationName}`);
      if (doc) {
        console.log(`描述: ${doc.description}`);
        console.log('表结构:');
        Object.entries(doc.tables).forEach(([table, description]) => {
          console.log(`- ${table}: ${description}`);
        });
      }

      // 开始事务
      await databaseService.executeQuery('BEGIN TRANSACTION')
      
      try {
        // 执行迁移
        await databaseService.executeQuery(migration.up)
        
        // 记录迁移
        const query = `
          INSERT INTO migrations (version, name)
          VALUES (?, ?)
        `
        await databaseService.executeQuery(query, [migration.version, migrationName])
        
        // 提交事务
        await databaseService.executeQuery('COMMIT')
        
        // 更新当前版本
        this.currentVersion = migration.version
        
        console.log(`应用迁移成功: ${migrationName}`)
        return true;
      } catch (error) {
        // 回滚事务
        await databaseService.executeQuery('ROLLBACK')
        throw error
      }
    } catch (error) {
      console.error(`应用迁移失败: ${migrationName}`, error)
      return false;
    }
  }

  /**
   * 回滚指定的迁移
   * @param {string} migrationName - 迁移文件名
   */
  async rollbackMigration(migrationName) {
    try {
      // 读取迁移文件
      const filePath = path.join(this.migrationsPath, `${migrationName}.json`)
      const content = await fs.readFile(filePath, 'utf-8')
      const migration = JSON.parse(content)
      
      // 开始事务
      await databaseService.executeQuery('BEGIN TRANSACTION')
      
      try {
        // 执行回滚
        await databaseService.executeQuery(migration.down)
        
        // 删除迁移记录
        const query = 'DELETE FROM migrations WHERE name = ?'
        await databaseService.executeQuery(query, [migrationName])
        
        // 提交事务
        await databaseService.executeQuery('COMMIT')
        
        // 更新当前版本
        this.currentVersion = await this.getCurrentVersion()
        
        console.log(`回滚迁移成功: ${migrationName}`)
      } catch (error) {
        // 回滚事务
        await databaseService.executeQuery('ROLLBACK')
        throw error
      }
    } catch (error) {
      console.error(`回滚迁移失败: ${migrationName}`, error)
      throw error
    }
  }

  /**
   * 执行所有未应用的迁移
   * 按版本号顺序执行
   */
  async migrate() {
    try {
      // 获取所有迁移文件
      const files = await fs.readdir(this.migrationsPath)
      const migrations = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const [version, ...nameParts] = file.replace('.json', '').split('_')
          return {
            version: parseInt(version),
            name: file.replace('.json', ''),
            fullName: file
          }
        })
        .sort((a, b) => a.version - b.version)
      
      // 应用未执行的迁移
      for (const migration of migrations) {
        if (migration.version > this.currentVersion) {
          await this.applyMigration(migration.name)
        }
      }
      
      console.log('数据库迁移完成')
    } catch (error) {
      console.error('数据库迁移失败:', error)
      throw error
    }
  }
}

export const migrationService = new MigrationService() 