import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ImageService } from '../image.service.mjs';
import { ImageDAO } from '../../dao/image.dao.mjs';
import { ImageStatus } from '../../../types/common.ts';

// 模拟ImageDAO
vi.mock('../../dao/image.dao.mjs', () => {
  return {
    ImageDAO: vi.fn()
  };
});

describe('ImageService', () => {
  let imageService;
  let mockImageDAO;

  beforeEach(() => {
    // 清除所有模拟
    vi.clearAllMocks();
    
    // 创建ImageDAO的模拟实例
    mockImageDAO = {
      createImage: vi.fn(),
      getImage: vi.fn(),
      updateImage: vi.fn(),
      deleteImage: vi.fn(),
      listImages: vi.fn(),
      updateStatus: vi.fn(),
      imageExists: vi.fn()
    };

    // 设置ImageDAO的构造函数返回模拟实例
    ImageDAO.mockImplementation(() => mockImageDAO);

    // 创建服务实例
    imageService = new ImageService();
  });

  describe('createImage', () => {
    it('应该成功创建图片', async () => {
      const imageData = {
        name: 'test.jpg',
        path: '/path/to/test.jpg',
        size: 1024
      };
      const expectedId = '123';

      mockImageDAO.createImage.mockResolvedValue(expectedId);

      const result = await imageService.createImage(imageData);

      expect(result.success).toBe(true);
      expect(result.data.id).toBe(expectedId);
      expect(mockImageDAO.createImage).toHaveBeenCalledWith(imageData);
    });

    it('应该在创建失败时返回错误', async () => {
      const imageData = { name: 'test.jpg' };
      const error = new Error('创建失败');

      mockImageDAO.createImage.mockRejectedValue(error);

      const result = await imageService.createImage(imageData);

      expect(result.success).toBe(false);
      expect(result.error).toBe(error.message);
    });
  });

  describe('getImage', () => {
    it('应该成功获取图片', async () => {
      const imageId = '123';
      const expectedImage = {
        id: imageId,
        name: 'test.jpg',
        status: ImageStatus.READY
      };

      mockImageDAO.getImage.mockResolvedValue(expectedImage);

      const result = await imageService.getImage(imageId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(expectedImage);
      expect(mockImageDAO.getImage).toHaveBeenCalledWith(imageId);
    });

    it('应该在图片不存在时返回错误', async () => {
      const imageId = '123';

      mockImageDAO.getImage.mockResolvedValue(null);

      const result = await imageService.getImage(imageId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('图片不存在');
    });
  });

  describe('updateImage', () => {
    it('应该成功更新图片', async () => {
      const imageId = '123';
      const updateData = { name: 'updated.jpg' };

      mockImageDAO.imageExists.mockResolvedValue(true);
      mockImageDAO.updateImage.mockResolvedValue(true);

      const result = await imageService.updateImage(imageId, updateData);

      expect(result.success).toBe(true);
      expect(result.data.updated).toBe(true);
      expect(mockImageDAO.updateImage).toHaveBeenCalledWith(imageId, updateData);
    });

    it('应该在图片不存在时返回错误', async () => {
      const imageId = '123';
      const updateData = { name: 'updated.jpg' };

      mockImageDAO.imageExists.mockResolvedValue(false);

      const result = await imageService.updateImage(imageId, updateData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('图片不存在');
    });
  });

  describe('deleteImage', () => {
    it('应该成功删除图片', async () => {
      const imageId = '123';

      mockImageDAO.imageExists.mockResolvedValue(true);
      mockImageDAO.deleteImage.mockResolvedValue(true);

      const result = await imageService.deleteImage(imageId);

      expect(result.success).toBe(true);
      expect(result.data.deleted).toBe(true);
      expect(mockImageDAO.deleteImage).toHaveBeenCalledWith(imageId);
    });

    it('应该在图片不存在时返回错误', async () => {
      const imageId = '123';

      mockImageDAO.imageExists.mockResolvedValue(false);

      const result = await imageService.deleteImage(imageId);

      expect(result.success).toBe(false);
      expect(result.error).toBe('图片不存在');
    });
  });

  describe('listImages', () => {
    it('应该成功获取图片列表', async () => {
      const filters = { status: ImageStatus.READY };
      const options = { page: 1, pageSize: 10 };
      const expectedImages = [
        { id: '1', name: 'test1.jpg' },
        { id: '2', name: 'test2.jpg' }
      ];

      mockImageDAO.listImages.mockResolvedValue(expectedImages);

      const result = await imageService.listImages(filters, options);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(expectedImages);
      expect(mockImageDAO.listImages).toHaveBeenCalledWith(filters, options);
    });

    it('应该在获取列表失败时返回错误', async () => {
      const error = new Error('获取列表失败');

      mockImageDAO.listImages.mockRejectedValue(error);

      const result = await imageService.listImages();

      expect(result.success).toBe(false);
      expect(result.error).toBe(error.message);
    });
  });

  describe('updateImageStatus', () => {
    it('应该成功更新图片状态', async () => {
      const imageId = '123';
      const status = ImageStatus.PROCESSING;

      mockImageDAO.imageExists.mockResolvedValue(true);
      mockImageDAO.updateStatus.mockResolvedValue(true);

      const result = await imageService.updateImageStatus(imageId, status);

      expect(result.success).toBe(true);
      expect(result.data.updated).toBe(true);
      expect(mockImageDAO.updateStatus).toHaveBeenCalledWith(imageId, status);
    });

    it('应该在图片不存在时返回错误', async () => {
      const imageId = '123';
      const status = ImageStatus.PROCESSING;

      mockImageDAO.imageExists.mockResolvedValue(false);

      const result = await imageService.updateImageStatus(imageId, status);

      expect(result.success).toBe(false);
      expect(result.error).toBe('图片不存在');
    });
  });
}); 