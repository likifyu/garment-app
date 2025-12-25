/**
 * 样板控制器
 */

const PatternService = require('../services/pattern.service');

class PatternController {
  /**
   * 创建样板
   */
  static async create(req, res, next) {
    try {
      const { name, size, category, description, designId } = req.body;
      const fileUrl = req.file ? req.file.path : req.body.fileUrl;

      const pattern = await PatternService.create({
        name,
        size,
        category,
        fileUrl: fileUrl || '/uploads/patterns/default.pdf',
        description,
        designId
      });

      res.status(201).json({
        success: true,
        data: pattern
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 获取样板列表
   */
  static async findAll(req, res, next) {
    try {
      const { category, size, designId, page, limit } = req.query;

      const result = await PatternService.findAll({
        category,
        size,
        designId,
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
   * 获取单个样板
   */
  static async findById(req, res, next) {
    try {
      const { id } = req.params;

      const pattern = await PatternService.findById(id);

      res.json({
        success: true,
        data: pattern
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 更新样板
   */
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, size, category, description, designId } = req.body;
      const fileUrl = req.file ? req.file.path : req.body.fileUrl;

      const pattern = await PatternService.update(id, {
        name,
        size,
        category,
        description,
        designId,
        fileUrl
      });

      res.json({
        success: true,
        data: pattern
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 删除样板
   */
  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      await PatternService.delete(id);

      res.json({
        success: true,
        message: '样板已删除'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 根据设计稿获取样板
   */
  static async findByDesignId(req, res, next) {
    try {
      const { designId } = req.params;

      const patterns = await PatternService.findByDesignId(designId);

      res.json({
        success: true,
        data: patterns
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PatternController;
