import { BaseService } from './base.service.mjs';
import { APP_CONFIG } from '../../config/app.config.mjs';
import { ERROR_MESSAGES } from '../../constants/index.mjs';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import yaml from 'js-yaml';
import ort from 'onnxruntime-node';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ClassificationService extends BaseService {
  constructor() {
    super('ClassificationService');
    this.models = new Map();
    this.modelLabels = new Map();
  }

  // 初始化服务
  async initialize() {
    try {
      this.logInfo('initialize', '开始初始化分类服务');
      await this.loadModels();
      this.logInfo('initialize', '分类服务初始化成功');
    } catch (error) {
      this.logError('initialize', error, {
        message: '分类服务初始化失败',
        stack: error.stack
      });
      throw new Error(`模型加载失败: ${error.message}`);
    }
  }

  // 加载所有模型
  async loadModels() {
    try {
      const modelDir = path.resolve(__dirname, '../../', APP_CONFIG.models.path);
      this.logInfo('loadModels', `开始加载模型，模型目录: ${modelDir}`);
      
      // 检查模型目录是否存在
      try {
        await fs.access(modelDir);
      } catch (error) {
        throw new Error(`模型目录不存在: ${modelDir}`);
      }
      
      const files = await fs.readdir(modelDir);
      this.logInfo('loadModels', `找到文件: ${files.join(', ')}`);
      
      if (files.length === 0) {
        throw new Error(`模型目录为空: ${modelDir}`);
      }
      
      for (const file of files) {
        if (file.endsWith('.onnx')) {
          const modelName = path.basename(file, '.onnx');
          this.logInfo('loadModels', `正在加载模型: ${modelName}`);
          await this.loadModel(modelName);
        }
      }
      
      this.logInfo('loadModels', '所有模型加载完成');
    } catch (error) {
      this.logError('loadModels', error, {
        message: '加载模型失败',
        stack: error.stack
      });
      throw error;
    }
  }

  // 加载单个模型
  async loadModel(modelName) {
    try {
      const modelPath = path.resolve(__dirname, '../../', APP_CONFIG.models.path, `${modelName}.onnx`);
      this.logInfo('loadModel', `模型路径: ${modelPath}`);
      
      // 检查模型文件是否存在
      try {
        await fs.access(modelPath);
      } catch (error) {
        throw new Error(`模型文件不存在: ${modelPath}`);
      }
      
      const session = await ort.InferenceSession.create(modelPath);
      this.models.set(modelName, session);

      // 加载标签文件
      const labelPath = path.resolve(__dirname, '../../', APP_CONFIG.models.path, 'labels', 'yolo11-cls.yaml');
      this.logInfo('loadModel', `标签文件路径: ${labelPath}`);
      
      // 检查标签文件是否存在
      try {
        await fs.access(labelPath);
      } catch (error) {
        throw new Error(`标签文件不存在: ${labelPath}`);
      }
      
      const labelContent = await fs.readFile(labelPath, 'utf8');
      const labels = yaml.load(labelContent);
      
      if (!labels || !labels.names) {
        throw new Error(`标签文件格式错误: ${labelPath}`);
      }
      
      this.modelLabels.set(modelName, labels);

      this.logInfo('loadModel', `模型 ${modelName} 加载成功`);
    } catch (error) {
      this.logError('loadModel', error, {
        modelName,
        message: `加载模型 ${modelName} 失败`,
        stack: error.stack
      });
      throw error;
    }
  }

  // 获取可用模型列表
  async getModels() {
    return Array.from(this.models.keys()).map(modelName => ({
      name: modelName,
      labels: this.modelLabels.get(modelName)
    }));
  }

  // 预处理图像
  async preprocessImage(imagePath) {
    try {
      const image = await sharp(imagePath)
        .resize(224, 224) // 调整大小为模型输入尺寸
        .toBuffer();

      // 转换为浮点数组并归一化
      const tensor = new Float32Array(224 * 224 * 3);
      for (let i = 0; i < image.length; i += 3) {
        tensor[i] = image[i] / 255.0;
        tensor[i + 1] = image[i + 1] / 255.0;
        tensor[i + 2] = image[i + 2] / 255.0;
      }

      return tensor;
    } catch (error) {
      this.logError('preprocessImage', error, { imagePath });
      throw new Error(ERROR_MESSAGES.IMAGE_PROCESS_FAILED);
    }
  }

  // 分类图像
  async classifyImage(imagePath, modelName = APP_CONFIG.models.defaultModel) {
    try {
      this.logInfo('classifyImage', '开始图像分类', { imagePath, modelName });
      
      // 检查模型是否存在
      const modelPath = path.resolve(__dirname, '../../', APP_CONFIG.models.path, `${modelName}.onnx`);
      this.logInfo('classifyImage', `模型路径: ${modelPath}`);
      
      try {
        await fs.access(modelPath);
      } catch (error) {
        throw new Error(`模型文件不存在: ${modelPath}`);
      }

      // 检查模型标签是否存在
      if (!this.modelLabels.has(modelName)) {
        throw new Error(`模型标签未加载: ${modelName}`);
      }

      // 加载会话
      const session = this.models.get(modelName);
      if (!session) {
        throw new Error(`无法加载模型会话: ${modelName}`);
      }

      // 获取输入张量名称
      const inputNames = session.inputNames;
      this.logInfo('classifyImage', '模型输入名称', { inputNames });

      // 获取输出张量名称
      const outputNames = session.outputNames;
      this.logInfo('classifyImage', '模型输出名称', { outputNames });

      // 预处理图像
      const tensor = await this.preprocessImage(imagePath);
      const inputTensor = new ort.Tensor('float32', tensor, [1, 3, 224, 224]);
      
      // 运行推理
      const results = await session.run({ [inputNames[0]]: inputTensor });
      this.logInfo('classifyImage', '模型推理完成', { results });
      
      // 检查输出张量
      const outputTensor = results[outputNames[0]];
      if (!outputTensor) {
        throw new Error(`模型输出张量未找到，可用输出: ${Object.keys(results).join(', ')}`);
      }

      const output = outputTensor.data;
      if (!output) {
        throw new Error('模型输出数据为空');
      }

      // 获取前5个最可能的类别
      const predictions = Array.from(output)
        .map((score, index) => ({
          label: this.modelLabels.get(modelName).names[index],
          confidence: score
        }))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);

      this.logInfo('classifyImage', '图像分类完成', { modelName, predictions });
      return {
        model: modelName,
        predictions
      };
    } catch (error) {
      this.logError('classifyImage', error, { imagePath, modelName });
      throw error;
    }
  }

  // 关闭服务
  async close() {
    try {
      this.logInfo('close', '开始关闭分类服务');
      
      // 释放所有模型会话
      for (const [modelName, session] of this.models) {
        try {
          await session.release();
          this.logInfo('close', `已释放模型会话: ${modelName}`);
        } catch (error) {
          this.logError('close', error, { modelName });
        }
      }
      
      // 清空模型和标签映射
      this.models.clear();
      this.modelLabels.clear();
      
      this.logInfo('close', '分类服务已关闭');
    } catch (error) {
      this.logError('close', error);
      throw error;
    }
  }
} 