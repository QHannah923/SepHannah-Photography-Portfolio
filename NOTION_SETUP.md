# Notion 作品集 + Link-in-Bio 配置指南

本项目支持从 Notion 数据库动态拉取作品集和社交媒体链接，实现「Notion 即 CMS」的创作工作流。

## 一、创建 Notion Integration

1. 打开 [Notion Integrations](https://www.notion.so/my-integrations)
2. 点击 **New integration**
3. 填写名称（如「作品集网站」），选择关联的 Workspace
4. 复制 **Internal Integration Secret**，填入 `.env.local` 的 `NOTION_API_KEY`

## 二、作品集数据库设置

### 1. 创建数据库

在 Notion 中新建 **Full page database** 或 **Inline database**，推荐属性结构：

| 属性名 (英文) | 属性名 (中文) | 类型   | 说明           |
|---------------|---------------|--------|----------------|
| Title         | 标题          | Title  | 作品标题       |
| Cover         | 封面图        | Files  | 主图（可多图） |
| Description   | 描述          | Text   | 作品简述       |
| Category      | 分类          | Select | 如：街拍/人像/风光 |
| Date          | 日期          | Date   | 拍摄或发布日期 |

### 2. 分享给 Integration

- 打开作品集数据库页面
- 点击右上角 **⋯** → **Add connections**
- 选择你刚创建的 Integration

### 3. 获取数据库 ID

数据库 URL 格式：`https://www.notion.so/workspace/xxxxx?v=...`

- `xxxxx` 就是 **Database ID**（32 位字符串，可能含 `-`）
- 填入 `.env.local` 的 `NOTION_PORTFOLIO_DB_ID`

## 三、链接数据库设置

### 1. 创建数据库

新建数据库，用于管理社交媒体链接：

| 属性名 (英文) | 属性名 (中文) | 类型   | 说明                                      |
|---------------|---------------|--------|-------------------------------------------|
| Label         | 名称          | Title  | 显示文本，如「微信」「Instagram」         |
| URL           | 链接          | URL    | 跳转地址                                  |
| Platform      | 平台          | Select | wechat / instagram / xiaohongshu / douyin |
| Order         | 排序          | Number | 数字越小越靠前                            |

### 2. 分享与获取 ID

- 同样通过 **Add connections** 分享给 Integration
- 复制数据库 URL 中的 ID，填入 `NOTION_LINKS_DB_ID`

## 四、平台选项说明

| Platform 值 | 对应平台 | 说明                |
|-------------|----------|---------------------|
| wechat      | 微信     | 可填公众号/个人主页 |
| instagram   | Instagram | 个人主页链接      |
| xiaohongshu | 小红书   | 个人主页链接        |
| douyin      | 抖音     | 个人主页链接        |

## 五、纯 Notion 使用（不部署网站）

若仅想用 Notion 作为 Link-in-Bio：

1. 使用 Notion 官方 [Link in Bio 模板](https://www.notion.so/templates/category/link-in-bio)
2. 在页面中添加 Callout 或 Database，手动维护链接
3. 将页面设为 **Share** → **Publish to web**，获得公开链接
4. 将该链接填入 Instagram / 小红书 / 抖音 的「个人简介链接」

## 六、环境变量示例

复制 `.env.example` 为 `.env.local`：

```bash
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxx
NOTION_PORTFOLIO_DB_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_LINKS_DB_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

不配置时，网站使用 `src/lib/config.ts` 中的默认数据运行。
