/**
 * 文件上传控制器
 */

const FileService = require('../services/file.service');

class UploadController {
  /**
   * 上传设计稿图片
   */
  static async uploadDesignImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '请选择要上传的图片'
        });
      }

      const imageUrl = FileService.saveFile(req.file);

      res.json({
        success: true,
        data: {
          imageUrl,
          filename: req.file.filename,
          size: req.file.size
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 上传样板文件
   */
  static async uploadPatternFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: '请选择要上传的文件'
        });
      }

      const fileUrl = FileService.saveFile(req.file);

      res.json({
        success: true,
        data: {
          fileUrl,
          filename: req.file.filename,
          size: req.file.size
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 批量上传图片
   */
  static async uploadMultipleImages(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: '请选择要上传的图片'
        });
      }

      const imageUrls = req.files.map(file => FileService.saveFile(file));

      res.json({
        success: true,
        data: {
          imageUrls,
          count: req.files.length
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UploadController;
