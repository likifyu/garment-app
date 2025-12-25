/**
 * 文件服务
 * 处理文件存储、删除等操作
 */

const fs = require('fs').promises;
const path = require('path');

class FileService {
  /**
   * 保存上传的文件信息
   * @param {Object} file - Multer 上传的文件对象
   * @returns {String} 文件的访问 URL
   */
  static saveFile(file) {
    // 返回相对路径，用于存储到数据库
    const relativePath = file.path.replace(/\\/g, '/').split('/uploads/')[1];
    return `/uploads/${relativePath}`;
  }

  /**
   * 删除文件
   * @param {String} fileUrl - 文件的 URL 路径
   */
  static async deleteFile(fileUrl) {
    try {
      if (!fileUrl) return;

      // 从 URL 提取文件路径
      const filePath = path.join(__dirname, '../../', fileUrl.replace(/^\//, ''));

      // 检查文件是否存在
      await fs.access(filePath);

      // 删除文件
      await fs.unlink(filePath);
      console.log(`文件已删除: ${filePath}`);
    } catch (error) {
      console.error('删除文件失败:', error.message);
      // 不抛出错误，允许继续执行
    }
  }

  /**
   * 批量删除文件
   * @param {Array<String>} fileUrls - 文件 URL 数组
   */
  static async deleteFiles(fileUrls) {
    if (!Array.isArray(fileUrls)) return;

    for (const url of fileUrls) {
      await this.deleteFile(url);
    }
  }
}

module.exports = FileService;
