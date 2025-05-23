import electron from 'electron'
const { app } = electron
import path from 'path';
import fs from 'fs/promises';
import { ERROR_MESSAGES } from '../constants/index.mjs';

// 确保目录存在
export async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// 获取应用程序数据目录
export function getAppDataPath() {
  return path.join(app.getPath('userData'), 'data');
}

// 获取临时文件目录
export function getTempPath() {
  return path.join(app.getPath('temp'), 'image-classifier');
}

// 生成唯一文件名
export function generateUniqueFileName(originalName) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName);
  return `${timestamp}-${random}${ext}`;
}

// 错误处理包装器
export function withErrorHandling(fn, errorMessage) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      throw new Error(`${errorMessage}: ${error.message}`);
    }
  };
}

// 验证文件类型
export function validateFileType(filePath, allowedTypes) {
  const ext = path.extname(filePath).toLowerCase();
  return allowedTypes.includes(ext);
}

// 清理临时文件
export async function cleanupTempFiles(tempDir, maxAge = 24 * 60 * 60 * 1000) {
  try {
    const files = await fs.readdir(tempDir);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = await fs.stat(filePath);
      const age = now - stats.mtimeMs;

      if (age > maxAge) {
        await fs.unlink(filePath);
      }
    }
  } catch (error) {
    console.error('清理临时文件失败:', error);
  }
}

// 格式化文件大小
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
} 