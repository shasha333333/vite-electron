import { UUID, Timestamp, ImageStatus, AnnotationType, FilePath, URL, BaseMetadata } from './common';

// 图片元数据接口
export interface ImageMetadata extends BaseMetadata {
  width: number;
  height: number;
  format: string; // jpg, png, webp等
  size: number; // 文件大小（字节）
  colorSpace?: string;
  dpi?: number;
  exif?: Record<string, any>; // EXIF信息
}

// 图片接口
export interface Image {
  id: UUID;
  filename: string;
  originalFilename: string;
  path: FilePath; // 文件存储路径
  thumbnailPath?: FilePath; // 缩略图路径
  url: URL; // 访问URL
  thumbnailUrl?: URL; // 缩略图URL
  metadata: ImageMetadata;
  status: ImageStatus;
  tags: UUID[]; // 关联的标签ID数组
  annotations: UUID[]; // 关联的标注ID数组
  predictions: UUID[]; // 关联的预测结果ID数组
  autoTagResults?: UUID[]; // 自动标签生成结果ID数组
  description?: string;
  hash?: string; // 文件hash，用于去重
  isProcessedByAI: boolean; // 是否已通过AI处理
  lastProcessedAt?: Timestamp; // 最后处理时间
  uploadedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  uploadedBy: string; // 上传者ID
}

// 图片查询接口
export interface ImageQuery {
  page?: number;
  pageSize?: number;
  tagIds?: UUID[];
  status?: ImageStatus;
  filename?: string;
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
  hasAnnotations?: boolean;
  annotationType?: AnnotationType;
  sortBy?: 'createdAt' | 'updatedAt' | 'filename' | 'size';
  sortOrder?: 'asc' | 'desc';
}

// 图片上传响应接口
export interface ImageUploadResponse {
  success: boolean;
  image?: Image;
  error?: string;
  uploadProgress?: number;
}

// 图片处理请求接口
export interface ImageProcessRequest {
  imageId: UUID;
  operations: Array<{
    type: 'resize' | 'crop' | 'rotate' | 'filter';
    params: Record<string, any>;
  }>;
  outputFormat?: string;
  quality?: number;
}