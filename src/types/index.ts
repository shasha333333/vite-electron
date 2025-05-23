// 分类结果接口
export interface ClassificationResult {
  label: string
  confidence: number
  index: number
}

// 分类响应接口
export interface ClassificationResponse {
  model: string
  predictions: Prediction[]
}

// 模型信息接口
export interface ModelInfo {
  name: string
  labels: {
    names: string[]
  }
}

// 模型信息
export interface Model {
  id: string
  path: string
  enabled: boolean
}

// 分类预测结果
export interface Prediction {
  label: string
  confidence: number
} 