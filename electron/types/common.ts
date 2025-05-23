// 基础类型定义
export type UUID = string;
export type Timestamp = Date;
export type ErrorCode = string;
export type FilePath = string;
export type URL = string;

// 图片状态枚举
export enum ImageStatus {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  READY = 'ready',
  ERROR = 'error',
  DELETED = 'deleted'
}

// 标注类型枚举
export enum AnnotationType {
  BOUNDING_BOX = 'bounding_box',
  POLYGON = 'polygon',
  POINT = 'point',
  SEGMENTATION = 'segmentation',
  CLASSIFICATION = 'classification'
}

// 分类模型状态枚举
export enum ModelStatus {
  TRAINING = 'training',
  READY = 'ready',
  DEPRECATED = 'deprecated',
  ERROR = 'error'
}

// 标签状态枚举
export enum TagStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending' // 待审核状态
}

// 标签生成来源枚举
export enum TagSource {
  MANUAL = 'manual', // 人工创建
  AI_AUTO = 'ai_auto', // AI自动生成
  AI_SUGGESTION = 'ai_suggestion' // AI建议（需人工确认）
}

// 错误类型枚举
export enum ErrorType {
  VALIDATION = 'validation',
  DATABASE = 'database',
  FILE_SYSTEM = 'file_system',
  NETWORK = 'network',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown'
}

// 分页结果接口
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 批量操作接口
export interface BatchOperation {
  imageIds: UUID[];
  operation: 'delete' | 'addTags' | 'removeTags' | 'updateStatus';
  params?: {
    tagIds?: UUID[];
    status?: ImageStatus;
  };
}

// 错误响应接口
export interface ErrorResponse {
  code: ErrorCode;
  type: ErrorType;
  message: string;
  details?: Record<string, any>;
  timestamp: Timestamp;
}

// 基础元数据接口
export interface BaseMetadata {
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy?: string;
  version?: number;
  description?: string;
}