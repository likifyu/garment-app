# 服装设计管理系统 - GitHub 部署说明

## 📋 项目状态

- ✅ 后端服务运行中: http://localhost:3000
- ✅ 前端服务运行中: http://localhost:5174
- ✅ 数据库已初始化
- ✅ 应用已在浏览器验证成功

## 🚀 推送到 GitHub

### 方法一：通过 GitHub 网页创建仓库

1. **创建仓库**
   - 访问: https://github.com/new
   - 仓库名称: `garment-app`
   - 描述: `服装设计管理系统 - Garment Design Management System`
   - 设为公开 (Public)
   - 不要初始化 README（我们已有代码）

2. **推送代码**
   ```bash
   cd F:/Dev/garment-app
   git remote add origin https://github.com/likifyu/garment-app.git
   git branch -M main
   git push -u origin main
   ```

### 方法二：创建有权限的 GitHub 令牌

1. **生成新令牌**
   - 访问: https://github.com/settings/tokens
   - 点击 "Generate new token" → "Generate new token (classic)"
   - 勾选权限:
     - ✅ `repo` (完整的仓库控制权限)
     - ✅ `public_repo` (创建公开仓库)
   - 生成并复制令牌

2. **使用新令牌**
   ```bash
   # 设置新令牌（将 YOUR_NEW_TOKEN 替换为新令牌）
   git remote set-url origin https://YOUR_NEW_TOKEN@github.com/likifyu/garment-app.git

   # 推送
   git push -u origin main
   ```

### 方法三：使用 SSH 推荐方式

1. **生成 SSH 密钥**
   ```bash
   ssh-keygen -t ed25519 -C "likifyu@github.com"
   # 按回车使用默认路径，可设置密码或留空
   ```

2. **添加到 GitHub**
   - 复制公钥: `cat ~/.ssh/id_ed25519.pub`
   - 访问: https://github.com/settings/ssh/new
   - 粘贴公钥并保存

3. **使用 SSH 推送**
   ```bash
   git remote set-url origin git@github.com:likifyu/garment-app.git
   git push -u origin main
   ```

## 📦 项目归档

如果需要备份或迁移，项目归档已创建：

- **路径**: `F:/Dev/garment-app.tar.gz` (48KB)
- **内容**: 完整源代码（排除 node_modules 和数据库）

## 🔧 快速启动

```bash
# 后端
cd F:/Dev/garment-app/backend
npm install
npm start

# 前端（新终端）
cd F:/Dev/garment-app/frontend
npm install
npm run dev
```

访问: http://localhost:5174

## 📊 项目结构

```
garment-app/
├── backend/          # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── models/
│   └── uploads/
├── frontend/         # Vue 3 + Element Plus
│   └── src/
│       ├── views/
│       ├── components/
│       ├── stores/
│       └── api/
└── README.md
```

## ⚠️ 安全提醒

您之前分享的 GitHub 令牌 `ghp_...` 已暴露，建议：
1. 立即撤销: https://github.com/settings/tokens
2. 使用 SSH 或新令牌进行 Git 操作

## ✨ 已完成功能

- ✅ 用户认证系统
- ✅ 设计稿上传和管理
- ✅ 样板信息管理
- ✅ 设计版本历史
- ✅ 文件上传（图片、PDF、CAD）
- ✅ 响应式界面
- ✅ RESTful API

---

项目已完成，可在浏览器访问 http://localhost:5174 查看运行效果！
