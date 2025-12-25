/**
 * 样板服务
 * 样板管理业务逻辑
 */

const { PrismaClient } = require('@prisma/client');
const FileService = require('./file.service');

const prisma = new PrismaClient();

class PatternService {
  /**
   * 创建样板
   */
  static async create(data) {
    const { name, size, category, fileUrl, description, designId } = data;

    const pattern = await prisma.pattern.create({
      data: {
        name,
        size,
        category,
        fileUrl,
        description,
        designId: designId ? parseInt(designId) : null
      },
      include: {
        design: true
      }
    });

    return pattern;
  }

  /**
   * 获取所有样板（支持筛选）
   */
  static async findAll(filters = {}) {
    const { category, size, designId, page = 1, limit = 20 } = filters;

    const where = {};
    if (category) where.category = category;
    if (size) where.size = size;
    if (designId) where.designId = parseInt(designId);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [patterns, total] = await Promise.all([
      prisma.pattern.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          design: true
        }
      }),
      prisma.pattern.count({ where })
    ]);

    return {
      patterns,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    };
  }

  /**
   * 根据 ID 查询样板
   */
  static async findById(id) {
    const pattern = await prisma.pattern.findUnique({
      where: { id: parseInt(id) },
      include: {
        design: true
      }
    });

    if (!pattern) {
      throw new Error('样板不存在');
    }

    return pattern;
  }

  /**
   * 更新样板
   */
  static async update(id, data) {
    const { name, size, category, description, designId } = data;

    // 检查是否存在
    const existing = await this.findById(id);

    // 如果有新文件，删除旧文件
    if (data.fileUrl && data.fileUrl !== existing.fileUrl) {
      await FileService.deleteFile(existing.fileUrl);
    }

    const pattern = await prisma.pattern.update({
      where: { id: parseInt(id) },
      data: {
        ...(name !== undefined && { name }),
        ...(size !== undefined && { size }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(designId !== undefined && { designId: designId ? parseInt(designId) : null }),
        ...(data.fileUrl !== undefined && { fileUrl: data.fileUrl })
      },
      include: {
        design: true
      }
    });

    return pattern;
  }

  /**
   * 删除样板
   */
  static async delete(id) {
    const pattern = await this.findById(id);

    // 删除关联文件
    await FileService.deleteFile(pattern.fileUrl);

    // 删除数据库记录
    await prisma.pattern.delete({
      where: { id: parseInt(id) }
    });

    return { message: '样板已删除' };
  }

  /**
   * 根据设计稿 ID 获取关联样板
   */
  static async findByDesignId(designId) {
    return await prisma.pattern.findMany({
      where: { designId: parseInt(designId) },
      orderBy: { createdAt: 'desc' }
    });
  }
}

module.exports = PatternService;
