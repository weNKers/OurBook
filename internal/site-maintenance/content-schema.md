---
title: "内容管理约定"
description: "内容管理约定相关内容。"
contentType: guide
keywords:
  - "内容管理约定"
---

# 内容管理约定

新文章建议使用 frontmatter，便于搜索、SEO 和后续批量维护：

```yaml
---
title: 北京大学
description: 北京大学的学校概况、专业和校园体验。
author: 作者名
keywords:
  - 北京大学
  - 学校介绍
contentType: university-article
sidebarGroup: "院系与专业"
sidebarTitle: "经济学院"
updated: 2026-08-03
---
```

其中 `title`、`description`、`author`、`keywords` 会进入站内搜索的补充索引；`contentType` 用于按内容类型统计。大学文章可选填写 `sidebarGroup`，用于把学校侧边栏中的文章按主题归组，例如“院系与专业”“校园与经验”；可用 `sidebarTitle` 为侧边栏提供更清晰的短标题，而不改变文章标题。未填写分类的文章归入“其他文章”。旧文章可以继续使用现有格式。学校内容按地区、城市/省份和学校分层保存；旧学校 URL 不提供兼容重定向，站内链接、canonical 和 sitemap 使用新路由。

资源优先使用文章附近的相对路径；站点公共图标、站点封面等才放在 `docs/public/`。历史设计稿和未发布的 A/B 资源放在仓库根目录的 `assets/source/`，不会被发布。

提交前运行：

```bash
npm run check
```

该命令会执行内容、资源和内部链接审计，构建 VitePress 站点，并验证页面路由、SEO 元数据、搜索索引、邮件反馈和 sitemap。资源审计会检查本地图片、媒体和下载文件是否存在；文本审计会检查 frontmatter 与一级标题。
