import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from './constants/ipc-channels.mjs'

// 暴露给渲染进程的API
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件管理相关
  selectImages: () => ipcRenderer.invoke(IPC_CHANNELS.FILE.SELECT_IMAGES),
  getTargetDirectory: () => ipcRenderer.invoke(IPC_CHANNELS.FILE.GET_TARGET_DIRECTORY),
  copyImages: (sourcePaths, targetDir) => ipcRenderer.invoke(IPC_CHANNELS.FILE.COPY_IMAGES, sourcePaths, targetDir),
  getDefaultImageDir: () => ipcRenderer.invoke(IPC_CHANNELS.FILE.GET_DEFAULT_IMAGE_DIR),
  saveCameraImage: (imageData) => ipcRenderer.invoke(IPC_CHANNELS.FILE.SAVE_CAMERA_IMAGE, imageData),
  getCameraList: () => ipcRenderer.invoke(IPC_CHANNELS.FILE.GET_CAMERA_LIST),
  capturePhotoNative: () => ipcRenderer.invoke(IPC_CHANNELS.FILE.CAPTURE_PHOTO_NATIVE),
  
  // 数据库相关
  database: {
    // 照片相关
    addPhoto: (photoData) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.PHOTO.ADD, photoData),
    updatePhoto: (id, photoData) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.PHOTO.UPDATE, id, photoData),
    deletePhoto: (id) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.PHOTO.DELETE, id),
    getPhoto: (id) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.PHOTO.GET, id),
    listPhotos: (params) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.PHOTO.LIST, params),
    updatePhotoFavorite: (id, favorite) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.PHOTO.UPDATE_FAVORITE, id, favorite),
    addPhotoTag: (photoId, tagId) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.PHOTO.ADD_TAG, photoId, tagId),
    removePhotoTag: (photoId, tagId) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.PHOTO.REMOVE_TAG, photoId, tagId),
    
    // 图片相关
    addImage: (imageData) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.IMAGE.ADD, imageData),
    updateImage: (id, imageData) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.IMAGE.UPDATE, id, imageData),
    deleteImage: (id) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.IMAGE.DELETE, id),
    getImage: (id) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.IMAGE.GET, id),
    listImages: (filters) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.IMAGE.LIST, filters),
    updateImageStatus: (id, status) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.IMAGE.UPDATE_STATUS, id, status),
    
    // 模型相关
    addModel: (modelData) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.MODEL.ADD, modelData),
    updateModel: (id, modelData) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.MODEL.UPDATE, id, modelData),
    deleteModel: (id) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.MODEL.DELETE, id),
    getModel: (id) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.MODEL.GET, id),
    listModels: (filters) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.MODEL.LIST, filters),
    updateModelStatus: (id, status) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.MODEL.UPDATE_STATUS, id, status),
    
    // 标注相关
    addAnnotation: (annotationData) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.ANNOTATION.ADD, annotationData),
    updateAnnotation: (id, annotationData) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.ANNOTATION.UPDATE, id, annotationData),
    deleteAnnotation: (id) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.ANNOTATION.DELETE, id),
    getAnnotation: (id) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.ANNOTATION.GET, id),
    listAnnotations: (filters) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.ANNOTATION.LIST, filters),
    
    // 标签相关
    addTag: (tagData) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.TAG.ADD, tagData),
    updateTag: (id, tagData) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.TAG.UPDATE, id, tagData),
    deleteTag: (id) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.TAG.DELETE, id),
    getTag: (id) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.TAG.GET, id),
    listTags: (filters) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.TAG.LIST, filters),
    
    // 关联关系相关
    addAnnotationTag: (annotationId, tagId, confidence) => 
      ipcRenderer.invoke(IPC_CHANNELS.DATABASE.RELATION.ADD_ANNOTATION_TAG, annotationId, tagId, confidence),
    removeAnnotationTag: (annotationId, tagId) => 
      ipcRenderer.invoke(IPC_CHANNELS.DATABASE.RELATION.REMOVE_ANNOTATION_TAG, annotationId, tagId),
    addImageTag: (imageId, tagId, source, confidence) => 
      ipcRenderer.invoke(IPC_CHANNELS.DATABASE.RELATION.ADD_IMAGE_TAG, imageId, tagId, source, confidence),
    removeImageTag: (imageId, tagId) => 
      ipcRenderer.invoke(IPC_CHANNELS.DATABASE.RELATION.REMOVE_IMAGE_TAG, imageId, tagId)
  },
  
  // 分类服务
  classification: {
    // 获取可用模型列表
    getModels: () => ipcRenderer.invoke(IPC_CHANNELS.CLASSIFICATION.GET_MODELS),
    
    // 分类图片
    classifyImage: (imageData, modelName) => ipcRenderer.invoke(IPC_CHANNELS.CLASSIFICATION.CLASSIFY_IMAGE, { 
      imageData, 
      modelName 
    })
  },

  // 图片服务
  image: {
    // 创建图片
    create: (imageData) => ipcRenderer.invoke(IPC_CHANNELS.IMAGE.CREATE, imageData),
    
    // 获取图片
    get: (id) => ipcRenderer.invoke(IPC_CHANNELS.IMAGE.GET, id),
    
    // 更新图片
    update: (id, imageData) => ipcRenderer.invoke(IPC_CHANNELS.IMAGE.UPDATE, id, imageData),
    
    // 删除图片
    delete: (id) => ipcRenderer.invoke(IPC_CHANNELS.IMAGE.DELETE, id),
    
    // 获取图片列表
    list: (filters, options) => ipcRenderer.invoke(IPC_CHANNELS.IMAGE.LIST, filters, options),
    
    // 更新图片状态
    updateStatus: (id, status) => ipcRenderer.invoke(IPC_CHANNELS.IMAGE.UPDATE_STATUS, id, status)
  }
}) 