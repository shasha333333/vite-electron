import electron from 'electron'
const { app } = electron
import path from 'path';
import fs from 'fs/promises';
import { ensureDirectoryExists } from './common.mjs';
import os from 'os';

class Logger {
  constructor() {
    // 根据环境选择日志路径
    this.logPath = this.getLogPath();
    this.logFile = path.join(this.logPath, `app-${new Date().toISOString().split('T')[0]}.log`);
    this.initialize();
  }

  getLogPath() {
    // 如果在 Electron 环境中
    if (app) {
      return path.join(app.getPath('userData'), 'logs');
    }
    // 如果在普通 Node.js 环境中
    return path.join(os.tmpdir(), 'image-classifier', 'logs');
  }

  async initialize() {
    try {
      await ensureDirectoryExists(this.logPath);
      console.log(`日志文件路径: ${this.logFile}`);
    } catch (error) {
      console.error('初始化日志目录失败:', error);
    }
  }

  async log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data
    };

    const logString = JSON.stringify(logEntry) + '\n';

    try {
      await fs.appendFile(this.logFile, logString);
    } catch (error) {
      console.error('写入日志失败:', error);
    }

    // 同时在控制台输出
    const consoleMessage = `[${timestamp}] ${level}: ${message}`;
    if (data) {
      console[level.toLowerCase()](consoleMessage, data);
    } else {
      console[level.toLowerCase()](consoleMessage);
    }
  }

  info(message, data = null) {
    return this.log('INFO', message, data);
  }

  error(message, data = null) {
    return this.log('ERROR', message, data);
  }

  warn(message, data = null) {
    return this.log('WARN', message, data);
  }

  debug(message, data = null) {
    return this.log('DEBUG', message, data);
  }

  // 清理旧日志文件
  async cleanupOldLogs(maxAge = 7 * 24 * 60 * 60 * 1000) { // 默认保留7天
    try {
      const files = await fs.readdir(this.logPath);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(this.logPath, file);
        const stats = await fs.stat(filePath);
        const age = now - stats.mtimeMs;

        if (age > maxAge) {
          await fs.unlink(filePath);
        }
      }
    } catch (error) {
      console.error('清理日志文件失败:', error);
    }
  }
}

// 创建单例实例
const logger = new Logger();

// 定期清理旧日志
setInterval(() => {
  logger.cleanupOldLogs();
}, 24 * 60 * 60 * 1000); // 每24小时清理一次

export default logger; 