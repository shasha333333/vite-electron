import { UUID, Timestamp, AnnotationType, BaseMetadata } from './common';

// 坐标点接口
export interface Point {
  x: number;
  y: number;
}

// 边界框接口
export interface BoundingBox {
  x: number; // 左上角x坐标
  y: number; // 左上角y坐标
  width: number;
  height: number;
}

// 多边形接口
export interface Polygon {
  points: Point[];
}

// 分割掩码接口
export interface SegmentationMask {
  mask: number[][]; // 二维掩码数组
  width: number;
  height: number;
}

// 标注数据接口
export interface AnnotationData {
  type: AnnotationType;
  coordinates: number[] | number[][];
  confidence?: number;
  label?: string;
  metadata?: Record<string, any>;
}

// 标注接口
export interface Annotation {
  id: UUID;
  imageId: UUID;
  type: AnnotationType;
  data: AnnotationData;
  tags: UUID[];
  confidence?: number;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Timestamp;
  metadata: BaseMetadata;
}

// 标注查询接口
export interface AnnotationQuery {
  imageId?: UUID;
  type?: AnnotationType;
  tagIds?: UUID[];
  isVerified?: boolean;
  dateRange?: {
    start: Timestamp;
    end: Timestamp;
  };
  confidence?: {
    min: number;
    max: number;
  };
}

// 标注验证请求接口
export interface AnnotationVerificationRequest {
  annotationId: UUID;
  isVerified: boolean;
  comment?: string;
  tags?: UUID[];
}