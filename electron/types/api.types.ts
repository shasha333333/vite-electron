import { UUID, Timestamp, ImageStatus, AnnotationType, ErrorResponse } from './common';
import { Image, ImageQuery, ImageUploadResponse, ImageProcessRequest } from './image.types';
import { Model } from './model.types';
import { Annotation } from './annotation.types';
import { Tag } from './tag.types';
import { ClassificationResponse } from './classification.types';

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ErrorResponse[];
  timestamp: Timestamp;
}

// 统计信息接口
export interface SystemStats {
  totalImages: number;
  totalAnnotations: number;
  totalTags: number;
  totalModels: number;
  storageUsed: number; // 存储空间使用量（字节）
  imagesByStatus: Record<ImageStatus, number>;
  annotationsByType: Record<AnnotationType, number>;
  recentActivity: {
    imagesUploadedToday: number;
    annotationsCreatedToday: number;
    modelsTrainedThisWeek: number;
  };
}

// 导出任务接口
export interface ExportTask {
  id: UUID;
  name: string;
  format: 'json' | 'csv' | 'coco' | 'yolo' | 'voc';
  filters: ImageQuery;
  includeAnnotations: boolean;
  includeImages: boolean;
  includePredictions: boolean; // 是否包含AI预测结果
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number; // 0-100
  downloadUrl?: string;
  createdAt: Timestamp;
  completedAt?: Timestamp;
  createdBy: string;
}

// Electron API接口定义
export interface ElectronAPI {
  // 文件管理相关
  selectImages: () => Promise<string[]>;
  getTargetDirectory: () => Promise<string>;
  copyImages: (sourcePaths: string[], targetDir: string) => Promise<Array<{ success: boolean; sourcePath: string; targetPath: string }>>;
  getDefaultImageDir: () => Promise<string>;
  saveCameraImage: (imageData: string) => Promise<{ success: boolean; filePath: string; fileName: string }>;
  getCameraList: () => Promise<string[]>;
  capturePhotoNative: () => Promise<{ success: boolean; filePath: string; fileName: string }>;

  // 数据库相关
  database: {
    // 照片相关
    addPhoto: (photoData: Image) => Promise<UUID>;
    updatePhoto: (id: UUID, photoData: Partial<Image>) => Promise<boolean>;
    deletePhoto: (id: UUID) => Promise<boolean>;
    getPhoto: (id: UUID) => Promise<Image>;
    listPhotos: (params: { page?: number; limit?: number; filters?: Record<string, any> }) => Promise<{ data: Image[]; total: number }>;
    updatePhotoFavorite: (id: UUID, favorite: boolean) => Promise<boolean>;
    addPhotoTag: (photoId: UUID, tagId: UUID) => Promise<boolean>;
    removePhotoTag: (photoId: UUID, tagId: UUID) => Promise<boolean>;

    // 图片相关
    addImage: (imageData: Image) => Promise<UUID>;
    updateImage: (id: UUID, imageData: Partial<Image>) => Promise<boolean>;
    deleteImage: (id: UUID) => Promise<boolean>;
    getImage: (id: UUID) => Promise<Image>;
    listImages: (filters: ImageQuery) => Promise<Image[]>;
    updateImageStatus: (id: UUID, status: ImageStatus) => Promise<boolean>;

    // 模型相关
    addModel: (modelData: Model) => Promise<UUID>;
    updateModel: (id: UUID, modelData: Partial<Model>) => Promise<boolean>;
    deleteModel: (id: UUID) => Promise<boolean>;
    getModel: (id: UUID) => Promise<Model>;
    listModels: (filters: Record<string, any>) => Promise<Model[]>;
    updateModelStatus: (id: UUID, status: string) => Promise<boolean>;

    // 标注相关
    addAnnotation: (annotationData: Annotation) => Promise<UUID>;
    updateAnnotation: (id: UUID, annotationData: Partial<Annotation>) => Promise<boolean>;
    deleteAnnotation: (id: UUID) => Promise<boolean>;
    getAnnotation: (id: UUID) => Promise<Annotation>;
    listAnnotations: (filters: Record<string, any>) => Promise<Annotation[]>;

    // 标签相关
    addTag: (tagData: Tag) => Promise<UUID>;
    updateTag: (id: UUID, tagData: Partial<Tag>) => Promise<boolean>;
    deleteTag: (id: UUID) => Promise<boolean>;
    getTag: (id: UUID) => Promise<Tag>;
    listTags: (filters: Record<string, any>) => Promise<Tag[]>;

    // 关联关系相关
    addAnnotationTag: (annotationId: UUID, tagId: UUID, confidence: number) => Promise<boolean>;
    removeAnnotationTag: (annotationId: UUID, tagId: UUID) => Promise<boolean>;
    addImageTag: (imageId: UUID, tagId: UUID, source: string, confidence: number) => Promise<boolean>;
    removeImageTag: (imageId: UUID, tagId: UUID) => Promise<boolean>;
  };

  // 分类服务
  classification: {
    getModels: () => Promise<Array<{ name: string; labels: any }>>;
    classifyImage: (imageData: string, modelName?: string) => Promise<ClassificationResponse>;
  };
}