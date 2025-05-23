// electron/main.mjs
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import NodeWebcam from 'node-webcam'
import { databaseService } from './core/services/database.mjs'
import { imageDao } from './core/dao/imageDao.mjs'
import { modelDao } from './core/dao/modelDao.mjs'
import { annotationDao } from './core/dao/annotationDao.mjs'
import { tagDao } from './core/dao/tagDao.mjs'
import { photoDao } from './core/dao/photoDao.mjs'
import { ClassificationService } from './core/services/classification.service.mjs'
import { APP_CONFIG } from './config/app.config.mjs'
import { IPC_CHANNELS } from './constants/ipc-channels.mjs'
import { ensureDirectoryExists } from './utils/common.mjs'
import logger from './utils/logger.mjs'
import { ImageService } from './core/services/image.service.mjs'
import { ImageStatus } from './types/common.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 创建分类服务实例
const classificationService = new ClassificationService()

// 创建服务实例
const imageService = new ImageService()

// 获取默认图片保存目录
function getDefaultImageDir() {
  return path.join(app.getPath('pictures'), 'Camera Photos')
}

// 确保目录存在
async function ensureDirExists(dirPath) {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
  }
}

// 初始化数据库
async function initializeDatabase() {
  try {
    await databaseService.initialize()
    console.log('数据库初始化成功')
  } catch (error) {
    console.error('数据库初始化失败:', error)
    throw error
  }
}

// 创建摄像头实例
const webcam = NodeWebcam.create({
  width: 1280,
  height: 720,
  quality: 100,
  delay: 0,
  saveShots: true,
  output: 'png',
  device: false,
  callbackReturn: 'buffer',
  verbose: false
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.mjs')
    }
  })

  // 设置 CSP
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' data:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        ]
      }
    })
  })

  // 开发环境加载本地服务
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    // 生产环境加载打包后的文件
    win.loadFile('dist/index.html')
  }

  // 处理窗口关闭事件
  win.on('closed', () => {
    app.quit()
  })
}

