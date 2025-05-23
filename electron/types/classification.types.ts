import { UUID, Timestamp } from './common';

// YOLOv11分类结果接口
export interface YOLOClassificationResult {
  className: string;
  confidence: number;
  classIndex: number;
}

// 分类预测结果接口
export interface ClassificationPrediction {
  id: UUID;
  imageId: UUID;
  modelId: UUID;
  predictions: YOLOClassificationResult[]; // Top5分类结果
  processedAt: Timestamp;
  processingTime: number; // 推理时间（毫秒）
  isProcessed: boolean; // 是否已处理（生成标签等）
}

// 分类服务请求接口
export interface ClassificationRequest {
  imageId: UUID;
  modelId: UUID;
  options?: {
    topK?: number; // 返回top-K结果，默认5
    minConfidence?: number; // 最小置信度阈值
  };
}

// 分类服务响应接口
export interface ClassificationResponse {
  success: boolean;
  imageId: UUID;
  modelId: UUID;
  predictions: YOLOClassificationResult[];
  processingTime: number;
  error?: string;
}

// 自动标签生成请求接口
export interface AutoTaggingRequest {
  imageId: UUID;
  predictionId: UUID;
  options?: {
    createNewTags?: boolean; // 是否创建新标签（如果类别不存在）
    applyHighConfidenceTags?: boolean; // 是否自动应用高置信度标签
  };
}

// 批量处理请求接口
export interface BatchProcessingRequest {
  imageIds: UUID[];
  modelId: UUID;
  options?: {
    autoTag?: boolean; // 是否自动标签
    overwriteExisting?: boolean; // 是否覆盖已有预测结果
  };
}

// 批量处理状态接口
export interface BatchProcessingStatus {
  id: UUID;
  totalImages: number;
  processedImages: number;
  successCount: number;
  errorCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startedAt: Timestamp;
  completedAt?: Timestamp;
  errors: string[];
}