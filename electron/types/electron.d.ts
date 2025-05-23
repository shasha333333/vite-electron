import { ImageService } from './services.types';
import { ClassificationService } from './services.types';

export interface ElectronAPI {
  image: ImageService;
  classification: ClassificationService;
  // ... other APIs
}

// 声明全局变量
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}