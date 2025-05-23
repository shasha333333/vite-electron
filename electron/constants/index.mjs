// IPC 通道名称
export const IPC_CHANNELS = {
  // 窗口相关
  WINDOW: {
    MINIMIZE: 'window:minimize',
    MAXIMIZE: 'window:maximize',
    CLOSE: 'window:close'
  },

  // 文件操作相关
  FILE: {
    SELECT_IMAGE: 'file:select-image',
    COPY_FILE: 'file:copy-file',
    SAVE_CAMERA_IMAGE: 'file:save-camera-image'
  },

  // 数据库操作相关
  DATABASE: {
    // 模型相关
    MODEL: {
      GET_ALL: 'db:model:get-all',
      GET_BY_ID: 'db:model:get-by-id',
      ADD: 'db:model:add',
      UPDATE: 'db:model:update',
      DELETE: 'db:model:delete'
    },
    // 标注相关
    ANNOTATION: {
      GET_ALL: 'db:annotation:get-all',
      GET_BY_ID: 'db:annotation:get-by-id',
      ADD: 'db:annotation:add',
      UPDATE: 'db:annotation:update',
      DELETE: 'db:annotation:delete'
    },
    // 标签相关
    TAG: {
      GET_ALL: 'db:tag:get-all',
      GET_BY_ID: 'db:tag:get-by-id',
      ADD: 'db:tag:add',
      UPDATE: 'db:tag:update',
      DELETE: 'db:tag:delete'
    },
    // 照片相关
    PHOTO: {
      GET_ALL: 'db:photo:get-all',
      GET_BY_ID: 'db:photo:get-by-id',
      ADD: 'db:photo:add',
      UPDATE: 'db:photo:update',
      DELETE: 'db:photo:delete'
    }
  },

  // 分类服务相关
  CLASSIFICATION: {
    GET_MODELS: 'classification:get-models',
    CLASSIFY_IMAGE: 'classification:classify-image'
  }
};

// 错误消息
export const ERROR_MESSAGES = {
  DATABASE_INIT_FAILED: '数据库初始化失败',
  MODEL_LOAD_FAILED: '模型加载失败',
  IMAGE_PROCESS_FAILED: '图像处理失败',
  FILE_OPERATION_FAILED: '文件操作失败'
};

// 文件类型
export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
  MODEL: ['.onnx']
}; 