// 注册IPC处理程序
function registerIpcHandlers() {
  // 选择图片文件
  ipcMain.handle(IPC_CHANNELS.FILE.SELECT_IMAGES, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
      ]
    })
    return result.filePaths
  })

  // 获取目标目录
  ipcMain.handle(IPC_CHANNELS.FILE.GET_TARGET_DIRECTORY, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    return result.filePaths[0]
  })

  // 复制图片到目标目录
  ipcMain.handle(IPC_CHANNELS.FILE.COPY_IMAGES, async (event, sourcePaths, targetDir) => {
    try {
      const results = await Promise.all(
        sourcePaths.map(async (sourcePath) => {
          const fileName = path.basename(sourcePath)
          const targetPath = path.join(targetDir, fileName)
          await fs.copyFile(sourcePath, targetPath)
          return {
            success: true,
            sourcePath,
            targetPath
          }
        })
      )
      return results
    } catch (error) {
      console.error('复制文件时出错:', error)
      throw error
    }
  })

  // 获取默认图片保存目录
  ipcMain.handle(IPC_CHANNELS.FILE.GET_DEFAULT_IMAGE_DIR, async () => {
    const defaultDir = getDefaultImageDir()
    await ensureDirExists(defaultDir)
    return defaultDir
  })

  // 保存摄像头图片
  ipcMain.handle(IPC_CHANNELS.FILE.SAVE_CAMERA_IMAGE, async (event, imageData) => {
    try {
      const defaultDir = getDefaultImageDir()
      await ensureDirExists(defaultDir)
      
      // 生成文件名（使用时间戳）
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `camera-${timestamp}.png`
      const filePath = path.join(defaultDir, fileName)
      
      // 将 base64 图片数据转换为 Buffer
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      
      // 保存文件
      await fs.writeFile(filePath, buffer)
      
      return {
        success: true,
        filePath,
        fileName
      }
    } catch (error) {
      console.error('保存图片时出错:', error)
      throw error
    }
  })

  // 获取可用摄像头列表
  ipcMain.handle(IPC_CHANNELS.FILE.GET_CAMERA_LIST, async () => {
    try {
      const devices = await webcam.list()
      return devices
    } catch (error) {
      console.error('获取摄像头列表失败:', error)
      throw error
    }
  })

  // 使用原生方式拍照
  ipcMain.handle(IPC_CHANNELS.FILE.CAPTURE_PHOTO_NATIVE, async () => {
    try {
      const defaultDir = getDefaultImageDir()
      await ensureDirExists(defaultDir)
      
      // 生成文件名（使用时间戳）
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const fileName = `camera-${timestamp}.png`
      const filePath = path.join(defaultDir, fileName)
      
      // 拍照
      const imageBuffer = await new Promise((resolve, reject) => {
        webcam.capture(filePath, (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      })
      
      return {
        success: true,
        filePath,
        fileName
      }
    } catch (error) {
      console.error('拍照失败:', error)
      throw error
    }
  })

  // 数据库操作处理程序
  // 照片相关
  ipcMain.handle(IPC_CHANNELS.DATABASE.PHOTO.ADD, async (event, photoData) => {
    return await photoDao.add(photoData)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.PHOTO.UPDATE, async (event, id, photoData) => {
    return await photoDao.update(id, photoData)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.PHOTO.DELETE, async (event, id) => {
    return await photoDao.delete(id)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.PHOTO.GET, async (event, id) => {
    return await photoDao.get(id)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.PHOTO.LIST, async (event, params) => {
    return await photoDao.list(params)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.PHOTO.UPDATE_FAVORITE, async (event, id, favorite) => {
    return await photoDao.updateFavorite(id, favorite)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.PHOTO.ADD_TAG, async (event, photoId, tagId) => {
    return await photoDao.addTag(photoId, tagId)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.PHOTO.REMOVE_TAG, async (event, photoId, tagId) => {
    return await photoDao.removeTag(photoId, tagId)
  })

  // 图片相关
  ipcMain.handle(IPC_CHANNELS.IMAGE.CREATE, async (event, imageData) => {
    return await imageService.createImage(imageData)
  })

  ipcMain.handle(IPC_CHANNELS.IMAGE.GET, async (event, id) => {
    return await imageService.getImage(id)
  })

  ipcMain.handle(IPC_CHANNELS.IMAGE.UPDATE, async (event, id, imageData) => {
    return await imageService.updateImage(id, imageData)
  })

  ipcMain.handle(IPC_CHANNELS.IMAGE.DELETE, async (event, id) => {
    return await imageService.deleteImage(id)
  })

  ipcMain.handle(IPC_CHANNELS.IMAGE.LIST, async (event, filters, options) => {
    return await imageService.listImages(filters, options)
  })

  ipcMain.handle(IPC_CHANNELS.IMAGE.UPDATE_STATUS, async (event, id, status) => {
    return await imageService.updateImageStatus(id, status)
  })

  // 模型相关
  ipcMain.handle(IPC_CHANNELS.DATABASE.MODEL.ADD, async (event, modelData) => {
    return await modelDao.add(modelData)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.MODEL.UPDATE, async (event, id, modelData) => {
    return await modelDao.update(id, modelData)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.MODEL.DELETE, async (event, id) => {
    return await modelDao.delete(id)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.MODEL.GET, async (event, id) => {
    return await modelDao.get(id)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.MODEL.LIST, async (event, filters) => {
    return await modelDao.list(filters)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.MODEL.UPDATE_STATUS, async (event, id, status) => {
    return await modelDao.updateStatus(id, status)
  })

  // 标注相关
  ipcMain.handle(IPC_CHANNELS.DATABASE.ANNOTATION.ADD, async (event, annotationData) => {
    return await annotationDao.add(annotationData)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.ANNOTATION.UPDATE, async (event, id, annotationData) => {
    return await annotationDao.update(id, annotationData)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.ANNOTATION.DELETE, async (event, id) => {
    return await annotationDao.delete(id)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.ANNOTATION.GET, async (event, id) => {
    return await annotationDao.get(id)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.ANNOTATION.LIST, async (event, filters) => {
    return await annotationDao.list(filters)
  })

  // 标签相关
  ipcMain.handle(IPC_CHANNELS.DATABASE.TAG.ADD, async (event, tagData) => {
    return await tagDao.add(tagData)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.TAG.UPDATE, async (event, id, tagData) => {
    return await tagDao.update(id, tagData)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.TAG.DELETE, async (event, id) => {
    return await tagDao.delete(id)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.TAG.GET, async (event, id) => {
    return await tagDao.get(id)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.TAG.LIST, async (event, filters) => {
    return await tagDao.list(filters)
  })

  // 关联关系相关
  ipcMain.handle(IPC_CHANNELS.DATABASE.RELATION.ADD_ANNOTATION_TAG, async (event, annotationId, tagId, confidence) => {
    return await annotationDao.addTag(annotationId, tagId, confidence)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.RELATION.REMOVE_ANNOTATION_TAG, async (event, annotationId, tagId) => {
    return await annotationDao.removeTag(annotationId, tagId)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.RELATION.ADD_IMAGE_TAG, async (event, imageId, tagId, source, confidence) => {
    return await imageDao.addTag(imageId, tagId, source, confidence)
  })

  ipcMain.handle(IPC_CHANNELS.DATABASE.RELATION.REMOVE_IMAGE_TAG, async (event, imageId, tagId) => {
    return await imageDao.removeTag(imageId, tagId)
  })

  // 分类服务相关
  ipcMain.handle(IPC_CHANNELS.CLASSIFICATION.GET_MODELS, async () => {
    try {
      const models = await classificationService.getModels()
      return models
    } catch (error) {
      console.error('获取模型列表失败:', error)
      throw error
    }
  })

  ipcMain.handle(IPC_CHANNELS.CLASSIFICATION.CLASSIFY_IMAGE, async (event, { imageData, modelName = APP_CONFIG.models.defaultModel }) => {
    try {
      // 保存临时文件
      const tempPath = path.join(APP_CONFIG.output.tempPath, `classification_${Date.now()}.png`)
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      await fs.writeFile(tempPath, buffer)

      // 执行分类
      const result = await classificationService.classifyImage(tempPath, modelName)

      // 清理临时文件
      try {
        await fs.unlink(tempPath)
      } catch (error) {
        console.error('清理临时文件失败:', error)
      }

      return result
    } catch (error) {
      console.error('图片分类失败:', error)
      throw error
    }
  })
}

// 处理应用生命周期
app.whenReady().then(async () => {
  try {
    // 初始化数据库
    // await initializeDatabase()
    // 初始化分类服务
    await classificationService.initialize()
    // 创建窗口
    createWindow()
    // 注册 IPC 处理程序
    registerIpcHandlers()
  } catch (error) {
    console.error('应用启动失败:', error)
    app.quit()
  }
})

app.on('window-all-closed', async () => {
  try {
    // 关闭数据库连接
    await databaseService.close()
    // 关闭分类服务
    await classificationService.close()
  } catch (error) {
    console.error('关闭服务失败:', error)
  }
  
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 处理应用退出
app.on('before-quit', async () => {
  try {
    // 关闭数据库连接
    await databaseService.close()
  } catch (error) {
    console.error('关闭数据库连接失败:', error)
  }
})