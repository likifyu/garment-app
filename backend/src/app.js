/**
 * 服装设计管理系统 - 后端入口
 * Express + Prisma + SQLite
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

// 导入路由
const designRoutes = require('./routes/design.routes');
const uploadRoutes = require('./routes/upload.routes');
const patternRoutes = require('./routes/pattern.routes');

// 创建 Express 应用
const app = express();

// 配置
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = path.join(__dirname, '../uploads');

// 中间件
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码请求体

// 静态文件服务 - 提供上传的文件访问
app.use('/uploads', express.static(UPLOAD_DIR));

// API 路由
app.use('/api/designs', designRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/patterns', patternRoutes);

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '服装设计管理系统后端运行中',
    timestamp: new Date().toISOString()
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.path
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);

  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   服装设计管理系统 - 后端服务已启动    ║
╠════════════════════════════════════════╣
║   地址: http://localhost:${PORT}
║   环境: ${process.env.NODE_ENV || 'development'}
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
