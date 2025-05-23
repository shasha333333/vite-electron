import { ImageStatus } from '../../../electron/types/common';

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

// 分类服务接口
export interface ClassificationService {
  // 获取可用模型列表
  getModels(): Promise<Array<{
    id: string;
    name: string;
    version: string;
    status: string;
  }>>;

  // 分类图片
  classifyImage(imageData: string, modelName?: string): Promise<{
    success: boolean;
    data?: {
      predictions: Array<{
        className: string;
        confidence: number;
      }>;
    };
    error?: string;
  }>;
} 