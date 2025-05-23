// 应用程序配置
export const APP_CONFIG = {
  // 窗口配置
  window: {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: '图像分类应用',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  },

  // 数据库配置
  database: {
    path: './data/app.db',
    migrationsPath: './resources/migrations'
  },

  // 模型配置
  models: {
    path: './resources/models',
    defaultModel: 'yolo11s-cls'
  },

  // 输出目录配置
  output: {
    path: './output',
    tempPath: './output/temp'
  },

  // 相机配置
  camera: {
    width: 1280,
    height: 720,
    fps: 30
  }
}; 