import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ClassificationService } from '../classification.service.mjs';
import { APP_CONFIG } from '../../../config/app.config.mjs';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 创建测试用的分类服务实例
const classificationService = new ClassificationService()

// 测试图片路径 - 修正为正确的相对路径
const TEST_IMAGE_PATH = path.join(__dirname, '../../../resources/test/test-image.png')

describe('ClassificationService', () => {
  beforeAll(async () => {
    console.log('开始分类服务测试...')
  })

  afterAll(async () => {
    await classificationService.close()
    console.log('服务关闭成功')
  })

  it('应该成功初始化服务', async () => {
    await classificationService.initialize()
    console.log('✓ 服务初始化成功')
  })

  it('应该成功获取模型列表', async () => {
    const models = await classificationService.getModels()
    console.log('可用模型:', models)
    expect(Array.isArray(models)).toBe(true)
  })

  it('测试图片应该存在', async () => {
    await expect(fs.access(TEST_IMAGE_PATH)).resolves.not.toThrow()
    console.log('✓ 测试图片存在')
  })

  it('应该能使用默认模型进行图片分类', async () => {
    const result = await classificationService.classifyImage(
      TEST_IMAGE_PATH,
      APP_CONFIG.models.defaultModel
    )
    console.log('分类结果:', result)
    expect(result).toBeDefined()
  })
}) 