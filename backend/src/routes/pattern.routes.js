/**
 * 样板路由
 */

const express = require('express');
const router = express.Router();
const PatternController = require('../controllers/pattern.controller');
const { patternFile } = require('../middlewares/upload');

// CRUD 路由
router.post('/', patternFile, PatternController.create);             // 创建
router.get('/', PatternController.findAll);                         // 列表
router.get('/:id', PatternController.findById);                     // 详情
router.put('/:id', patternFile, PatternController.update);          // 更新
router.delete('/:id', PatternController.delete);                    // 删除

// 根据设计稿获取样板
router.get('/design/:designId', PatternController.findByDesignId);

module.exports = router;
