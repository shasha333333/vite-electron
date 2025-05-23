// 从本地服务类型定义中导入
import type { 
  ImageService,
  ClassificationService
} from './services';

// 从后端类型定义中导出其他需要的类型
export type { 
  AutoTaggingService,
  ClassificationWorkflow
} from '../../../electron/types/services.types';

export type { 
  ImageStatus,
  UUID 
} from '../../../electron/types/common';

// 导出前端使用的API类型
export interface ElectronAPI {
  image: ImageService;
  classification: ClassificationService;
  // ... 其他服务
}

// 声明全局类型
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
} 