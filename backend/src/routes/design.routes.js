/**
 * 设计稿路由
 */

const express = require('express');
const router = express.Router();
const DesignController = require('../controllers/design.controller');
const { designImage } = require('../middlewares/upload');

// CRUD 路由
router.post('/', designImage, DesignController.create);              // 创建
router.get('/', DesignController.findAll);                          // 列表
router.get('/:id', DesignController.findById);                      // 详情
router.put('/:id', designImage, DesignController.update);           // 更新
router.delete('/:id', DesignController.delete);                     // 删除

// 版本管理路由
router.post('/:id/versions', designImage, DesignController.createVersion);  // 创建版本
router.get('/:id/versions', DesignController.getVersions);                  // 获取版本列表

module.exports = router;
