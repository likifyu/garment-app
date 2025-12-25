/**
 * 文件上传中间件配置
 * 使用 Multer 处理 multipart/form-data
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 确保上传目录存在
const uploadDirs = {
  design: path.join(__dirname, '../../uploads/designs'),
  pattern: path.join(__dirname, '../../uploads/patterns')
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 存储配置
const storage = multer.diskStorage({
  // 文件存储目录
  destination: (req, file, cb) => {
    const uploadType = req.body.type || 'design';
    const dir = uploadDirs[uploadType] || uploadDirs.design;
    cb(null, dir);
  },

  // 文件名：时间戳 + 原始文件名
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  // 允许的图片格式
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  // 允许的文件格式（样板文件）
  const allowedFileTypes = /pdf|dwg|dxf|ai|psd/;

  const extname = allowedImageTypes.test(path.extname(file.originalname).toLowerCase()) ||
                  allowedFileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = allowedImageTypes.test(file.mimetype) ||
                   allowedFileTypes.test(file.mimetype);

  if (extname || mimetype) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件格式。支持的格式：图片(jpg,png,gif,webp)、文件(pdf,dwg,dxf,ai,psd)'));
  }
};

// Multer 实例
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 限制 50MB
  }
});

// 导出不同的上传配置
module.exports = {
  // 单个设计稿图片
  designImage: upload.single('image'),

  // 单个样板文件
  patternFile: upload.single('file'),

  // 多个图片
  multipleImages: upload.array('images', 10)
};
