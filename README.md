# 摄影师作品集 + Link-in-Bio

基于 Notion 的摄影师作品集网站，集成微信、Instagram、小红书、抖音等社交媒体链接。

## 功能

- **作品集展示**：从 Notion 数据库或本地配置拉取摄影作品
- **Link-in-Bio**：集中展示社交媒体链接，适配移动端
- **Notion 集成**：支持 Notion API 动态更新内容

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 预览。

## 配置 Notion（可选）

1. 复制 `.env.example` 为 `.env.local`
2. 按 [NOTION_SETUP.md](./NOTION_SETUP.md) 创建 Integration 和数据库
3. 填写环境变量后重启开发服务器

未配置时使用内置默认数据。

## 自定义配置

编辑 `src/lib/config.ts` 可修改：

- 摄影师姓名、简介、头像
- 默认社交链接
- 默认作品（无 Notion 时展示）

## 部署

```bash
npm run build
npm start
```

可部署至 Vercel、Netlify 等平台，记得配置环境变量。
