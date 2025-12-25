/**
 * 设计稿控制器
 * 处理 HTTP 请求和响应
 */

const DesignService = require('../services/design.service');

class DesignController {
  /**
   * 创建设计稿
   */
  static async create(req, res, next) {
    try {
      const { title, description, category, season, designer, status } = req.body;
      const imageUrl = req.file ? req.file.path : req.body.imageUrl;

      const design = await DesignService.create({
        title,
        description,
        imageUrl: imageUrl || '/uploads/designs/default.png',
        category,
        season,
        designer,
        status
      });

      res.status(201).json({
        success: true,
        data: design
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取设计稿列表
   */
  static async findAll(req, res, next) {
    try {
      const { category, designer, status, page, limit } = req.query;

      const result = await DesignService.findAll({
        category,
        designer,
        status,
        page,
        limit
      });

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取单个设计稿
   */
  static async findById(req, res, next) {
    try {
      const { id } = req.params;

      const design = await DesignService.findById(id);

      res.json({
        success: true,
        data: design
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新设计稿
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, category, season, status } = req.body;

      const imageUrl = req.file ? req.file.path : req.body.imageUrl;

      const design = await DesignService.update(id, {
        title,
        description,
        category,
        season,
        status,
        imageUrl
      });

      res.json({
        success: true,
        data: design
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除设计稿
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      await DesignService.delete(id);

      res.json({
        success: true,
        message: '设计稿已删除'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 创建设计稿版本
   */
  static async createVersion(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
      const imageUrl = req.file ? req.file.path : req.body.imageUrl;

      const version = await DesignService.createVersion(id, {
        title,
        description,
        imageUrl
      });

      res.status(201).json({
        success: true,
        data: version
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取设计稿版本列表
   */
  static async getVersions(req, res, next) {
    try {
      const { id } = req.params;

      const versions = await DesignService.getVersions(id);

      res.json({
        success: true,
        data: versions
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DesignController;
