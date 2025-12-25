/**
 * 设计稿服务
 * 核心业务逻辑层
 */

const { PrismaClient } = require('@prisma/client');
const FileService = require('./file.service');

const prisma = new PrismaClient();

class DesignService {
  /**
   * 创建设计稿
   */
  static async create(data) {
    const { title, description, imageUrl, category, season, designer, status } = data;

    const design = await prisma.design.create({
      data: {
        title,
        description,
        imageUrl,
        category,
        season,
        designer,
        status: status || 'draft'
      }
    });

    // 创建初始版本
    await prisma.designVersion.create({
      data: {
        designId: design.id,
        version: 1,
        title: '初始版本',
        description: '设计稿创建',
        imageUrl: design.imageUrl
      }
    });

    return this.findById(design.id);
  }

  /**
   * 获取所有设计稿（支持筛选和分页）
   */
  static async findAll(filters = {}) {
    const { category, designer, status, page = 1, limit = 20 } = filters;

    const where = {};
    if (category) where.category = category;
    if (designer) where.designer = designer;
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [designs, total] = await Promise.all([
      prisma.design.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          patterns: true,
          _count: {
            select: { versions: true }
          }
        }
      }),
      prisma.design.count({ where })
    ]);

    return {
      designs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    };
  }

  /**
   * 根据 ID 查询设计稿
   */
  static async findById(id) {
    const design = await prisma.design.findUnique({
      where: { id: parseInt(id) },
      include: {
        patterns: true,
        versions: {
          orderBy: { version: 'desc' }
        }
      }
    });

    if (!design) {
      throw new Error('设计稿不存在');
    }

    return design;
  }

  /**
   * 更新设计稿
   */
  static async update(id, data) {
    const { title, description, category, season, status } = data;

    // 检查是否存在
    const existing = await this.findById(id);

    // 如果有新图片，删除旧图片
    if (data.imageUrl && data.imageUrl !== existing.imageUrl) {
      await FileService.deleteFile(existing.imageUrl);
    }

    const design = await prisma.design.update({
      where: { id: parseInt(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(season !== undefined && { season }),
        ...(status !== undefined && { status }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl })
      },
      include: {
        patterns: true,
        versions: true
      }
    });

    return design;
  }

  /**
   * 删除设计稿
   */
  static async delete(id) {
    const design = await this.findById(id);

    // 删除关联图片
    await FileService.deleteFile(design.imageUrl);

    // 删除版本图片
    for (const version of design.versions) {
      if (version.imageUrl) {
        await FileService.deleteFile(version.imageUrl);
      }
    }

    // 删除数据库记录（级联删除关联的样板和版本）
    await prisma.design.delete({
      where: { id: parseInt(id) }
    });

    return { message: '设计稿已删除' };
  }

  /**
   * 创建新版本
   */
  static async createVersion(designId, data) {
    const { title, description, imageUrl } = data;

    // 获取当前最新版本号
    const latestVersion = await prisma.designVersion.findFirst({
      where: { designId: parseInt(designId) },
      orderBy: { version: 'desc' }
    });

    const newVersionNumber = (latestVersion?.version || 0) + 1;

    const version = await prisma.designVersion.create({
      data: {
        designId: parseInt(designId),
        version: newVersionNumber,
        title,
        description,
        imageUrl
      }
    });

    return version;
  }

  /**
   * 获取设计稿的所有版本
   */
  static async getVersions(designId) {
    return await prisma.designVersion.findMany({
      where: { designId: parseInt(designId) },
      orderBy: { version: 'desc' }
    });
  }
}

module.exports = DesignService;
