import { UUID, Timestamp, TagStatus, TagSource, BaseMetadata } from './common';

// 标签接口
export interface Tag {
  id: UUID;
  name: string;
  type: string;
  status: TagStatus;
  description?: string;
  parentId?: UUID;
  children?: UUID[];
  metadata: {
    color?: string;
    icon?: string;
    synonyms?: string[];
    category?: string;
  } & BaseMetadata;
}

// 标签查询接口
export interface TagQuery {
  name?: string;
  type?: string;
  status?: TagStatus;
  parentId?: UUID;
  category?: string;
  includeChildren?: boolean;
}

// 标签统计接口
export interface TagStats {
  tagId: UUID;
  totalImages: number;
  totalAnnotations: number;
  usageBySource: Record<TagSource, number>;
  lastUsed: Timestamp;
}

// 标签关系接口
export interface TagRelation {
  sourceId: UUID;
  targetId: UUID;
  relationType: 'parent' | 'child' | 'related' | 'synonym';
  confidence?: number;
  metadata?: Record<string, any>;
}

// 自动标签生成结果接口
export interface AutoTaggingResult {
  id: UUID;
  imageId: UUID;
  predictionId: UUID;
  generatedTags: {
    tagId: UUID;
    confidence: number;
    isApplied: boolean; // 是否已应用到图片
    reason: 'auto' | 'suggestion'; // 生成原因
  }[];
  suggestedTags: {
    className: string;
    confidence: number;
    reason: string; // 为什么建议这个标签
  }[];
  processedAt: Timestamp;
}