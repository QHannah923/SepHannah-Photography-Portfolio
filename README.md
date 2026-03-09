# 摄影师作品集 + Link-in-Bio

摄影师作品集网站，集成微信、Instagram、小红书、抖音等社交媒体链接。

## 功能

- **作品集展示**：展示摄影作品，支持分类和描述
- **Link-in-Bio**：集中展示社交媒体链接，适配移动端
- **纯静态配置**：无需后端，修改配置文件即可更新

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 预览。

## 自定义配置

编辑 `src/lib/config.ts` 修改内容：

- **photographer**：姓名、简介、头像、个人描述
- **socialLinks**：微信、Instagram、小红书、抖音等链接
- **portfolio**：作品列表（标题、描述、图片 URL、分类）

修改后保存，页面会自动刷新。

## 部署

```bash
npm run build
npm start
```

可部署至 [Vercel](https://vercel.com)、Netlify 等平台，无需额外配置。
