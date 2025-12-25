/**
 * 文件上传路由
 */

const express = require('express');
const router = express.Router();
const UploadController = require('../controllers/upload.controller');
const { designImage, patternFile, multipleImages } = require('../middlewares/upload');

// 上传设计稿图片
router.post('/design', designImage, UploadController.uploadDesignImage);

// 上传样板文件
router.post('/pattern', patternFile, UploadController.uploadPatternFile);

// 批量上传图片
router.post('/images', multipleImages, UploadController.uploadMultipleImages);

module.exports = router;
