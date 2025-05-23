// IPC 通道常量
export const IPC_CHANNELS = {
  // 文件管理相关
  FILE: {
    SELECT_IMAGES: 'select-images',
    GET_TARGET_DIRECTORY: 'get-target-directory',
    COPY_IMAGES: 'copy-images',
    GET_DEFAULT_IMAGE_DIR: 'get-default-image-dir',
    SAVE_CAMERA_IMAGE: 'save-camera-image',
    GET_CAMERA_LIST: 'get-camera-list',
    CAPTURE_PHOTO_NATIVE: 'capture-photo-native'
  },

  // 数据库相关
  DATABASE: {
    // 照片相关
    PHOTO: {
      ADD: 'db:add-photo',
      UPDATE: 'db:update-photo',
      DELETE: 'db:delete-photo',
      GET: 'db:get-photo',
      LIST: 'db:list-photos',
      UPDATE_FAVORITE: 'db:update-photo-favorite',
      ADD_TAG: 'db:add-photo-tag',
      REMOVE_TAG: 'db:remove-photo-tag'
    },

    // 图片相关
    IMAGE: {
      ADD: 'db:add-image',
      UPDATE: 'db:update-image',
      DELETE: 'db:delete-image',
      GET: 'db:get-image',
      LIST: 'db:list-images',
      UPDATE_STATUS: 'db:update-image-status'
    },

    // 模型相关
    MODEL: {
      ADD: 'db:add-model',
      UPDATE: 'db:update-model',
      DELETE: 'db:delete-model',
      GET: 'db:get-model',
      LIST: 'db:list-models',
      UPDATE_STATUS: 'db:update-model-status'
    },

    // 标注相关
    ANNOTATION: {
      ADD: 'db:add-annotation',
      UPDATE: 'db:update-annotation',
      DELETE: 'db:delete-annotation',
      GET: 'db:get-annotation',
      LIST: 'db:list-annotations'
    },

    // 标签相关
    TAG: {
      ADD: 'db:add-tag',
      UPDATE: 'db:update-tag',
      DELETE: 'db:delete-tag',
      GET: 'db:get-tag',
      LIST: 'db:list-tags'
    },

    // 关联关系相关
    RELATION: {
      ADD_ANNOTATION_TAG: 'db:add-annotation-tag',
      REMOVE_ANNOTATION_TAG: 'db:remove-annotation-tag',
      ADD_IMAGE_TAG: 'db:add-image-tag',
      REMOVE_IMAGE_TAG: 'db:remove-image-tag'
    }
  },

  // 分类服务相关
  CLASSIFICATION: {
    GET_MODELS: 'classification:get-models',
    CLASSIFY_IMAGE: 'classification:classify-image'
  },

  // 图片服务
  IMAGE: {
    CREATE: 'image:create',
    GET: 'image:get',
    UPDATE: 'image:update',
    DELETE: 'image:delete',
    LIST: 'image:list',
    UPDATE_STATUS: 'image:updateStatus'
  }
} 