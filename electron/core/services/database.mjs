/**
 * 数据库服务
 * 负责管理SQLite数据库连接和操作
 */
import path from 'path'
import { app } from 'electron'
import { fileURLToPath } from 'url'
import initSqlJs from 'sql.js'
import fs from 'fs/promises'
import { migrationService } from './migration.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class DatabaseService {
  /**
   * 构造函数
   * 初始化数据库路径和连接
   */
  constructor() {
    // 数据库文件路径
    this.dbPath = path.join(app.getPath('userData'), 'database.sqlite')
    // 数据库连接实例
    this.db = null
    // SQL.js 实例
    this.SQL = null
  }

  /**
   * 初始化数据库
   * 创建或加载数据库文件，执行迁移
   */
  async initialize() {
    try {
      // 初始化SQL.js
      this.SQL = await initSqlJs()
      
      // 检查数据库文件是否存在
      try {
        const buffer = await fs.readFile(this.dbPath)
        this.db = new this.SQL.Database(new Uint8Array(buffer))
      } catch (error) {
        // 如果文件不存在，创建新的数据库
        this.db = new this.SQL.Database()
      }

      // 初始化迁移服务
      await migrationService.initialize()
      
      // 执行迁移
      await migrationService.migrate()
      
      console.log('数据库初始化成功')
    } catch (error) {
      console.error('数据库初始化失败:', error)
      throw error
    }
  }

  /**
   * 执行SQL查询
   * @param {string} query - SQL查询语句
   * @param {Array} params - 查询参数
   * @returns {Promise<Object>} 查询结果
   */
  async executeQuery(query, params = []) {
    if (!this.db) {
      throw new Error('数据库未初始化')
    }

    try {
      const stmt = this.db.prepare(query)
      const result = stmt.run(params)
      stmt.free()
      
      // 保存数据库更改
      await this.saveDatabase()
      
      return result
    } catch (error) {
      console.error('执行查询失败:', error)
      throw error
    }
  }

  /**
   * 执行查询并返回所有结果
   * @param {string} query - SQL查询语句
   * @param {Array} params - 查询参数
   * @returns {Promise<Object>} 查询结果
   */
  async executeQueryAll(query, params = []) {
    if (!this.db) {
      throw new Error('数据库未初始化')
    }

    try {
      const stmt = this.db.prepare(query)
      const result = stmt.get(params)
      stmt.free()
      return result
    } catch (error) {
      console.error('执行查询失败:', error)
      throw error
    }
  }

  /**
   * 保存数据库到文件
   * 将内存中的数据库状态写入文件
   */
  async saveDatabase() {
    if (!this.db) {
      throw new Error('数据库未初始化')
    }

    try {
      const data = this.db.export()
      const buffer = Buffer.from(data)
      await fs.writeFile(this.dbPath, buffer)
    } catch (error) {
      console.error('保存数据库失败:', error)
      throw error
    }
  }

  /**
   * 关闭数据库连接
   * 保存数据库并释放资源
   */
  async close() {
    if (this.db) {
      await this.saveDatabase()
      this.db.close()
      this.db = null
    }
  }
}

export const databaseService = new DatabaseService() 