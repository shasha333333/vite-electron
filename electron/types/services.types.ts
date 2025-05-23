import { UUID } from './common';
import { ClassificationModel, ModelConfidenceThresholds } from './model.types';
import { 
  ClassificationRequest, 
  ClassificationResponse, 
  ClassificationPrediction,
  BatchProcessingRequest, 
  BatchProcessingStatus,
  AutoTaggingRequest
} from './classification.types';
import { AutoTaggingResult } from './tag.types';
import { ImageStatus } from './common';

// 图片服务接口
export interface ImageService {
  // 创建图片
  createImage(imageData: {
    name: string;
    path: string;
    size: number;
    status?: ImageStatus;
    [key: string]: any;
  }): Promise<{
    success: boolean;
    data?: { id: string };
    error?: string;
  }>;

  // 获取图片
  getImage(id: string): Promise<{
    success: boolean;
    data?: {
      id: string;
      name: string;
      path: string;
      size: number;
      status: ImageStatus;
      [key: string]: any;
    };
    error?: string;
  }>;

  // 更新图片
  updateImage(id: string, imageData: Partial<{
    name: string;
    path: string;
    size: number;
    status: ImageStatus;
    [key: string]: any;
  }>): Promise<{
    success: boolean;
    data?: { updated: boolean };
    error?: string;
  }>;

  // 删除图片
  deleteImage(id: string): Promise<{
    success: boolean;
    data?: { deleted: boolean };
    error?: string;
  }>;

  // 获取图片列表
  listImages(filters?: Record<string, any>, options?: {
    page?: number;
    pageSize?: number;
  }): Promise<{
    success: boolean;
    data?: Array<{
      id: string;
      name: string;
      path: string;
      size: number;
      status: ImageStatus;
      [key: string]: any;
    }>;
    error?: string;
  }>;

  // 更新图片状态
  updateImageStatus(id: string, status: ImageStatus): Promise<{
    success: boolean;
    data?: { updated: boolean };
    error?: string;
  }>;
}

// 模型管理服务接口
export interface ModelManagementService {
  // 获取可用模型列表
  getAvailableModels(): Promise<ClassificationModel[]>;
  
  // 更新模型置信度阈值
  updateConfidenceThresholds(modelId: UUID, thresholds: ModelConfidenceThresholds): Promise<void>;
  
  // 获取模型性能统计
  getModelStats(modelId: UUID): Promise<{
    totalPredictions: number;
    averageConfidence: number;
    classDistribution: Record<string, number>;
    accuracyMetrics?: any;
  }>;
}

// 分类服务接口
export interface ClassificationService {
  // 单张图片分类
  classifyImage(request: ClassificationRequest): Promise<ClassificationResponse>;
  
  // 批量图片分类
  batchClassifyImages(request: BatchProcessingRequest): Promise<BatchProcessingStatus>;
  
  // 获取分类结果
  getPrediction(predictionId: UUID): Promise<ClassificationPrediction>;
  
  // 获取图片的所有预测结果
  getImagePredictions(imageId: UUID): Promise<ClassificationPrediction[]>;
}

// 自动标签服务接口
export interface AutoTaggingService {
  // 基于预测结果生成标签
  generateTags(request: AutoTaggingRequest): Promise<AutoTaggingResult>;
  
  // 应用建议的标签到图片
  applySuggestedTags(imageId: UUID, tagIds: UUID[]): Promise<void>;
  
  // 获取标签建议
  getTagSuggestions(imageId: UUID): Promise<{
    className: string;
    confidence: number;
    existingTagId?: UUID;
    suggestedTagName?: string;
  }[]>;
  
  // 批量自动标签
  batchAutoTag(imageIds: UUID[], modelId: UUID): Promise<BatchProcessingStatus>;
}

// 使用示例和工作流程
export interface ClassificationWorkflow {
  // 1. 图片上传后的处理流程
  processNewImage(imageId: UUID): Promise<{
    predictionResult: ClassificationPrediction;
    autoTagResult: AutoTaggingResult;
    appliedTags: UUID[];
  }>;
  
  // 2. 手动重新处理图片
  reprocessImage(imageId: UUID, modelId: UUID): Promise<ClassificationPrediction>;
  
  // 3. 审核AI生成的标签
  reviewAutoTags(imageId: UUID, approvedTagIds: UUID[], rejectedTagIds: UUID[]): Promise<void>;
  
  // 4. 调整置信度阈值并重新处理
  adjustThresholdsAndReprocess(modelId: UUID, newThresholds: ModelConfidenceThresholds, imageIds?: UUID[]): Promise<void>;
}