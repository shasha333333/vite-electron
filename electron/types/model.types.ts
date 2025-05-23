import { UUID, Timestamp, ModelStatus, BaseMetadata } from './common';

// 模型置信度阈值配置
export interface ModelConfidenceThresholds {
  autoTag: number; // 自动生成标签的最低置信度阈值 (如0.8)
  suggestion: number; // 建议标签的最低置信度阈值 (如0.5)
  display: number; // 显示预测结果的最低置信度阈值 (如0.1)
}

// 分类模型接口
export interface ClassificationModel {
  id: UUID;
  name: string;
  description?: string;
  version: string;
  modelType: 'yolov11-cls'; // 明确模型类型
  status: ModelStatus;
  accuracy?: number; // 模型准确率
  trainingDataCount?: number; // 训练数据量
  classes: string[]; // 模型可识别的类别
  modelPath?: string; // 模型文件路径
  configPath?: string; // 配置文件路径
  confidenceThresholds: ModelConfidenceThresholds; // 置信度阈值配置
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // 创建者ID
}

// 模型接口
export interface Model {
  id: UUID;
  name: string;
  path: string;
  status: ModelStatus;
  type: string;
  version: string;
  description?: string;
  metadata: {
    framework: string;
    inputShape: number[];
    outputShape: number[];
    labels: string[];
    accuracy?: number;
    trainingData?: string;
    trainingConfig?: Record<string, any>;
  } & BaseMetadata;
}

// 模型训练配置接口
export interface ModelTrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
  augmentation?: {
    rotation?: number;
    flip?: boolean;
    zoom?: number;
  };
  earlyStopping?: {
    patience: number;
    minDelta: number;
  };
}

// 模型评估结果接口
export interface ModelEvaluationResult {
  modelId: UUID;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
  evaluationTime: Timestamp;
  testDataSize: number;
  details?: Record<string, any>;
}